import express from "express";
import ViteExpress from "vite-express";
import { User } from "./user.js";


const app = express();
const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;
const options = {expiresIn: '1w'};
const jwt = require('jsonwebtoken');

app.use('/api/', router)

router.post("/signup", async (req, res) => {
  try{
    let user = await User.createUser(req.body);
    if(!user){
      res.status(400).send("Bad Request");
      return;
    }
    let token = jwt.sign(user.json(), secretKey, options);
    res.json({user: user.json(), token: token})
  }catch (e){
    console.log(e);
    res.status(500).send("Internal server error");
  }
});

router.get("/login", async (req, res) => {
  try{
    let user = await User.login(req.body);
    if(!user){
      res.status(404).send("Incorrect Username or Password");
      return;
    }
    let token = jwt.sign(user.json(), secretKey, options);
    res.json({user: user.json(), token: token})
  }catch (e){
    console.log(e)
    res.status(500).send("Internal server error");
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
