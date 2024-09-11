import { Twilio } from "twilio"
import { NextResponse } from "next/server"
import connectdb from "@/mongodb"
import Session from "@/app/models/sessions"



const flows = [
    {
        flowname: "legalservices",
    },
    {
        flowname: "legalservices",
    },
    {
        flowname: "legalservices",
    },
    {
        flowname:"bookappointment",
        stage1:"what is your full name",
        stage2: "what is your email address",
        stage3: "what is your phone number",
        stage4: "which date do you want to book the appointment",
        stage5: "what time do you want to book the appointment",
        stage6: "do you have any additional notes or information",
        stage7: "your appointment has been successfully booked, our team will reach out to confirm availability"
    },
    {
        flowname: "contactkdh",
        stage1: "here are our contact details\nphone number: +254798595416\nemail: law@kdhadvocates.com\naddress: IPS Building, Floor 1, Suite 2 Kimathi Street, Nairobi, Kenya"
    }
]

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new Twilio(accountSid, authToken)


let body
let from
// let responseMessage

// const from = "whatsapp:+263775953491"
// const body = "I need help in legal issues"

const welcometxt = "Hi👋, My I am Mwanasharia, your legal AI personal assistant.I can help you with a number of task in multiple african languages."
const mainmenu = "How can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates"



export async function POST(request){

    const _rawBody = await request.text()
    const _formData = new URLSearchParams(_rawBody)
    const _body = _formData.get('Body')
    const _from = _formData.get('From')

    body = _body
    from = _from
    try{
        connectdb()
        //check if user has an existing conversation
        const session = await Session.findOne({userNumber:from})
        
        if(session){
            var flow = session.flow
            //if conversation exists
            //1. check which the conversation current flow
            //2. check the current stage of the current flow
            //3. present user with the stage menu of the particular flow
            switch(flow){
                case "mainmenu":
                    mainMenu(body);
                    break
                case "bookappointment" :
                    bookAppointment(body, session.currentStep)
                    break
                case "contactus":
                    contactUs(body)
                    break
                default:
                    mainMenu(body)
                    break
            }
        }else{
            //when user doesnt have an existing conversation
            //1. create user conversation
            //2. greet the user
            //3. present the user with main menu

            //creating the session 
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
        // await client.messages.create({
        //     body : responseMessage,
        //     from: 'whatsapp:+14155238886',
        //     to:from
        // })
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

async function mainMenu(usermessage){
    console.log("here is the user message:", usermessage)
  if(usermessage === "5"){
    await client.messages.create({
        body : flows[4].stage1,
        from: 'whatsapp:+14155238886',
        to:from
        })
  }else if(usermessage == "3"){

    //change flow to book appointment and present the book appointment menu to user
    const changeflow = await Session.findOneAndUpdate({userNumber:from},{flow:"bookappointment", currentStep:"1"})
    if(changeflow){
        await client.messages.create({
            body : "To book your appointment we need the following information:",
            from: 'whatsapp:+14155238886',
            to:from
            })
        await client.messages.create({
            body : flows[3].stage1,
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
}

async function bookAppointment(usermessage, currentstep){
    if(currentstep === "1"){
        await Session.findOneAndUpdate({userNumber:from},{currentStep:"2", $set: { "appointmentDetails.name": usermessage }})
        await client.messages.create({
            body : flows[3].stage2,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "2"){
        await Session.findOneAndUpdate({userNumber:from},{currentStep:"3", $set: { "appointmentDetails.email": usermessage }})
        await client.messages.create({
            body : flows[3].stage3,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "3"){
        await Session.findOneAndUpdate({userNumber:from},{currentStep:"4", $set: { "appointmentDetails.phone": usermessage }})
        await client.messages.create({
            body : flows[3].stage4,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "4"){
        await Session.findOneAndUpdate({userNumber:from},{currentStep:"5", $set: { "appointmentDetails.date": usermessage }})
        await client.messages.create({
            body : flows[3].stage5,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "5"){
       await Session.findOneAndUpdate({userNumber:from},{currentStep:"6", $set: { "appointmentDetails.time": usermessage }})
        await client.messages.create({
            body : flows[3].stage6,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "6"){
        await Session.findOneAndUpdate({userNumber:from},{currentStep:"7", $set: { "appointmentDetails.notes": usermessage }})
        await client.messages.create({
            body : flows[3].stage7,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "7"){
        const session = await Session.findOne({userNumber:from})
        await client.messages.create({
            body : `Name:${session.appointmentDetails.name}\nEmail:${session.appointmentDetails.email}\nPhone:${session.appointmentDetails.phone}\nDate:${session.appointmentDetails.date}\nTime:${session.appointmentDetails.time}\nNotes:${session.appointmentDetails.notes}\n\n\n1.Confirm\n2. Cancel`,
            from: 'whatsapp:+14155238886',
            to:from
            })
    }else if(currentstep === "8"){
        if(usermessage === "1"){
            const session = await Session.findOneAndUpdate({userNumber:from},{flow:"mainmenu", currentStep:"1"})
            await client.messages.create({
                body : "Appointment Booked Successfully, Our team will reach out to confirm availability",
                from: 'whatsapp:+14155238886',
                to:from
                }) 
        }else{
            const session = await Session.findOneAndUpdate({userNumber:from},{flow:"mainmenu", currentStep:"1"})
            await client.messages.create({
                body : "Yo have canceled your appointment booking",
                from: 'whatsapp:+14155238886',
                to:from
                })
        }
    }
}

function contactUs(usermessage){

}