import express from "express";
const port = 3000;
const app = express();

app.listen(port, () => {
  console.log("server is up on port 3000");
});
