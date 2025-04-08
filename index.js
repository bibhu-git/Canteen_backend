import express from 'express'
import { DBCONNECT } from './config/db.js';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
DBCONNECT();

app.use(bodyParser.json());
app.use(cors({ origin: "canteen-management-delta.vercel.app", credentials: true }));
app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use('/images',express.static("uploads"));

app.get('/',(req,res) => {
    res.send("Hello world");
});

app.listen(port,() => {
    console.log("Server listen on port : "+port);
})