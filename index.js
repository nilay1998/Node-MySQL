const mysqlConnection=require("./connection");
const bodyParser=require("body-parser");
const express = require("express");
const app = express();
const userRouter=require("./routes/user");

app.use(bodyParser.json());
app.use('/user',userRouter);

app.get('/get',async(req,res)=>{
    res.json({message:'RUNNING'});
});

const sql="create table if not exists UserInfo ("+
    "name varchar(256) NOT NULL,"+
    "email varchar(256) NOT NULL,"+
    "password varchar(256) NOT NULL,"+
    "phone varchar(256) NOT NULL,"+
    "PRIMARY KEY (email))";
    
mysqlConnection.query(sql, (err) => { if(err) throw err; });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));