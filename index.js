const express = require('express');
const app = express();
const {connection} = require('./Configs/config');
require('dotenv').config();
const cors = require('cors');
const {userRouter} = require('./Routes/posts.route');
const {postRouter} = require('./Routes/posts.route');
const {auth} =  require('./middlewares/auth.middleware');

app.use(express.json());
app.use(cors());

app.use('/users', userRouter);

app.use(auth);
app.use('/posts', postRouter);


app.listen(process.env.port,  async() => {
    try{
        await connection
        console.log("connected to DB");
    }catch(err){
        console.log(err);
        console.log(`Trouble connecting to DB`);
    }
    console.log(`server running on port ${process.env.port}`);
});