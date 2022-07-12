const mongoose = require('mongoose');
const { config } = require('dotenv');
require('./utils/Bucket');

//loading the .env contents in the process.env variable
config({ path: "./config.env" });
const app = require("./app");

//connecting to the database
const connect_database = () => {
    mongoose.connect(
        process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    );
}

connect_database();

mongoose.connection.on('error',(err)=>{
  console.log("cannot connect to the database :(");
  console.log("Database Connection Error : ",err);
});

process.on("unhandledRejection", (reason) => {
    console.log("error : ", reason.message);
    console.log("in the handler");
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is listening on ${port}....`);
});
