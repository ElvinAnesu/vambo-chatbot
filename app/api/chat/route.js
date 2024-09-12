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
                }else if(body === "2"){
                    const changeflow = await Session.findOneAndUpdate({userNumber:from},{flow:"legalservices", currentStep:"1"})
                    if(changeflow){
                        await client.messages.create({
                            body : "Below are our legal services:\n\n1. Corporate & Commercial Law\n2. Dispute Resolution\n3. Real Estate and Construction Law\n4. Employment and Labor Law\n5. Technology, Media and Technology Law\n6. Tax Law\n7. Banking and Financial Services\n8. Environmental Law and Sustainability\n9. Mergers and Acquisitions\n10. Intellectual Property",
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
                const currentstep = sessionexists.currentStep
                if(currentstep === "1"){
                    if(body === "1"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2", languagePreference:"english"})
                        if(nextstep){
                            await client.messages.create({
                                body : "What type of case do you need assistance with?\n\n1. Employment Issue\n2. Car Accident\n3. Domestic Violence\n4. Someone was arrested\n5. Land Issues\n6. Other",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else{
                        await client.messages.create({
                            body : "Other languages will be available soon please use english",
                            from: 'whatsapp:+14155238886',
                            to:from
                            }) 
                    }
                }else if(currentstep === "2"){

                    if(body === "1"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3",proBonoCaseType:"Employment"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "2"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3",proBonoCaseType:"Car Accident"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "3"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3",proBonoCaseType:"Domestic Violence"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "4"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3",proBonoCaseType:"Someone Arrested"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "5"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3",proBonoCaseType:"Land Issue"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "6"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"3",proBonoCaseType:"Other"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }
                }else if(currentstep === "3"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"4",$set:{"appointmentDetails.name": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : "What is your phone number?",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "4"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"5",$set:{"appointmentDetails.phone": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : "What is your phone email address?",
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "5"){
                    const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"6",$set:{"appointmentDetails.email": body}})
                    if(nextstep){
                        await client.messages.create({
                            body : `Confirm details?\n\nName :${nextstep.appointmentDetails.name}\nPhone :${nextstep.appointmentDetails.phone}\nEmail :${body}\nCase Type :${nextstep.proBonoCaseType} \n\n1.Confirm\n2.Cancel`,
                            from: 'whatsapp:+14155238886',
                            to:from
                            })
                    }
                }else if(currentstep === "6"){
                    if(body === "1"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"1",flow:"mainmenu"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Application successfully submited. Our probono team will reach out to you",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "2"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"1",flow:"mainmenu"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Application cancelled",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }
                }
            }else if(flow === "legalservices"){
                const currentstep = sessionexists.currentStep
                if(currentstep === "1"){
                    if(body === "1"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Corporate & Commercial Law\nDive deep into the corporate world with our experienced legal team, who offer counsel on complex transactions, corporate governance, and regulatory compliance. Our services include providing guidance on asset sales, and securing financing through either single lenders or syndicate loans. We have cultivated expertise in several key areas including corporate restructurings, infrastructure, legal due diligence for both private and public entities, Banking Law and financial services.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "2"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Dispute Resolution\nOur dispute resolution prowess spans across litigation, arbitration, and mediation. We handle cases in various sectors including Administrative Law, Competition, Banking and Finance Litigation, Construction and Infrastructure Dispute Resolution, Corporate and Securities Litigation, Insurance Dispute Resolution and Insolvency Litigationfocusing on achieving favorable outcomes while minimizing risk and disruption to our clients’ operations.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "3"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Real Estate and Construction Law\nNavigate real estate transactions and construction projects with confidence. Our teams specialize in contract negotiation, land use approvals, and real estate finance, providing tailored advice for developers, investors, and property managers.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "4"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Employment and Labor Law\nManage your workforce with confidence under our advisory. From employment contracts and workplace policies to labour disputes and regulatory compliance, our expertise ensures your practices align with labour laws and protect both your company and your employees.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "5"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Technology, Media and Technology Law\nOur expertise covers a broad spectrum of technology-related issues, including data protection, cybersecurity, intellectual property rights, technology law (AI, machine learning, and Fintech), media law and compliance with emerging technology regulations. We support startups and businesses in ensuring that their innovations are protected and their ventures comply with relevant laws.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "6"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Tax Law\nOur tax specialists provide strategic advice to ensure compliance and optimize tax positions. We handle everything from routine corporate tax planning and compliance to complex international tax matters and dispute resolution with tax authorities.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "7"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Banking and Financial Services\nWe advise banks, financial institutions, and fintech companies on regulatory compliance, financial instruments, and loan agreements. Our team ensures that your financial operations align with current laws and best practices, facilitating robust financial transactions.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "8"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Environmental Law and Sustainability\nAddress the complexities of environmental compliance and sustainability. Our firm supports clients in navigating regulations related to renewable energy projects, environmental due diligence, and sustainable business practices.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "9"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Mergers and Acquisitions\nWe leverage the experience of our our M&A team to provide end-to-end support at every phase of the merger or acquisition process. We provide restructuring advice, conduct due diligence, advise on compliance with all legal formalities, and prepare and negotiate transaction documents, including share purchase agreements, subscription agreements, options agreements and shareholders’ agreements.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }else if(body === "10"){
                        const nextstep = await Session.findOneAndUpdate({userNumber:from}, {currentStep:"2"})
                        if(nextstep){
                            await client.messages.create({
                                body : "Intellectual Property\nProtect your most valuable assets with our intellectual property expertise. From filing patents to defending against infringement, our team supports innovation by securing your intellectual property rights across various industries.\n1. Book appointment\n2. Back to main menu",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })
                        }
                    }
                }else if(currentstep === "2"){
                    if(body === "1"){
                        const changeflow = await Session.findOneAndUpdate({userNumber:from},{flow:"bookappointment", currentStep:"1"})
                        if(changeflow){
                            await client.messages.create({
                                body : "Please provide your details to book an appointment\n\nWhat is your fullname?",
                                from: 'whatsapp:+14155238886',
                                to:from
                                })  
                        }
                    }if(body === "2"){
                        const changeflow = await Session.findOneAndUpdate({userNumber:from},{flow:"mainmenu", currentStep:"1"})
                        if(changeflow){
                            await client.messages.create({
                                body : mainmenu,
                                from: 'whatsapp:+14155238886',
                                to:from
                                })  
                        }
                    }
                }
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

