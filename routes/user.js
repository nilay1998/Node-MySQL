const express=require("express");
const router=express.Router();
const mysqlConnection=require("../connection");
const bcrypt=require('bcrypt');
const publickeyDH=require('../diffie-hellman');

router.get('/getAll', (req,res) =>{
    const sql="select * from UserInfo";
    mysqlConnection.query(sql, (err,rows,fields) =>{
        if(err) throw err;
        console.log(rows);
        res.send(rows);
    });
});

router.get('/getDH_PublicKey', (req,res) => {
    res.send({prime:publickeyDH.getPrime().toString('base64'),generator:publickeyDH.getGenerator().toString('base64')});
});

router.put('/setPublicKey',(req,res)=>{
    const publickey=req.body.publickey;
    const email=req.body.email;
    const sql="UPDATE UserInfo SET publickey=? WHERE email=?";
    mysqlConnection.query(sql,[publickey,email],(err,rows,fields)=>{
        if(err) throw err;
        res.json({status:'1',message:'Public Key Updated'});
    });
});

router.get('/getPublicKey',(req,res)=>{
    const email=req.query.email;
    const sql="Select publickey from UserInfo where email=?";
    console.log(sql);
    mysqlConnection.query(sql,email,(err,rows,fields)=>{
        if(err) throw err;
        res.send({publickey:rows[0].publickey});
    });
});
router.get('/getSocketID',(req,res)=>{
    const email=req.query.email;
    const sql="Select socketID from UserInfo where email=?";
    console.log(sql);
    mysqlConnection.query(sql,email,(err,rows,fields)=>{
        if(err) throw err;
        res.send({socketID:rows[0].socketID});
    });
});

router.post('/getContacts', (req,res) =>{
    const phoneNumbers=req.body.phone;
    var sql = "SELECT email,phone FROM UserInfo where phone IN ('" + phoneNumbers.join("','") + "')";
    console.log(sql);
    mysqlConnection.query(sql, (err,rows,fields)=>{
        if(err) throw err;
        console.log(rows);
        res.json(rows);
    });
});

router.get('/getMessages',(req,res)=>{
    const sender=req.query.sender;
    const receiver=req.query.receiver;
    const users=[sender,receiver];
    const sql="select * from msg where sender IN ('" + users.join("','") + "') and receiver IN ('" + users.join("','") + "') ORDER BY created_at";
    console.log(sql);
    mysqlConnection.query(sql, (err,rows,fields)=>{
        if(err) throw err;
        console.log(rows);
        res.json(rows);
    });
});

router.post('/login',(req,res)=>{
    const userData={
        email:req.body.email,
        password:req.body.password
    };

    const sql='select * from UserInfo where email=?';
    console.log(sql);
    mysqlConnection.query(sql,req.body.email,async (err,rows,fields)=>{
        if(err) throw err;
        console.log(rows);
        if(rows.length == 0) return res.json({status:'0',message:'Invalid Email or Password'});
        const validPassword = await bcrypt.compare(req.body.password,rows[0].password);
        if (!validPassword) return res.json({status:0,message:'Invalid email or password.'})
        return res.json({status:'1', message:'Login Success', name:rows[0].name, email:rows[0].email });
    });
});

router.post('/register', (req,res) =>{

    var sql='select email from UserInfo where email=?';
    console.log(sql);
    mysqlConnection.query(sql,req.body.email, async (err,rows,fields)=>{
        if(err) throw err;
        if(rows.length > 0) return res.json({status:'0',message:'Email already registered.'});

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const userData={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phone
        };
        sql="INSERT INTO UserInfo set ?";
        console.log(sql);
        mysqlConnection.query(sql,userData, (err,rows,fields)=>{
            if(err) throw err;
            res.send({status:'1',message:'Success.'});
        });
    });
});
module.exports=router;