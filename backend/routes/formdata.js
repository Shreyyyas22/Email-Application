const express = require('express')
const router=express.Router();
const FormData = require('../db')
const zod =require('zod')
const nodemailer = require('nodemailer');
require('dotenv').config();

router.get('/data',async(req, res) => {
    try {
        const data=await FormData.find();

        if(!data){
            res.status(404).json({
                message:"No data found"
            })}
            else{
                res.json(data);
            }
        }
    catch(error) {
        res.status(500).json({ error: error.message ,
        message:"Internal Server Error"  
        });
    }

})

const indianPhoneNumberRegex = /^\+?([91]|\0)?[-\s]?[3-9]\d{3}\d{6}$/;
const inputBody=zod.object({
    name:zod.string(),
    phoneNumber:zod.string().refine((value) => indianPhoneNumberRegex.test(value), {
        message: "Invalid Indian phone number format",
      }),
    email:zod.string().email(),
    hobbies:zod.string()
})
//route to input data
router.post('/data',async(req, res) => {
 
    const  result =inputBody.safeParse(req.body);
    if(result.success) {
        try{
            const { name, phoneNumber, email, hobbies } = result.data;
             
            const newDataModel = new FormData({ name, phoneNumber, email, hobbies });
          
            const savedData = await newDataModel.save();

            res.status(200).json({
                message:"insertion successfull",
                savedData:savedData
            })

        }catch(error){
            res.status(500).json({ message: "Internal Server Error" });
        }
    }else{
        res.status(401).json({ message: "Validation error", details: result.error.errors })
    }
 
})
//route to update data
router.patch('/data/:id',async(req, res) => {
try 
{
    const updatedData=await FormData.findByIdAndUpdate(req.params.id,req.body,{new:true})
   
    if(!updatedData){
        res.status(404).json({ message: "Error updating data"});
    }
    else{
    res.json({
        message:"Data Updated Successfully",
        updatedData:updatedData
    })
    }
}catch(error){
    res.status(500).json({
        message:"Internal server Error",
        cause:error.message
    })
}
})

//route to delete data
router.delete('/data/:id',async(req, res) =>{
    try{
        const deleteData=await FormData.findByIdAndDelete(req.params.id)
        
        if(!deleteData){
            res.status(404).json({ message: "Error deleting data"})
        }
        else{
            res.status(200).json({
                message:"Data Deleted Successfully",
                deleteData:deleteData
            })
        }
    }
    catch(error){
          res.status(500).json({
            message:"Internal server Error",
          })
    }
})


// Send data to email
router.post('/send-email', async (req, res) => {
    try {
        const { selectedRows } = req.body;

        const  stringifyData=JSON.stringify(selectedRows,null,2)
        console.log("your data", stringifyData)
        
        if (!selectedRows) {
          return res.status(400).json({ message: 'Selected rows data is missing in the request.' });
        }
    
    
        const transporter = nodemailer.createTransport({
            service:"gmail",
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,  
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
            type: 'PLAIN',
          },
        });
    
        const mailOptions = {
          from: {
            name:"nodemailer",
            address:process.env.EMAIL_USER,
        },
          to: 'info@redpositive.in',
          subject: 'Selected Rows Data',
          text: JSON.stringify(selectedRows,null,2),
        };
    
 
     await transporter.sendMail(mailOptions);
    
        res.status(200).json({ message: 'Data sent to email successfully.' },
        {mailOptions:mailOptions});
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
    });
 
  
module.exports=router