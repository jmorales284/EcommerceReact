const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"d.santana@gmail.com",
        pass:""
}
})
module.exports =  transporter