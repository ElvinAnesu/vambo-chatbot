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
const mainmenu2 = "How else can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates"
const mainmenuerror = "How can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates"

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
            const flow  = sessionexists.flow
            if(flow === "mainmenu"){
                if(body === "5"){
                    await client.messages.create({
                        body : contactdetails,
                        from: 'whatsapp:+14155238886',
                        to:from
                        })
                    await client.messages.create({
                        body : mainmenu2,
                        from: 'whatsapp:+14155238886',
                        to:from
                        })    
                }else if(body === "3"){
                    const changeflow = await Session.findOneAndUpdate({userNumber:from},{flow:"bookappointment", currentStep:"1"})
                    if(changeflow){
                        await client.messages.create({
                            body : "Please provide your details to book an appointment\n\nWhat is your fullname?",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })  
                    }
                }else if(body === "4"){
                    const changeflow = await Session.findOneAndUpdate({userNumber:from},{flow:"applyprobono", currentStep:"1"})
                    if(changeflow){
                        await client.messages.create({
                            body : "Please select the language you would like to be assisted in\n\n1. English\n2. KiSwahili\n3. French",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })  
                    }
                }
                else{
                    await client.messages.create({
                        body : mainmenuerror,
                        from: 'whatsapp:+14155238886',
                        to:from
                        })
                }
            }else if(flow === "bookappointment"){
                const currentstep = sessionexists.currentStep
                if(currentstep === "1"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2", $set:{"appointmentDetails.name": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : "what is your phone number",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "2"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3", $set:{"appointmentDetails.phone": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : "what is your email address",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "3"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"4", $set:{"appointmentDetails.email": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : "Which date and time would you like to book for an appointment",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "4"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"5", $set:{"appointmentDetails.date": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : "Which area of law do you want assistance?",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "5"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"6", $set:{"appointmentDetails.notes": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : `Confirm Details\nName:${nextstep.appointmentDetails.name}\nEmail:${nextstep.appointmentDetails.email}\nPhone:${nextstep.appointmentDetails.phone}\nDate:${nextstep.appointmentDetails.date}\nArea of law:${body}\n\n\n1. Confirm\n2. Cancel`,
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "6"){
                    if(body === "1"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from},{flow:"mainmenu", currentStep:"1"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Appointment successfully booked our team will reach out to confirm availability",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "2"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from},{flow:"mainmenu", currentStep:"1"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Appointment successfully booking cancelled",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else{
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"6", $set:{"appointmentDetails.notes": body}})
                        if(nextstep){
                            await client.messages.create({
                                body : `Confirm Details\nName:${nextstep.appointmentDetails.name}\nEmail:${nextstep.appointmentDetails.email}\nPhone:${nextstep.appointmentDetails.phone}\nDate:${nextstep.appointmentDetails.date}\nArea of law:${body}\n\n\n1. Confirm\n2. Cancel`,
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }
                }
            }else if(flow === "applyprobono"){

            } else{
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

