import express from 'express'
import bodyParser from 'body-parser'

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.get("/api", (req, res) => {
    res.send({ message: "Hello from Express!" });
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})