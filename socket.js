const mysqlConnection=require("./connection");

function socketConnection(io)
{
    io.on('connection',socket=>{

        console.log('Made Socket Connection: '+socket.id);
    
        socket.on('join', email => {
            const sql="UPDATE UserInfo SET socketID=? WHERE email=?";
            mysqlConnection.query(sql,[socket.id,email],(err,rows,fields)=>{
                if(err) throw err;
                console.log("SocketID Updated");
            });
        });
        
        socket.on('messagedetection',(sender,receiver,message)=>{
            var sql="Select socketID from UserInfo where email=?";
            mysqlConnection.query(sql,receiver,(err,rows,fields)=>{
                if(err) throw err;

                //console.log("Receiver SocketID: "+rows[0].socketID+" : "+socket.id);
                console.log("Sender: "+sender+" Receiver: "+receiver+" Message:"+message);
                //const msg = {'sender':sender,'message':message};
                const id=rows[0].socketID;
                console.log("Sending to SocketID: "+id);

                const MsgData={
                    sender: sender,
                    receiver: receiver,
                    message: message
                };
                
                socket.to(id).emit('messageToUser', MsgData);
                //socket.broadcast.emit('messageToUser', MsgData);
                    

                sql="INSERT INTO msg set ?";
                mysqlConnection.query(sql,MsgData, (err,rows,fields)=>{
                    if(err) throw err;
                    console.log("Message added to databse");
                });
            });
        });
    });
}

module.exports=socketConnection;