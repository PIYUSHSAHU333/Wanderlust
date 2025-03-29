const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});

const sendMail = async (to, subject, text)=>{
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text
    };

    try{
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent =>", info.response);
    }
    catch(e){
        console.log("error=>",e)
    }
    
}

const formatTimeDate = (isostring)=>{
    const dateObj = new Date(isostring);

    const date = dateObj.toLocaleDateString("en-In", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    const time = dateObj.toLocaleTimeString("en-In", {

        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return `${date}, ${time}`; //return both as an object
    
}

module.exports = { sendMail, formatTimeDate};