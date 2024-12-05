const transporter = require("../config/emailConfig");

const sendMail = async (name, email, message) => {
    const mailOptions = {
        from: process.env.SEND_OTP_EMAIL,
        to: process.env.SEND_OTP_EMAIL,
        subject: "📬 New Message from YTGrab Contact Form",
        text: `
Hello,

You have received a new message through the YTGrab Contact Us form:

----------------------------------------------------
👤 Name: ${name}  
📧 Email: ${email}

💬 Message:

${message}
----------------------------------------------------

Best regards,
YTGrab Notification System
        `,
        replyTo: email,  
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendMail;