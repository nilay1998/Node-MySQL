const express=require("express");
const router=express.Router();
const mysqlConnection=require("../connection");

router.get('/getAll', (req,res) =>{
    const sql="select * from UserInfo";
    mysqlConnection.query(sql, (err,rows,fields) =>{
        if(err) throw err;
        res.send(rows);
    });
});

router.post('/register', (req,res) =>{
    const userData={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone
    };
    mysqlConnection.query('select email from UserInfo where email=?',req.body.email,(err,rows,fields)=>{
        if(err) throw err;
        if(rows.length > 0) return res.json({status:'0',message:'Student already registered.'});

        const sql="INSERT INTO UserInfo set ?";
        mysqlConnection.query(sql,userData, (err,rows,fields)=>{
            if(err) throw err;
            res.send({status:'1',message:'Success.'});
        });
    });
});
module.exports=router;