import { Twilio } from "twilio"
import { NextResponse } from "next/server"

export async function POST(req){
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    
    const rawBody = await request.text();

    // Parse the form-encoded data
    const formData = new URLSearchParams(rawBody);
    // Get individual form data fields
    const body = formData.get('Body');
    const from = formData.get('From');
    const client = new Twilio(accountSid, authToken)

    console.log("from: ", from)
    console.log("body:", body)
    let responseMessage

    if(body.toLowerCase().includes('hello')){
        responseMessage = 'Hi there! How can I help you today?';
    } else {
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