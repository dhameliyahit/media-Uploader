const express = require("express")
const express_fileUpload = require("express-fileupload")
const app = express();
const fs = require("fs")
const path = require("path")

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express_fileUpload({
    limits:{
        fileSize: 50000000,
    },
    abortOnLimit:true
}))


app.get("/",(req,res)=>{
    try {
        res.sendFile(__dirname+"/index.html")
    } catch (error) {
        res.send("Server Error",error)
    }
})


app.post("/data",(req,res)=>{
    const {file} = req.files
    if(!file) return res.send("File Not Selected")
    file.mv(__dirname+"/upload/" + file.name)
    res.sendFile(__dirname+"/uploaded.html")
})

app.get("/all",(req,res)=>{
    fs.readdir("./upload",(err,files)=>{
        if(err) return res.status(200).send("error")
        res.json(files)
    })
})

app.get("/file/:fileName",(req,res)=>{
    const filePath = path.join(__dirname, 'upload', req.params.fileName);
    fs.access(filePath,fs.constants.F_OK,(err)=>{
        if(err) return res.send("Error open file")
        res.sendFile(filePath)
    })
})

app.delete("/Delete/:fileName",(req,res)=>{
    const filePath = path.join(__dirname, 'upload', req.params.fileName);
    fs.unlink(filePath,(err)=>{
        if(err) return res.send("Error While Deleting").json({ "FilDelete":false })
        
            res.json({
            "FilDelete":true
        })
    })
})

app.listen(3000,()=>{
    console.log('on 3000');
})