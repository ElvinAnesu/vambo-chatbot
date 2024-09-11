import { Twilio } from "twilio"
import { NextResponse } from "next/server"
import connectdb from "@/mongodb"
import Session from "@/app/models/sessions"


const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new Twilio(accountSid, authToken)

const welcometxt = "Hi👋, My I am Mwanasharia, your legal AI personal assistant.I can help you with a number of task in multiple african languages."
const mainmenu = "How can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates"
const contactdetails = "Here are our contact details:\n\n1. Email: law@kdhadvocates.com\n2. Phone: +254 798 595 416\n3. Address: IPS Building, Floor 1, Suite 2 Kimathi Street, Nairobi, Kenya"



export async function POST(request){

    const rawBody = await request.text()
    const formData = new URLSearchParams(rawBody)
    const body = formData.get('Body')
    const from = formData.get('From')

    try{
        connectdb()
        //check if user has an existing conversation
        const sessionexists = await Session.findOne({userNumber:from})
        if(sessionexists){
            //user check the flow
            const flow  = sessionexists.flow;
            if(flow === "mainmenu"){
                if(body === "5"){
                    await client.messages.create({
                        body : contactdetails,
                        from: 'whatsapp:+14155238886',
                        to:from
                        })
                }else{
                    await client.messages.create({
                        body : "invalid selection",
                        from: 'whatsapp:+14155238886',
                        to:from
                        })
                        await client.messages.create({
                            body : mainmenu,
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                }
            }else{
                await client.messages.create({
                    body : mainmenu,
                    from: 'whatsapp:+14155238886',
                    to:from
                    })
            }
        }else{ 

            await Session.create({
                    userNumber:from,
                    currentStep:0,
            })
            //2.sending the greetings message
                await client.messages.create({
                    body : welcometxt,
                    from: 'whatsapp:+14155238886',
                    to:from
                    })
            //3.present user with main menu
            await client.messages.create({
                body : mainmenu,
                from: 'whatsapp:+14155238886',
                to:from
                })
        }
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

