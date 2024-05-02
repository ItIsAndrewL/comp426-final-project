import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import Jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { stringify } from "querystring";

import cors from "cors";

import { User } from "./user.js";

const app = express();
const router = express.Router();

const secretKey = process.env.JSONSECRETKEY!;
const options = { expiresIn: "1w" };

// Spotify API Configuration
const clientID = process.env.SPOTIFYCLIENTID!;
const clientSecret = process.env.SPOTIFYCLIENTSECRET!;
const redirectURI = "http://localhost:3000/api/callback";

// app.use(cors({origin: 'localhost:3000'}));
app.use(bodyParser.json()).use("/api", router).use(cors());

const verifyJWT = (req: any, res: any, next: any) => {
  const token = req.headers["jwt-token"];

  if (!token) {
    res.status(401).json({ isAuth: false, message: "Token does not exist" });
  } else {
    Jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        res
          .status(401)
          .json({ isAuth: false, message: "User not authenticated" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

// router.options('/spotify-auth', function (req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.end();
// });

router.get("/spotify-auth", verifyJWT, (req, res) => {
  // TODO: Skip if user already has authorization code
  console.log("TRYING TO AUTH ON SPOTIFY!");
  let state = randomBytes(20).toString("hex");
  let scope = "user-read-private user-read-email";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      stringify({
        response_type: "code",
        client_id: clientID,
        scope: scope,
        redirect_uri: redirectURI,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  // ? Save user code in database here? I think we only need the refresh token
  console.log("SPOTIFY AUTHED!!");

  if (state === null) {
    res.status(500).send("Internal Server Error");
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirectURI,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientID + ":" + clientSecret).toString("base64"),
      },
      json: true,
    };
  }
});

router.get("/isAuth", verifyJWT, (req, res) => {
  // TODO: Add spotify auth check here and if it is bad, have frontend send request to auth again?
  res.json({ isAuth: true, message: "User is authenticated" });
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
