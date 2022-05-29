const express = require("express"); //this file requires express
const port = process.env.PORT || 5000 || testingcv.herokuapp.com; //use external server port OR local 5000
const app = express(); //instantiate express
require("./DB/mongoose"); //ensures mongoose connects and runs
const routes = require("./routes/index");

//takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded());

const cors = require("cors");
app.use(cors());

app.use("/", routes);
app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
