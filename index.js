const bodyParser=require("body-parser");
const express = require("express");
const app = express();
const socket=require('socket.io');
const userRouter=require("./routes/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/user',userRouter);

app.get('/get',async(req,res)=>{
    res.json({message:'RUNNING'});
});

require("./tables")();

const port = process.env.PORT || 3000;
const server=app.listen(port, () => console.log(`Listening on port ${port}...`));

const io=socket(server);

require('./socket')(io);