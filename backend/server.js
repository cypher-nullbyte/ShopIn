import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
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

app.use((err,req,res,next)=>{
    console.log('ERROR GLOBAL!');
    res.status(500).send({message:err.message});
});

const port=process.env.PORT || 5000;

const httpServer=http.Server(app);
const io = new Server(httpServer,{cors:{origin:'*'}});


const users=[];

io.on('connection', (socket) => {
    console.log('connection', socket.id);
    socket.on('disconnect', () => {
      const user = users.find((x) => x.socketId === socket.id);
      if (user) {
        user.online = false;
        console.log('Offline', user.name);
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
          io.to(admin.socketId).emit('updateUser', user);
        }
      }
    });
    socket.on('onLogin', (user) => {
      const updatedUser = {
        ...user,
        online: true,
        socketId: socket.id,
        messages: [],
      };
      const existUser = users.find((x) => x._id === updatedUser._id);
      if (existUser) {
        existUser.socketId = socket.id;
        existUser.online = true;
      } else {
        users.push(updatedUser);
      }
      console.log('Online', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', updatedUser);
      }
      if (updatedUser.isAdmin) {
        io.to(updatedUser.socketId).emit('listUsers', users);
      }
    });
  
    socket.on('onUserSelected', (user) => {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        const existUser = users.find((x) => x._id === user._id);
        io.to(admin.socketId).emit('selectUser', existUser);
      }
    });
  
    socket.on('onMessage', (message) => {
      if (message.isAdmin) {
        const user = users.find((x) => x._id === message._id && x.online);
        if (user) {
          io.to(user.socketId).emit('message', message);
          user.messages.push(message);
        }
      } else {
        const admin = users.find((x) => x.isAdmin && x.online);
        if (admin) {
          io.to(admin.socketId).emit('message', message);
          const user = users.find((x) => x._id === message._id && x.online);
          user.messages.push(message);
        } else {
          io.to(socket.id).emit('message', {
            name: 'Admin',
            body: 'Apologies. We ain\'t online now. Send us mail support@email.com',
          });
        }
      }
    });
  });


httpServer.listen(port,()=>{
    console.log(`Server at http://localhost:${port}`);
});

// app.listen(port,()=>
// {
//     console.log(`Server at http://localhost:${port}`);
// });