var express= require('express');
var app=express();

let server=require('./server.js');
let middleware=require('./middleware.js');

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbName='HospitalManagement';
let db;
MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
    if (err) {
        return console.log(err);
    }
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database: ${dbName}`);
});

//Reading Hospital Details
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Reading data from Hospital Collection");
    var data=db.collection('Hospital').find().toArray().then(result=> res.json(result));
});

//Reading Ventilators Details
app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Reading data from Ventilator Collection");
    var data=db.collection('Ventilators').find().toArray().then(result=> res.json(result));
});

//Searching Ventilators By Status
app.post('/searchbystatus',middleware.checkToken,function(req,res){
    var Status=req.body.Status;
    console.log(Status);
    console.log("Searching Ventilators By Status");
    var data=db.collection('Ventilators').find({"Status": Status}).toArray().then(result=> res.json(result));

});

//Searching Ventilators By HospitalName
app.post('/searchventilatorbyhospital',middleware.checkToken,function(req,res){
    var name=req.body.name;
    console.log("Searching Ventilators By HospName");
    var data=db.collection('Ventilators').find({"name":new RegExp(name,'i')}).toArray().then(result=> res.json(result));
});

//Searching Hospital By Name
app.post('/searchbyhospital',middleware.checkToken,function(req,res){
    var name=req.body.name;
    console.log("Searching Hospital By Name");
    var data=db.collection('Hospital').find({"name":new RegExp(name,'i')}).toArray().then(result=> res.json(result));
});

//Updating Ventilator Details
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid=req.body.VentilatorId;
    console.log(ventid);
    var newvalue=req.body.Status;
    console.log(newvalue);
    var data = db.collection('Ventilators').updateOne({"VentilatorId":ventid},{$set:{"Status":newvalue}},function(err,result) {
        if(err) {
            throw err;
        }
        res.json("Ventilator Status Updated")
        console.log("Ventilator Status Updated");
    });
});

//Adding a Ventilator
app.post('/addventilator',middleware.checkToken,function(req,res){
    var HId=req.body.hId;
    var VId=req.body.VentilatorId;
    var Status=req.body.Status;
    var Name=req.body.name;
    var item={hId:HId,VentilatorId:VId,Status:Status,name:Name};
    db.collection('Ventilators').insertOne(item,function(err,result){
        res.json('Item Inserted');
    });
});

//Deleting Ventilator By Id
app.post('/deleteventilatorbyid',middleware.checkToken,function(req,res){
    var Ventid=req.body.VentilatorId;
    console.log(Ventid);
    var VId={VentilatorId:Ventid}
    db.collection('Ventilators').deleteOne(VId,function(err,result){
        if(err) {
            throw err;
        }
        res.json("Ventilator Deleted");
     });
});
app.listen(900);