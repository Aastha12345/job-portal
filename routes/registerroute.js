const express = require('express');
const router = express.Router({
    mergeParams: true
});
const multer=require('multer')
const path=require('path')
const { body, validationResult } = require('express-validator');

var User=require('../models/user');
var mongoose=require('mongoose');


router.get('/',(req,res)=>{
    res.render('register');   
})

router.get('/findUserName/:userName',function(req,res){
 
    User.findOne({username:req.params.userName},(err,user)=>{
        if(err)
        {
            res.send({
                success:false,message:'Something went wrong in findUserName/:username'
            })
        }
        else{
            res.send(user)
        }
    })
})

const storage=multer.diskStorage({
    destination: './public/uploads/profile',
    filename:function(req,file,cb){
        cb(null,file.fieldname+ '-' +Date.now()+
        path.extname(file.originalname));
    }
})

const upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        checkfiletype(file,cb);
    }
  }).single('myImage');
  
  function checkfiletype(file,cb)
  {
    //Allowed ext
    const filetypes=/jpeg|jpg|png|gif/
    //Check ext
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype=filetypes.test(file.mimetype);
  
    if(mimetype && extname)
    {
        return cb(null,true)
    }
    else
    {
        cb('Error:Only images should be uploaded')
    }
  }

//image saving on disk
router.post('/',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err)
        {
            console.log({err:'Some error occured'})
            res.render('register',{msg:err})
        }
        else{
            next();
        }
    })
})


//validate fields
router.post('/',[
        body('name').isAlpha(),
        body('username').isLength({min:1}),
        body('password').isLength({ min:1 }),
        body('email').isEmail(),
        body('phonenumber').isLength({min:1}),
    ],(req,res,next)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register',{ msg: 'Check '+errors.errors[0].param+' '+errors.errors[0].msg });
    }
    else{
        next();
    }
})

//validate username
router.post('/',function(req,res){
    User.findOne({username:req.body.username},(err,user)=>{
        if(err){
            res.send({success:false,message:'Something went wrong in registerroute'})
        }else if(user)
        {
            res.render('register',{msg:'User with this username already exists'})
        }
        else{
            var newuser=new User({
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                email:req.body.email,
                phonenumber:req.body.phonenumber,
                category:req.body.category,
                photo:`${req.file.filename}`
            })
            
            newuser.save(function(err){
                if (err){
                    res.json({success:false,message:'something went wrong'})
                };
                console.log('User created');
                
                res.render('login',{msg:'Your profile has been created.Login to proceed further.'})
            })
        }
    })
})
module.exports=router;