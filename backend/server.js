import express from 'express';
import  mongoose from 'mongoose';
import productRouter from './routers/productRouter.js';
import userRouter  from './routers/userRouter.js';
import dotenv from 'dotenv';
import path from 'path';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1/shopin',{useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true});

app.use('/api/uploads',uploadRouter);
app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter);
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

const __dirname=path.resolve();
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));
app.get("/",(req,res)=>{
    res.send("Server is ready");
});

const port=process.env.PORT || 5000;

app.use((err,req,res,next)=>{
    console.log('ERRORRR');
    res.status(500).send({message:err.message});
});


app.listen(port,()=>
{
    console.log(`Server at http://localhost:${port}`);
});