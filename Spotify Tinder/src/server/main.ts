import "dotenv/config"
import express from "express";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";
import Jwt from 'jsonwebtoken';

//import cors from 'cors'

import { User } from "./user.js";

const app = express();
const router = express.Router();
const secretKey = process.env.JSONSECRETKEY!;
const options = {expiresIn: '1w'};

//app.use(cors());
app.use(bodyParser.json());
app.use('/api', router)

const verifyJWT = (req: any, res: any, next: any) => {
  const token = req.headers["jwt-token"];

  if(!token){
    res.status(401).json({isAuth: false, message: "Token does not exist"});
  }else{
    Jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if(err){
        res.status(401).json({isAuth : false, message: 'User not authenticated'});
      } else{
        req.userId = decoded.id;
        next();
      }
    })
  }
}


router.get("/isAuth", verifyJWT, (req, res) => {
  res.json({isAuth: true, message: "User is authenticated"});
})

router.post("/signup", async (req, res) => {
  /**
   * Route for allowing users to signup to the website
   * 
   * Expecting body data in this form:
   * {userName: string, password: string}
   */
  if((typeof req.body.userName !== 'string') || (typeof req.body.password !== 'string')){
    res.status(400).send("Bad Request, check json body");
    return;
  }

  try{
    let user = await User.createUser(req.body.userName, req.body.password);
    if (!user) {
      res.status(404).send("That account already exists, please log in.");
      return;
    }
    // let token = Jwt.sign(user.json(), secretKey, options);
    // res.json({user: user.json(), token: token});
    res.send("Sign-Up Successful");
  }catch (e){
    console.log(e);
    res.status(500).send("Internal server error: " + e);
  }
});

router.post("/login", async (req, res) => {
  if((typeof req.body.userName !== 'string') || (typeof req.body.password !== 'string')){
    res.status(400).send("Bad Request, check json body");
    return;
  } 
  try{
    let user = await User.login(req.body.userName, req.body.password);
    if(!user){
      res.status(404).send("Incorrect Username or Password");
      return;
    }
    let token = Jwt.sign(user.json(), secretKey, options);
    res.json({isAuth: true, token: token});
  }catch (e){
    console.log(e);
    res.status(500).send("Internal server error");
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
