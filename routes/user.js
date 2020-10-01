const express=require("express");
const router=express.Router();
const mysqlConnection=require("../connection");
const bcrypt=require('bcrypt');

router.get('/getAll', (req,res) =>{
    const sql="select * from UserInfo";
    mysqlConnection.query(sql, (err,rows,fields) =>{
        if(err) throw err;
        res.send(rows);
    });
});

router.get('/getContacts', (req,res) =>{
    const phoneNumbers=req.query.phone;
    var sql = "SELECT * FROM UserInfo where phone IN ('" + phoneNumbers.join("','") + "')";
    //console.log(sql);
    mysqlConnection.query(sql, (err,rows,fields)=>{
        if(err) throw err;
        console.log(rows);
    });
});

router.post('/login',(req,res)=>{
    const userData={
        email:req.body.email,
        password:req.body.password
    };
    mysqlConnection.query('select * from UserInfo where email=?',req.body.email,async (err,rows,fields)=>{
        if(err) throw err;
        if(rows.length == 0) return res.json({status:'0',message:'Invalid Email or Password'});
        const validPassword = await bcrypt.compare(req.body.password,rows[0].password);
        if (!validPassword) return res.json({status:0,message:'Invalid email or password.'})
        return res.json({status:'1', message:'Login Success', name:rows[0].name, email:rows[0].email });
    });
});

router.post('/register', (req,res) =>{
    mysqlConnection.query('select email from UserInfo where email=?',req.body.email, async (err,rows,fields)=>{
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
        const sql="INSERT INTO UserInfo set ?";
        mysqlConnection.query(sql,userData, (err,rows,fields)=>{
            if(err) throw err;
            res.send({status:'1',message:'Success.'});
        });
    });
});
module.exports=router;