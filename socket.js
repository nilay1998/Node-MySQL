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

            io.emit(email+'socketUpdate',  {id:socket.id});
        });

        socket.on('joinRoom',(roomName,socketID)=>{
            const len=socketID.length;
            var i=0;
            for(;i<len;i++){
                io.sockets.connected[socketID[i]].join(roomName);
            }
        });
        
        socket.on('messagedetection',(sender,receiver,message,receiverSocketID)=>{

            console.log("Sender: "+sender+" Receiver: "+receiver+" Message:"+message+" Receiver SocketID:"+receiverSocketID);

            const MsgData={
                sender: sender,
                receiver: receiver,
                message: message
            };
            
            socket.to(receiverSocketID).emit('messageToUser', MsgData);

            const sql="INSERT INTO msg set ?";
            mysqlConnection.query(sql,MsgData, (err,rows,fields)=>{
                if(err) throw err;
                console.log("Message added to databse");
            });
        });

        socket.on('disconnect', () => {
            console.log('disconnect event '); // false
        });
    });
}

module.exports=socketConnection;