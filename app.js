const express =require('express');
const mongoose=require('mongoose');
const cors=require("cors");
const bp=require('body-parser');
const app=express();
app.use(express.json());
app.use(cors());
app.use(bp.urlencoded({extended:false}));

mongoose.connect('/api',{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false},function(err){
  if(!err){
    console.log("Mongodb Connected Succesfully");
  }
});
const memesschema=mongoose.Schema({
  name:String,
  url:{
    type:String,
    required:true,
    umique:[true,"Url is already present"]
  },
  caption:String
});
const xmemetmodel=mongoose.model('memes',memesschema);




app.get('/',async function(req,res){
  await xmemetmodel.find(function(err,result)
  {
    if(result){
      res.send(result);
    }
    else {
      res.status(404).send("Please upload meme first");
    }

  })
});


app.post('/',async function(req,res)
{
  var a=req.body.name;
  var b=req.body.url;
  var c=req.body.caption;
  console.log(req.body);
  const newmeme=new xmemetmodel(
    {
    name:a,
    url:b,
    caption:c
  })
await newmeme.save(function(err){
  if(err){
    res.send("ohhooo! something error gona happend");
  }
  else {
    res.send("Yuppp! your data will save Succesfully")
  }
});
});

/
app.route('/memes/:memesId').get(function(req,res){
let a=req.params.memesId;
console.log(a);
xmemetmodel.findOne({_id:a},function(err,result){
if(result){
  res.send(result);
}
else{
  res.status(404).send("Enter wrong I'd");
}
})
}).patch(async function(req,res)
{
  try{
    let updateid=req.params.memesId;
    const updatememe=await xmemetmodel.findByIdAndUpdate(updateid,req.body,{
      new:true
    });
    res.send(updatememe);
  }catch(e)
  {
    res.status(e).send(e);
  }


})



app.listen(process.env.PORT || '8000',function(){
  console.log("Server Started");
})
