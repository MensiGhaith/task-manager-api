const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendEmail=(email,name)=>{
  sgMail.send({
    to:email,
    from:'mensighaith98@gmail.com',
    subject:'Welcome '+name+' to the TEAM',
    text:'you"re now a part of our BIG FAMILY'
  })
}
const GoodbyeMAIL=(email,name)=>{
  sgMail.send({
    to:email,
    from:'mensighaith98@gmail.com',
    subject:'Goodbye '+name+' ',
    text:'SAD TO SEE YOU GO'
  })
}
module.exports={
  GoodbyeMAIL,
  sendEmail
}