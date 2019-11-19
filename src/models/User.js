const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task=require('../models/Task')

const userSchema=new mongoose.Schema({

    name:{type:String,
          trim:true,
          required:true
    },
    age:{type:Number,
        validate(value){
            if(value<0){throw new Error('Age Should be positive')}
            
        },
        
        default:0
        
         
       
    },
    email:{
        type:String,
        unique:true,
        required:true,
        
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){throw new Error('Email Is INVALID')}
        }

  },
  password:{
      type:String,
       required:true,
      trim:true,
      minlength:7,
      validate(value){
          if(value.toLowerCase().includes('password')){throw new Error('password shouldnt have the word password') }
      }
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}],
avatar:{
    type:Buffer
}
},{
    timestamps:true
})
userSchema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON=function(){
    const user=this
    const UserObject=user.toObject()
    delete UserObject.password
    delete UserObject.tokens
    delete UserObject.avatar
    return UserObject
}
userSchema.methods.gettoken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.SECRET_JWT)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}
userSchema.statics.loginUser=async(email,password)=>{
    const user = await User.findOne({email})
    if(!user){throw new Error('Unable to login')}
    const isMatch=await bcrypt.compare(password,user.password)
    if (!isMatch){throw new Error('Unable to login')}
    return user

}
userSchema.pre('save', async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
        
    }

    next()
})
userSchema.pre('remove', async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('user',userSchema)
module.exports=User