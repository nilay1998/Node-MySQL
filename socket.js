const mysqlConnection=require("./connection");
const url=require('url');

function socketConnection(io)
{
    let socketIdsMap = new Map();

    let count=1;
    io.engine.generateId = function (req) {
        const queryData = url.parse(req.url, true).query;
        console.log('REQUEST ',req.url+" : "+queryData.custom_id);
        return queryData.custom_id;
        //return count++;
    };


    io.on('connection',socket=>{

        console.log('socket: '+socket.id);
        console.log('Made Socket Connection: '+socket.handshake.query.custom_id);
        
        socket.on('join', email => {
            socketIdsMap.set(email,socket.id);
            const sql="UPDATE UserInfo SET socketID=? WHERE email=?";
            mysqlConnection.query(sql,[socket.id,email],(err,rows,fields)=>{
                if(err) throw err;
                console.log("SocketID Updated");
            });

            //io.emit(email+'socketUpdate',  {id:socket.id});
        });

        socket.on('joinRoom',(roomName,socketID)=>{
            const len=socketID.length;
            var i=0;
            // for(;i<len;i++){
            //     io.sockets.connected[socketID[i]].join(roomName);
            // }
        });
        
        socket.on('messagedetection',(sender,receiver,message,receiverSocketID)=>{

            console.log("Sender: "+sender+" Receiver: "+receiver+" Message:"+message+" Receiver SocketID:"+receiverSocketID);

            const MsgData={
                sender: sender,
                receiver: receiver,
                message: message
            };
            
            //socket.to(receiverSocketID).emit('messageToUser', MsgData);

            socket.to(socketIdsMap.get(receiver)).emit('messageToUser', MsgData);

            const sql="INSERT INTO msg set ?";
            mysqlConnection.query(sql,MsgData, (err,rows,fields)=>{
                if(err) throw err;
                console.log("Message added to databse");
            });
        });

        socket.on('disconnect', () => {
            console.log('disconnect event '+socket.id); // false
            socket.disconnect();
        });
    });
}

module.exports=socketConnection;