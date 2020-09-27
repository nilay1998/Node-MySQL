const mysql=require("mysql");
const mysqlConnection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"sampleDB",
});

mysqlConnection.connect(err=>{
    if(err) throw err;
    console.log("Connected to the Server!");
});

module.exports=mysqlConnection;