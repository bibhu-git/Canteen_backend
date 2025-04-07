import mongoose from "mongoose";

export const DBCONNECT = () => {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        .then(() => {
            console.log("mongoDB Connected..");
        }).catch(error => {
            console.log("Error in database connection "+error);
        })
}