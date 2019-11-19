const express=require('express')
const Task=require('../models/Task')
const auth=require('../middleware/auth')
const router= new express.Router()




router.post('/tasks',auth,async (req,res)=>{
    const task=new Task({
        ...req.body,
        owner: req.user._id

    })
    try{
        await task.save()
        res.send(task)
    }
    catch(e){
        res.send(e)
    }
    })

   //url?sortby=createdAt:desc
    //url?completed=true
    //url?limit=2&skip=0
    router.get('/tasks',auth,async(req,res)=>{
        const match={}
        const sort={}
        if(req.query.sortby){
            //split permet de diviser created and desc en deux element d'un tableau
            const parts=req.query.sortby.split(':')
            sort[parts[0]]=parts[1] === 'desc' ? -1 : 1 
        }
        if(req.query.completed){
            match.completed=req.query.completed === 'true'
        }
        try{
            await req.user.populate({
                path:'tasks',
                match,
                options:{
                    limit: parseInt (req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }

        }).execPopulate()
           res.send(req.user.tasks)

        }
        catch(e){
            res.status(500).send(e)
        }
        

    })
    router.get('/tasks/:id',auth,async(req,res)=>{
        const _id=req.params.id
try{
    //const task=await Task.findById(_id)
    const task=await Task.findOne({_id,owner:req.user._id})
    if(!task){
      return  res.status(404).send()
    }
    res.send(task)
}
catch(e){
    res.status(500).send()

}
 })
 
 router.patch('/tasks/:id',auth,async(req,res)=>{
     const Keys=Object.keys(req.body)
     const Values=['description','completed']
     const isValid=Keys.every((update)=>Values.includes(update))
     if(!isValid){res.status(404).send('Updates invalid')}
     try{
         const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
         
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
         if(!task){
             res.status(404).send('Task not found')
         }
         Keys.forEach((value)=>task[value]=req.body[value])
         await task.save()
         res.send(task)
     }
     catch(e) {
         res.status(400).send(e)
     }
 })
 
 router.delete('/tasks/:id',auth,async(req,res)=>{
     
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if(!task){
        res.status(404).send('NO TASK FOUND')
    }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router