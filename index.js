const mongoose = require('mongoose');
const { config } = require('dotenv');

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

let port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server is listening on ${port}....`);
});

process.on("unhandledRejection", (reason) => {
    console.log("error : ", reason.message);
    console.log("in the handler");
});