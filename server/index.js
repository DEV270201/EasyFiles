const mongoose = require('mongoose');
const { config } = require('dotenv');

//loading the .env contents in the process.env variable
if(process.env.NODE_ENV === 'development') {
    config({ path: "./config.env", override:true });
}
const app = require("./app");

//connecting to the database
const connect_database = () => {
    mongoose.connect(
        process.env.NODE_ENV === 'development' ?
        process.env.DEV_DATABASE :
        process.env.PROD_DATABASE
    );
}

connect_database();

mongoose.connection.on("connected", () => {
      console.log("connected to the database successfully...");
});

mongoose.connection.on('error',(err)=>{
  console.log("cannot connect to the database :(");
  console.log("Database Connection Error : ",err);
});

process.on("unhandledRejection", (reason) => {
    console.log("error : ", reason.message);
    process.exit();
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is listening on ${port}....`);
});
