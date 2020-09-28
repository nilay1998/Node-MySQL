const mysqlConnection=require("./connection");
const bodyParser=require("body-parser");
const express = require("express");
const app = express();
const socket=require('socket.io');
const userRouter=require("./routes/user");

app.use(bodyParser.json());
app.use('/user',userRouter);

app.get('/get',async(req,res)=>{
    res.json({message:'RUNNING'});
});

const tables=require("./tables")();

const port = process.env.PORT || 3000;
const server=app.listen(port, () => console.log(`Listening on port ${port}...`));

const io=socket(server);

io.on('connection',socket=>{
    console.log('Made Socket Connection\nSocketID:'+socket.id);

    socket.on('join', email => {
        const sql="UPDATE UserInfo SET socketID=? WHERE email=?";
        mysqlConnection.query(sql,[socket.id,email],(err,rows,fields)=>{
            if(err) throw err;
            console.log("Database Updated");
        });
    });
    
});