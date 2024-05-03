import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import Jwt from "jsonwebtoken";
import { stringify } from "querystring";

import cors from "cors";

import { User } from "./user.js";
import { Favorites } from "./favorites.js";

const app = express();
const router = express.Router();

const secretKey = process.env.JSONSECRETKEY!;
const options = { expiresIn: "2d" };

// Spotify API Configuration
const clientID = process.env.SPOTIFYCLIENTID!;
const clientSecret = process.env.SPOTIFYCLIENTSECRET!;

// app.use(cors({origin: 'localhost:3000'}));
app.use(bodyParser.json())
  .use("/api", router)
  //.use(cors());

const verifyJWT = (req: any, res: any, next: any) => {
  const token = req.headers["jwt-token"];

  if (!token) {
    res.status(401).json({ isAuth: false, message: "Token does not exist" });
  } else {
    Jwt.verify(token, secretKey, async (err: any, decoded: any) => {
      if (err) {
        res
          .status(401)
          .json({ isAuth: false, message: "User not authenticated" });
      } else {
        if (!await User.verify(decoded.id)) {
          return res.status(404).json({ isAuth: false, message: "User not found" });
        }
        req.userId = decoded.id;
        next();
      }
    });
  }
};

// Application Wide State for Spotify Access Tokens
let curr_token: string = "";
let exp_time: number = Date.now(); // Number of milliseconds past Jan 1, 1970 that the token will expire

const updateToken = async (req: any, res: any, next: any) => {
  if (exp_time > Date.now()) return next();

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(clientID + ':' + clientSecret).toString('base64')),
    },
  });

  let json: {"access_token": string, "token_type": string, "expires_in": number} = await response.json();
  curr_token = json.access_token;
  exp_time = Date.now() + (json.expires_in * 1000);
  next();
}

router.get("/get-track/:id", verifyJWT, updateToken, async (req, res) => {
  const response = await fetch('https://api.spotify.com/v1/tracks/' + req.params.id, {
    headers: {
      Authorization: 'Bearer ' + curr_token
    }
  });
  // TODO: Error handling here
  return res.json(await response.json());
});

router.get("/get-next-tracks", verifyJWT, updateToken, async (req, res) => {
  /**
   * Gets the track info of the next 10 tracks to display on the tinder-like feed
   * ! Do not assume that you will get 10 tracks, there may be less!!
   */
  const response = await fetch('https://api.spotify.com/v1/recommendations?' + 
    // Will be hard coded for now, but later will hope to provide their last liked songs
    stringify({
      limit: 10,
      seed_genres: "pop,indie-pop,rock,indie-rock",
      market: 'US'
    }), {
      headers: {
        Authorization: 'Bearer ' + curr_token
      }
    }
  );
  // TODO: Error Handling Here!
  if (response.ok) {
    let j = await response.json();
    return res.json(j.tracks);
  } else {
    return res.status(400).json({status: 400, error: "Error!"});
  }
});

// Routes for Favorites Storage

router.get("/favorites", verifyJWT, updateToken, async (req, res) => {
  /**
   * Gets a list of Favorites, ordered by most recently added by their id
   * 
   * @returns {id: number, song_id: string, song: Song_obj}[] list of json objects
   */
  let favorites: Favorites[] | null = await Favorites.get_user_favorites(req.userId);
  if (favorites == null) {
    return res.status(500).send("Internal Server Error.");
  }
  // TODO: Need to make a request for every 100 songs
  let ids = favorites.reduce((acc: string, val: Favorites) => acc += val.song_id + ",", "").slice(0, -1);
  const response = await fetch("https://api.spotify.com/v1/tracks?ids=" + ids, {
    headers: {
      Authorization: 'Bearer ' + curr_token
    }
  });

  if (!response.ok) {
    return res.status(500).send("Internal Server Error.");
  }

  let songs = (await response.json()).tracks;
  console.log(songs.length);

  return res.json(favorites.map((val, i) => val.to_json(songs[i])));
});

router.post("/favorite/:songId", verifyJWT, async (req, res) => {
  // TODO: Could possibly make sure that the songId is a valid spotify song id
  let added = await Favorites.add_favorite(req.userId, req.params.songId);
  if (added) {
    res.status(200).send("Added!");
  } else {
    res.status(500).send("Internal Server Error.");
  }
});

router.delete("/favorite/:id", verifyJWT, async (req, res) => {
  let id;
  try {
    id = Number(req.params.id);
  } catch (e) {
    return res.status(400).send("Request Invalid")
  }

  let worked = await Favorites.remove_favorite(id, req.userId);
  if (worked) {
    res.send("Success!");
  } else {
    res.status(404).send("Backend Error or did not exist!")
  }
});

// Sign Up / Login Routes

router.get("/isAuth", verifyJWT, (req, res) => {
  return res.json({ isAuth: true, message: "User is authenticated" });
});

router.post("/signup", async (req, res) => {
  /**
   * Route for allowing users to signup to the website
   *
   * Expecting body data in this form:
   * {userName: string, password: string}
   */
  if (
    typeof req.body.userName !== "string" ||
    typeof req.body.password !== "string"
  ) {
    res.status(400).send("Bad Request, check json body");
    return;
  }

  try {
    let user = await User.createUser(req.body.userName, req.body.password);
    if (!user) {
      res.status(404).send("That account already exists, please log in.");
      return;
    }
    // let token = Jwt.sign(user.json(), secretKey, options);
    // res.json({user: user.json(), token: token});
    res.send("Sign-Up Successful");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server error: " + e);
  }
});

router.post("/login", async (req, res) => {
  if (
    typeof req.body.userName !== "string" ||
    typeof req.body.password !== "string"
  ) {
    res.status(400).send("Bad Request, check json body");
    return;
  }
  try {
    let user = await User.login(req.body.userName, req.body.password);
    if (!user) {
      res.status(404).send("Incorrect Username or Password");
      return;
    }
    let token = Jwt.sign(user.json(), secretKey, options);
    res.json({ isAuth: true, token: token });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server error");
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
