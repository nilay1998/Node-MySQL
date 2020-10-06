const mysql=require("mysql");
const mysqlConnection=mysql.createConnection({
    host:"sql12.freemysqlhosting.net",
    user:"sql12368766",
    password:"VptMxJbyvh",
    database:"sql12368766",
});

mysqlConnection.connect(err=>{
    if(err) throw err;
    console.log("Connected to the Server!");
});

module.exports=mysqlConnection;