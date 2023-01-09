var express=require('express')
var checkRouter=require('./router/CheckoutApi')
var cors=require('cors')

var app=express();

app.use(cors())
app.use(express.json())

const port=8080;

app.use('/payment',checkRouter);

app.listen(port,()=>{
    console.log(`server running on ${port}`)
})



