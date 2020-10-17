const mysqlConnection=require("./connection");
function createTable()
{
    var sql="create table if not exists UserInfo ("+
        "name varchar(256) NOT NULL,"+
        "email varchar(256) NOT NULL,"+
        "password varchar(256) NOT NULL,"+
        "phone varchar(256) NOT NULL,"+
        "socketID varchar(256),"+
        "publickey TEXT,"+
        "PRIMARY KEY (email))";    
    mysqlConnection.query(sql, (err) => { if(err) throw err; });

    sql="create table if not exists msg ("+
        "id int NOT NULL AUTO_INCREMENT,"+
        "sender varchar(256) NOT NULL,"+
        "receiver varchar(256) NOT NULL,"+
        "message TEXT NOT NULL,"+
        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"+
        "FOREIGN KEY (sender) REFERENCES UserInfo(email),"+
        "FOREIGN KEY (receiver) REFERENCES UserInfo(email),"+
        "PRIMARY KEY (id))";
    mysqlConnection.query(sql, (err) => { if(err) throw err; });
}

module.exports=createTable;