var express=require('express');
var multer=require('multer');
const bodyParser = require("body-parser");
const fs = require("fs");
const pdfMerge = require('easy-pdf-merge');
const path=require('path');
var cors=require('cors');

const PDFMerger = require('pdf-merger-js');
var merger = new PDFMerger();

var app=express();

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.listen(9000,()=>{console.log("Server Started")})

//Create static file
app.use('/public',express.static('public'));
app.use('/uploads',express.static('upload'))
var dir = "public";
var subDirectory = "public/uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);

  fs.mkdirSync(subDirectory);
}



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
});


var mergepdffilesupload = multer({storage:storage})

app.post('/pdf',mergepdffilesupload.array('files',100),(req,res,err)=>{
    console.log("Inside pdf")
    const files = []
    var curr=Date.now()+'.pdf'
    var outputFilePath =`${__dirname}\\public\\${curr}`
    console.log(outputFilePath)
    if(req.files){
      req.files.forEach(file => {
        console.log(file.path)
        files.push(file.path)
      });
      for(let i=0;i<files.length;i++)
      {
          merger.add(files[i])
      }
      merger.save(outputFilePath)
      res.send(curr)
    }
    else{
        console.log("Else blockk")
    }
});

app.get('/aman',(req,res,err)=>
{
    res.send("Hello world");
})
