const mongoose=require('mongoose')
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true, useFindAndModify:false})


// const task1=new task({
//     description:'Clean the House   ',
    
// })
// task1.save().then(()=>{
//     console.log(task1)

// }).catch((error)=>{
//     console.log(error)
// })

//USER MODEL

// const me =new user({
//     name:'Ghaith',
    
//     email:'mensighaith98@gmail.com',
//     age:21,
//     password:'52509447  '
// })
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })