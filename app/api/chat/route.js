import { Twilio } from "twilio"
import { NextResponse } from "next/server"

export async function POST(req){
    
    const accountSid = "AC18e60f8ef151bedb8a9a4f5fa4688fae"
    const authToken = "ecb9da8748666d59396cc45b404171d2"
    const {body, from} = await req.json()
    const client = new Twilio(accountSid, authToken)

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
            success: false
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