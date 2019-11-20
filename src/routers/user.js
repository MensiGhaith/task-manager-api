const express=require('express')
const User=require('../models/User')
const router= new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendEmail,GoodbyeMAIL}=require('../emails/account')
const upload=multer({
   
    limits:{
        fileSize:1000000

    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('File Type Invalid'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
//req.user.avatar=req.file.buffer
const buffer =sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
req.user.avatar=buffer
await req.user.save()
res.send(req.user)
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    try
        {
            
        await user.save()
        // sendEmail(user.email,user.name)
        const token=await user.gettoken()

        res.status(201).send({user,token})
        }    catch(e) {
    
        res.status(400).send(e)
                    }
    })
    router.get('/users/me',auth,async(req,res)=>{
       res.send(req.user)
    })
    
    router.patch('/users/me',auth, async(req,res)=>{
        const Keys=Object.keys(req.body)
        const OurValues=['name','email','password','age']
        const IsVlidate=Keys.every((update)=>OurValues.includes(update))
        if(!IsVlidate){return res.status(404).send('Invalid Updates')}
        
        try{
        Keys.forEach((value)=>req.user[value]=req.body[value])
        await req.user.save()
           // const user= await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
            
            return res.send(req.user)
   
        }
        catch(e){
            res.status(400).send(e)
        }
    })
    router.delete('/users/me',auth,async(req,res)=>{
     
        try{
            await req.user.remove()
            GoodbyeMAIL(req.user.email,req.user.name)
            res.send(req.user)
        }catch(e){
            res.status(500).send()
        }
    })
    router.post('/users/login',async(req,res)=>{
        try {
            const user=await User.loginUser(req.body.email,req.body.password)
            const token= await user.gettoken()
        res.send({user,token})
    }catch(e){
            res.status(400).send(e)

        }
    })
    router.post('/users/logout',auth,async(req,res)=>{
       try{
           //.filter va s'éliminer la fausse condition
         req.user.tokens=req.user.tokens.filter((token)=>{
             return token.token !== req.token

         })
         await req.user.save()
         res.send()
       }catch(e){
           res.status(500).send(e)

       }
    })
    router.post('/users/logoutAll',auth,async(req,res)=>{
        try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
        } catch(e) {
            res.status(500).send(e)

        }
        
    })
    router.delete('/users/me/avatar',auth,upload.single('avatar',async(req,res)=>{
        req.user.avatar=undefined
        await req.user.save()
        res.status(200).send()
    }))
    router.get('/users/:id/avatar',async (req,res)=>{
        try{
            const user= await User.findById(req.params.id)
            if(!user || !user.avatar){
                throw new Error('Error')
            }
            res.set('Content-Type','image/jpg')
            res.send(user.avatar)
        }catch(e){
            res.send(e)

        }
    })
    module.exports=router