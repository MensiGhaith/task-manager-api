const express = require('express')
const app = express()
const User = require('./models/User')
const Task=require('./models/Task')
const multer=require('multer')
const upload=multer({
    dest:'images',
    limits:{
        //1Mo
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.pdf')){ // or we can do by regular expression example for word document (file.originalname.match(/\.(doc|docx)$/))
            return cb(new Error('the file should be a PDF'))
        }
        cb(undefined,true)

    }
})
app.post('/upload',upload.single('upload'), async (req,res)=>{
    res.send()

},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
require('./db/mongoose')
const UserRouter=require('./routers/user')
const TaskRouter=require('./routers/task')

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

const port = process.env.PORT || 5000



app.listen(port,()=>{
    console.log('server is up at '+ port)
})
