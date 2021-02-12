const express=require('express')
const router=express.Router({
    mergeParams: true
});
const Story=require('../models/story')

router.get('/',function(req,res){
    Story.find({},[],{sort:{_id: -1 }
    }
    ,(err,storys)=>{
        if(err)
        {
            res.send({success:true,message:'Some error occured in indexroute.js',error:err})
        }
        else{
            res.render('index',{storys:storys})
        }
    })
})

router.get('/error',function(err,res){
    res.render('error');
})


module.exports=router;