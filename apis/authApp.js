const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const authApp = express.Router()
authApp.use(express.json())
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const sendMailToUser=require('./mail')
const nodemailer=require('nodemailer');


const transpoter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: "scoretrack@outlook.com",
        pass: "nithin1239"
    }
})


authApp.post('/login',expressAsyncHandler(async(req,res)=>{

    const otpCollection=req.app.get('otpCollection')
    const isOtpPresent=await otpCollection.findOne({email:req.body.email})
    if (isOtpPresent==null){
        const otp=Math.floor(Math.random()*1000000)
        await otpCollection.insertOne({email:req.body.email,otp})
        const options={
            from:'scoretrack@outlook.com',
            to:req.body.email,
            subject:"OTP",
            text:`Your One Time Password is ${otp}`
        };
        transpoter.sendMail(options,function(err,info){
            if(err){
                console.log(err)
                res.send({"message":"Failure"})
            }
            else{
                res.send({"message":"Success"})
            }
        })
    }
    else{
        const otp=Math.floor(Math.random()*1000000)
        await otpCollection.updateOne({email:req.body.email},{$set:{"otp":otp}})
        const options={
            from:'scoretrack@outlook.com',
            to:req.body.email,
            subject:"OTP",
            text:`Your One Time Password is ${otp}`
        };
        transpoter.sendMail(options,function(err,info){
            if(err){
                console.log(err)
                res.send({"message":"Failure"})
            }
            else{
                res.send({"message":"Success"})
            }
        })
    }

}))



authApp.post('/verify-otp',expressAsyncHandler(async(req,res)=>{

    const otpCollection=req.app.get('otpCollection')
    const isOtpPresent=await otpCollection.findOne({email:req.body.email})
    const userCollection=req.app.get('userCollection')
    if (isOtpPresent==null){
        res.send({"message":"No OTP"})
    }
    else{
        if(isOtpPresent.otp==req.body.otp){
            await otpCollection.deleteOne({email:req.body.email})
            isNewuser=await userCollection.findOne({email:req.body.email})
            if(isNewuser==null){
                await userCollection.insertOne({email:req.body.email,booking:[]})
                isNewUser={email:req.body.email,booking:[]}
            }
            const token=jwt.sign({email:req.body.email},'bgvidfh940o54',{expiresIn:"2d"})
            res.send({token,isNewUser})
        }
        else{
            res.send({"message":"Wrong OTP "})
        }
    }






}))

module.exports=authApp