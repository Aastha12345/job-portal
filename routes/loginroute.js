const express = require('express');
const router = express.Router({
    mergeParams: true
});

const passport=require('passport')

var user=require('../models/user');
var mongoose=require('mongoose');

router.get('/',(req,res)=>{
    res.render('login')
})

router.post('/',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/index')
});



module.exports=router;