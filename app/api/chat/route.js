import { Twilio } from "twilio"
import { NextResponse } from "next/server"

export async function POST(request){
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    
    const rawBody = await request.text();


    const formData = new URLSearchParams(rawBody);
    const body = formData.get('Body');
    const from = formData.get('From');
    const client = new Twilio(accountSid, authToken)

    console.log("from: ", from)
    console.log("body:", body)
    let responseMessage

    if(body.toLowerCase().includes('hello') || body.toLowerCase().includes('hi')){
        responseMessage = 'Hi👋, My I am Mwanasharia, your legal AI personal assistant.I can help you with a number of task in multiple african languages. How can i help you today🙂\n1. Translate from english to any african language\n2. Transalate any language to english\n3. Book an appointment';
    }else if(body === "1"){
        responseMessage = "This service is under upgrade to give you a wonderfull user experience how els can i help you?"
    } else if(body === "2"){
        responseMessage = "This service is under upgrade to give you a wonderfull user experience how els can i help you?"
    } else if(body === "3"){
          responseMessage = "Please provide the date and time you would like to book whe appointment and our team will reach out to you to confirm availabiliti.\nstart with 'book appointment' followed by your infomation"
    } else if(body.toLowerCase().includes('book appointment')){
        responseMessage = "Appointment has been booked. our team will reach out to confirm availabiliity"
    }
    else  {
        responseMessage = 'Sorry, I didn\'t understand that. Can you please rephrase?';
    }
    try{
        await client.messages.create({
            body : responseMessage,
            from: 'whatsapp:+14155238886',
            to:from
        })
        return NextResponse.json({
            status: 200,
            message: "Message sent successfully",
            success: true
        })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            status: 500,
            message: "Error sending message",
            success: false
        })
    }

}