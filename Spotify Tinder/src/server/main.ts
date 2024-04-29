import express from "express";
import ViteExpress from "vite-express";
import { User } from "./user.js";
import  Jwt from 'jsonwebtoken';
import cors from 'cors'


const app = express();
const router = express.Router();
const secretKey = process.env.JSONSECRETKEY ?? '';
const options = {expiresIn: '1w'};

app.use(cors());
app.use('/api', router)

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if(!token){
    res.status(403).send('User not authenticated');
  }else{
    Jwt.verify(token, secretKey, (err, decoded) => {
      if(err){
        res.json({authenticated : false, message: 'User not authenticated'});
      } else{
        req.userId = decoded.id;
        next();
      }
    })
  }
}

router.get("/isAuth", verifyJWT, (req, res) => {
  res.json({authenticated: true, message: "User is authenticated"});
})

router.post("/signup", async (req, res) => {
  try{
    let user = await User.createUser(req.body);
    if(!user){
      res.status(400).send("Bad Request");
      return;
    }
    let token = Jwt.sign(user.json(),secretKey,options);
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
    let token = Jwt.sign(user.json(), secretKey, options);
    res.json({user: user.json(), token: token})
  }catch (e){
    console.log(e)
    res.status(500).send("Internal server error");
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
