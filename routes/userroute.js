const express=require('express');
const router = express.Router({
    mergeParams: true
});

const User=require('../models/user');

//LOGOUT THE USER USING PASSPORT
router.get('/logout', function(req, res){
    req.logout();
    res.render('login',{msg:'You have been successfully logged out'})
});

router.get('/profiles',function(req,res){
    User.find({category:"looking for job"},(err,users)=>{
        if(err)
        {
            res.send({success:false,message:'Something went wrong in userroute.js'})
        }
        else{
            res.render('profiles_show',{
                users:users
            })
        }
    })
})

router.get('/profile/:_id',function(req,res){
    User.findOne({_id:req.params._id},(err,user)=>{
        if(err)
        {
            res.send({success:false,message:'Something went wrong in userroute.js'})
        }
        else{
            res.render('profileshow',{
                user:user
            })
        }
    })
})

router.get('/profile/edit/:_id',function(req,res){
    User.findOne({_id:req.params._id},(err,user)=>{
        if(err)
        {
            res.send({success:false,message:'Something went wrong in userroute.js'})
        }
        else{
            res.render('profileedit',{
                user:user
            })
        }
    })
})

router.post('/profile/edit/:_id',function(req,res){
    data1={
        name:req.body.name,
        email:req.body.email,
        phonenumber:req.body.phonenumber,
    }
    User.findOneAndUpdate({_id:req.params._id},{$set: data1},(err,user)=>{
        if(err)
        {
            console.log(err)
            res.send({success:false,message:'Something went wrong in userroute.js'})
        }
        else{
            res.redirect('/user/profile/'+req.params._id)
        }
    })
})

module.exports=router;