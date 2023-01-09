const { application } = require('express');
var express=require('express')
var checkoutRouter=express.Router();
var Razorpay=require('razorpay')
var bodyparser=require('body-parser')
const crypto= require('crypto');
const config = require('../config')

checkoutRouter.use(bodyparser.json())

var instance = new Razorpay({
     key_id: 'YOUR KEY',
     key_secret: 'YOUR SECRET'
})



checkoutRouter.post('/orderId',(req,res)=>{
    var options = {
        amount: req.body.amount * 100,
        currency: "INR",
      }
      instance.orders.create(options)
      .then((order) => {
        res.status=200
        res.send({status:'success',orderId:order.id}); 
      }).catch((err) => {
        res.send({err:err});
    });
   });
  

checkoutRouter.post('/verify', (req,res)=>{

  // console.log(req.body);

   let string=req.body.razorOrderId +"|"+ req.body.razorPaymentId;
   let decryptedSignature =  crypto.createHmac('sha256',config.secret)
                           .update(string)
                           .digest('hex')
    // console.log(decryptedSignature);
    if(decryptedSignature === req.body.razorSignature){
      res.send({status:'success',message:'signature is valid'})
      res.status=200;
    }else{
      res.send({status:'failure',message:'signature is not valid'})
      res.status=200;
    }
})

module.exports=checkoutRouter;