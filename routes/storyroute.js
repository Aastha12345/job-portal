const express=require('express');
const router = express.Router({
    mergeParams: true
});

const multer=require('multer')
const path=require('path')
const { body, validationResult } = require('express-validator');

const Story=require('../models/story')

const middleware=require("../middleware/middleware");
const { response } = require('../app');

router.get('/',middleware.isLoggedIn,(req,res)=>{
    res.render('story');
})  



//Storing Image on diskStorage
const storage=multer.diskStorage({
    destination: './public/uploads/story',
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
        cb('Error:Images only')
    }
  }
  
//image saving on disk
router.post('/',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err)
        {
            console.log({err:'Some error occured'})
            res.render('story',{msg:err})
        }
        else{
            next();
        }
    })
})


router.post('/',[
    body('description').isLength({min:50})
],(req,res,next)=>{
// Finds the validation errors in this request and wraps them in an object with handy functions
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.render('story',{ msg: 'Enter minimum 50 characters in description' });
}
else{
    next();
}
})



//saving story to database
router.post('/',middleware.isLoggedIn,function(req, res) {
        var title = req.body.title;
        var photo = `${req.file.filename}`
        var description = req.body.description;
        var company = req.body.company;
        var category = req.body.category;
        var location = req.body.location;
        var payscale = req.body.payscale;
        var contact = req.body.contact;
        var apply = req.body.apply;
        var author={
            username:req.user.username,
            _id:req.user._id
        }
        var newStory = { title:title, description: description,author:author,photo:photo, company:company, category:category, location:location, contact:contact, payscale:payscale, apply:apply};
        Story.create(newStory, function(err, newlyCreated) {
            if (err) {
                console.log(err);
                res.send({success:false,method:'Something went wrong in storyroute'})
            } else {
                console.log("hello world" + newStory);
                res.redirect('/index')
            }
        });

});


router.get('/show/:_id',middleware.isLoggedIn,function(req,res){
    Story.findOne({_id:req.params._id},(err,story)=>{
        if(err)
        {
            console.log({success:false,message:'Something went wrong in storyroute'})
            res.send({success:false,message:'Something went wrong in storyroute'})
        }
        else
        {
            res.render('storyshow',{story:story})
        }
    })
})


router.get('/edit/:_id',middleware.isLoggedIn,function(req,res){
    Story.findOne({_id:req.params._id},(err,story)=>{
        if(err)
        {
            res.send({success:false,message:'something went wrong in storyroute'})
        }
        else{
            res.render('storyedit',{
                story:story
            })
        }
    })
})


router.post('/edit/:_id',function(req,res){
    data1={
        title:req.body.title,
        description:req.body.description
    }
    Story.findOneAndUpdate({_id:req.params._id},{$set: data1},
        (err,story)=>{
        if(err)
        {
            res.send('Something went wrong in storyroute')
        }
        else{
            res.redirect('/story/show/'+story._id)
        }
    })
})


router.get('/find',function(req,res){
    console.log(req.query.searchstory)
    Story.find({title: { "$regex": req.query.searchstory, "$options": "i" }},(err,storys)=>{
        if(err)
        {
            console.log('Something went wrong in storyroute')
        }
        else{
            res.render('findstory',{storys:storys})
        }
    })
})


router.post('/comment/:storyid/:username',function(req,res){
    data1={
        text:req.body.comment,
        username:req.params.username,
        commenttime: new Date()
    }

    Story.findOneAndUpdate({_id:req.params.storyid},{$push:{comments:data1}},{$upsert:true},(err,story)=>{
        if(err)
        {
            console.log(err)
            res.send({success:false,message:'Something went wrong in storyroute'})
        }
        else{
            res.redirect('/story/show/'+req.params.storyid)
        }
    })
})


router.get('/myblogs/:username',function(req,res){
    Story.find({"author.username":req.params.username},(err,storys)=>{
        if(err)
        {
            console.log(err)
            res.send({success:false,message:'Something went wrong in storyroute'})
        }
        else{
            res.render('findstory',{storys:storys,heading:'Your Blogs'})
        }
    })
})

module.exports=router;