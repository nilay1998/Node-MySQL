const mysqlConnection=require("./connection");
const url=require('url');

function socketConnection(io)
{
    let socketIdsMap = new Map();

    let count=1;
    io.engine.generateId = function (req) {
        const queryData = url.parse(req.url, true).query;
        // console.log('REQUEST ',req.url+" : "+queryData.custom_id);
        return queryData.custom_id;
        //return count++;
    };


    io.on('connection',socket=>{

        // console.log('socket: '+socket.id);
        // console.log('Made Socket Connection: '+socket.handshake.query.custom_id);

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

            const array=JSON.parse(socketID);
            console.log(roomName+' is Online');

            const len=array.length;
            var i=0;
            for(;i<len;i++){
                console.log(array[i]);
                if(Object.keys(io.sockets.sockets).includes(array[i])){
                    io.sockets.connected[array[i]].join(roomName);
                }
            }

            socket.to(roomName).emit('activeStatus', {status:'Online'});


            const email=roomName;
            const sql="UPDATE UserInfo SET lastSeen=? WHERE email=?";
            mysqlConnection.query(sql,['Online',email],(err,rows,fields)=>{
                if(err) throw err;
                console.log("LastSeen Updated");
            });
        });

        socket.on('offline',(roomName)=>{

            console.log(roomName+' is Offline');

            const currTime=Date.now();
            
            socket.to(roomName).emit('activeStatus', {status:currTime});

            const email=roomName;
            const sql="UPDATE UserInfo SET lastSeen=? WHERE email=?";
            mysqlConnection.query(sql,[currTime,email],(err,rows,fields)=>{
                if(err) throw err;
                console.log("LastSeen Updated");
            });
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

        socket.on('messageRead',(sender,receiver)=>{

            socket.to(receiver).emit('readMessageBy'+sender,{msg:"read"});

            console.log("Padh liya message tumhara");
            const sql="UPDATE msg SET isRead=? WHERE sender=? AND receiver=?";
            mysqlConnection.query(sql,[1,receiver,sender],(err,rows,fields)=>{
                if(err) throw err;
                console.log("Message Updated");
                console.log(rows);
            });
        });

        socket.on('disconnect', () => {

            const roomName=socket.id;

            console.log(roomName+' is Offline');

            const currTime=Date.now();
            
            socket.to(roomName).emit('activeStatus', {status:currTime});

            const email=roomName;
            const sql="UPDATE UserInfo SET lastSeen=? WHERE email=?";
            mysqlConnection.query(sql,[currTime,email],(err,rows,fields)=>{
                if(err) throw err;
                console.log("LastSeen Updated");
            });
            

            console.log('disconnect event '+socket.id); // false
            socket.disconnect();
        });
    });
}

module.exports=socketConnection;