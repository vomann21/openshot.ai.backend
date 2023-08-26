const nodemailer=require('nodemailer');

const transpoter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: "scoretrack@outlook.com",
        pass: "nithin1239"
    }
})


let sendMailToUser=async(object)=>{
    const options={
        from:'scoretrack@outlook.com',
        to:object.email,
        subject:object.subject
    };

    var result=''
   await transpoter.sendMail(options,function(err,info){
        console.log("hello")
        if(err){
            console.log(err)
            result= "Failure"
        }
        else{
           result= "Success"
        }
    })
    return result
}

module.exports=sendMailToUser