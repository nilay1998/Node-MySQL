const bodyParser=require("body-parser");
const express = require("express");
const app = express();
const socket=require('socket.io');
const userRouter=require("./routes/user");
require('./prod')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/user',userRouter);

app.get('/get',(req,res)=>{
    res.json({message:'RUNNING'});
});

require("./tables")();

const port = process.env.PORT || 3000;
const server=app.listen(port, () => console.log(`Listening on port ${port}...`));

const io=socket(server);

require('./socket')(io);

app.get('/sockets',(req,res)=>{
    res.json(Object.keys(io.sockets.sockets));
});

app.get('/dis_sockets',(req,res)=>{
    Object.keys(io.sockets.sockets).forEach(function(s) {
        io.sockets.sockets[s].disconnect(true);
      });
    res.json({message:'Done'});
});
