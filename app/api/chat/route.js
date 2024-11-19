import { Twilio } from "twilio";
import { NextResponse } from "next/server";
import connectdb from "@/mongodb";
import Session from "@/app/models/sessions";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

const welcometxt =
	"Hi👋, My I am Mwanasharia, your legal AI personal assistant.I can help you with a number of task in multiple african languages.";
const mainmenu =
	"How can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates";
const contactdetails =
	"Here are our contact details:\n\n1. Email: law@kdhadvocates.com\n2. Phone: +254 798 595 416\n3. Address: IPS Building, Floor 1, Suite 2 Kimathi Street, Nairobi, Kenya";
const mainmenu2 =
	"How else can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates";
const mainmenuerror =
	"How can i help you today🙂\n1. Access laws of kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates";
const laws = [
	{
		law: "Access to information Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2016/31/eng@2022-12-31/publication",
	},
	{
		law: "Accounts Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2008/15/eng@2023-12-11/source",
	},
	{
		law: "Advocates Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1989/18/eng@2024-04-26/source",
	},
	{
		law: "Affordable Housing Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2024/2/eng@2024-03-22/source",
	},
	{
		law: "Age of Majority Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1974/1/eng@1974-04-05/source",
	},

	{
		law: "Banking Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1989/9/eng@2023-09-15/source",
	},
	{
		law: "Basic Education Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2013/14/eng@2022-12-31/source",
	},
	{
		law: "Betting, Lotteries and Gaming Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1966/9/eng@2023-07-01/source",
	},
	{
		law: "Biosafety Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2009/2/eng@2023-12-11/source",
	},
	{
		law: "Brokers Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1930/56/eng@2022-12-31/source",
	},

	{
		law: "Capital Markets Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1989/17/eng@2023-12-11/source",
	},
	{
		law: "Carriage by Air Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1993/2/eng@2022-12-31/source",
	},
	{
		law: "Cattle Cleansing Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1929/32/eng@2022-12-31/source",
	},
	{
		law: "Central Bank of Kenya Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1966/15/eng@2023-09-15/source",
	},
	{
		law: "Central Depositories Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2000/4/eng@2023-12-11/source",
	},

	{
		law: "Dairy Industry Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1958/34/eng@2022-12-31/source",
	},
	{
		law: "Data Protection Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2022-12-31/source",
	},
	{
		law: "Defamation Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1970/10/eng@1992-10-23/source",
	},
	{
		law: "Digital Health Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2023/15/eng@2023-11-24/source",
	},
	{
		law: "Distress for Rent Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1937/1/eng@2022-12-31/source",
	},

	{
		law: "Early Childhood Education Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2021/3/eng@2022-12-31/source",
	},
	{
		law: "East African Development Bank Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1984/3/eng@2022-12-31/source",
	},
	{
		law: "Election Campaign Financing Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2013/42/eng@2022-12-31/source",
	},
	{
		law: "Election Offences Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2016/37/eng@2022-12-31/source",
	},
	{
		law: "Elections Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2011/24/eng@2022-12-31/source",
	},
	//five
	{
		law: "Facilities Improvement Financing Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2023/14/eng@2023-11-24/source",
	},
	{
		law: "Fair Administrative Action Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2015/4/eng@2022-12-31/source",
	},
	{
		law: "Ferries Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1936/15/eng@2022-12-31/source",
	},
	{
		law: "Fertilizers and Animal Foodstuffs Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1962/23/eng@2022-12-31/source",
	},
	{
		law: "Films and Stage Plays Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1962/34/eng@2022-12-31/source",
	},
];

export async function POST(request) {
	const rawBody = await request.text();
	const formData = new URLSearchParams(rawBody);
	const body = formData.get("Body");
	const from = formData.get("From");

	try {
		connectdb();
		const sessionexists = await Session.findOne({ userNumber: from });
		console.log("message receivd");
		if (sessionexists) {
			const flow = sessionexists.flow;
			if (flow === "mainmenu") {
				if (body === "5") {
					await client.messages.create({
						body: contactdetails,
						from: "whatsapp:+14155238886",
						to: from,
					});
					await client.messages.create({
						body: mainmenu2,
						from: "whatsapp:+14155238886",
						to: from,
					});
				} else if (body === "3") {
					const changeflow = await Session.findOneAndUpdate(
						{ userNumber: from },
						{ flow: "bookappointment", currentStep: "1" }
					);
					if (changeflow) {
						await client.messages.create({
							body: "Please provide your details to book an appointment\n\nWhat is your fullname?\n\n#. Back to main menu",
							from: "whatsapp:+14155238886",
							to: from,
						});
					}
				} else if (body === "4") {
					const changeflow = await Session.findOneAndUpdate(
						{ userNumber: from },
						{ flow: "applyprobono", currentStep: "1" }
					);
					if (changeflow) {
						await client.messages.create({
							body: "Please select the language you would like to be assisted in\n\n1. English\n2. KiSwahili\n3. French\n4. Back to menu",
							from: "whatsapp:+14155238886",
							to: from,
						});
					}
				} else if (body === "2") {
					const changeflow = await Session.findOneAndUpdate(
						{ userNumber: from },
						{ flow: "legalservices", currentStep: "1" }
					);
					if (changeflow) {
						await client.messages.create({
							body: "Below are our legal services:\n\n1. Corporate & Commercial Law\n2. Dispute Resolution\n3. Real Estate and Construction Law\n4. Employment and Labor Law\n5. Technology, Media and Technology Law\n6. Tax Law\n7. Banking and Financial Services\n8. Environmental Law and Sustainability\n9. Mergers and Acquisitions\n10. Intellectual Property\n\n11. Back to main menu",
							from: "whatsapp:+14155238886",
							to: from,
						});
					}
				} else if (body === "1") {
					const changeflow = await Session.findOneAndUpdate(
						{ userNumber: from },
						{ flow: "kenyanlaw", currentStep: "1" }
					);
					if (changeflow) {
						kenyanLawFlow("1", from, body);
					}
				} else {
					await client.messages.create({
						body: mainmenuerror,
						from: "whatsapp:+14155238886",
						to: from,
					});
				}
			} else if (flow === "bookappointment") {
				const currentstep = sessionexists.currentStep;
				bookAppointmentFlow(currentstep, from, body);
			} else if (flow === "applyprobono") {
				const currentstep = sessionexists.currentStep;
				applyProbono(currentstep, from, body);
			} else if (flow === "legalservices") {
				const currentstep = sessionexists.currentStep;
				legalServicesFlow(currentstep, from, body);
			} else if (flow === "kenyanlaw") {
				const currentstep = sessionexists.currentStep;
				kenyanLawFlow(currentstep, from, body);
			} else {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			console.log("im in");
			await Session.create({
				userNumber: from,
				currentStep: 0,
			});
			// Sending the greetings message and the main menu in parallel using Promise.all
			await Promise.all([
				client.messages.create({
					body: welcometxt,
					from: "whatsapp:+14155238886",
					to: from,
				}),
				client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				}),
			]);
		}

		return NextResponse.json({
			status: 200,
			message: "Message sent successfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			status: 500,
			message: "Error sending message",
			success: false,
		});
	}
}

// Reusable function to send WhatsApp messages
async function sendWhatsAppMessage(to, body) {
	try {
		await client.messages.create({
			body,
			from: "whatsapp:+14155238886",
			to,
		});
	} catch (error) {
		console.error(`Failed to send message to ${to}:`, error.message);
		throw new Error("Error sending WhatsApp message");
	}
}

// Access Laws of Kenya Flow
async function kenyanLawFlow(currentstep, from, body) {
	const currentStep = currentstep;
	if (currentStep === "1") {
		const firstFiveLaws = laws.slice(0, 5);
		let lawList = "Kenyan Laws:\n\n";
		firstFiveLaws.forEach((law, index) => {
			lawList += `${index + 1}. ${law.law}\n${law.url}\n\n`;
		});
		const options = "6. View More Laws\n7. Return to Main Menu";
		const response = lawList + options;
		await sendWhatsAppMessage(from, response);
		await Session.findOneAndUpdate({ userNumber: from }, { currentStep: "2" });
	} else if (currentStep === "2") {
		if (body === "6") {
			const firstFiveLaws = laws.slice(5, 10);
			let lawList = "Kenyan Laws:\n\n";
			firstFiveLaws.forEach((law, index) => {
				lawList += `${index + 1}. ${law.law}\n${law.url}\n\n`;
			});
			const options = "6. Return to Main Menu";
			const response = lawList + options;
			await sendWhatsAppMessage(from, response);
			await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3" }
			);
		} else if (body === "7") {
			await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			await sendWhatsAppMessage(from, mainmenu2);
		} else {
			const firstFiveLaws = laws.slice(5, 10);
			let lawList = "Kenyan Laws:\n\n";
			firstFiveLaws.forEach((law, index) => {
				lawList += `${index + 1}. ${law.law}\n${law.url}\n\n`;
			});
			const options = "6. Return to Main Menu";
			const response = "Invalid option\n\n" + lawList + options;
			await sendWhatsAppMessage(from, response);
		}
	} else if (currentStep === "3") {
		if (body === "6") {
			await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			await sendWhatsAppMessage(from, mainmenu2);
		} else {
			const firstFiveLaws = laws.slice(5, 10);
			let lawList = "Kenyan Laws:\n\n";
			firstFiveLaws.forEach((law, index) => {
				lawList += `${index + 1}. ${law.law}\n${law.url}\n\n`;
			});
			const options = "6. Return to Main Menu";
			const response = "Invalid option\n\n" + lawList + options;
			await sendWhatsAppMessage(from, response);
		}
	}
}

const bookAppointmentFlow = async (currentstep, from, body) => {
	if (currentstep === "1") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2", $set: { "appointmentDetails.name": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: "what is your phone number\n\n#.Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "2") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", $set: { "appointmentDetails.phone": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: "what is your email address\n\n#.Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "3") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "4", $set: { "appointmentDetails.email": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Which date and time would you like to book for an appointment\n\n#.Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "4") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "5", $set: { "appointmentDetails.date": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Which area of law do you want assistance?\n\n#.Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "5") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "6", $set: { "appointmentDetails.notes": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: `Confirm Details\nName:${nextstep.appointmentDetails.name}\nEmail:${nextstep.appointmentDetails.email}\nPhone:${nextstep.appointmentDetails.phone}\nDate:${nextstep.appointmentDetails.date}\nArea of law:${body}\n\n\n1. Confirm\n2. Cancel`,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "6") {
		if (body === "1") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Appointment successfully booked our team will reach out to confirm availability",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "2") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Appointment successfully booking cancelled",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "6", $set: { "appointmentDetails.notes": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: `Confirm Details\nName:${nextstep.appointmentDetails.name}\nEmail:${nextstep.appointmentDetails.email}\nPhone:${nextstep.appointmentDetails.phone}\nDate:${nextstep.appointmentDetails.date}\nArea of law:${body}\n\n\n1. Confirm\n2. Cancel`,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	}
};

const legalServicesFlow = async (currentstep, from, body) => {
	if (currentstep === "1") {
		if (body === "1") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Corporate & Commercial Law\nDive deep into the corporate world with our experienced legal team, who offer counsel on complex transactions, corporate governance, and regulatory compliance. Our services include providing guidance on asset sales, and securing financing through either single lenders or syndicate loans. We have cultivated expertise in several key areas including corporate restructurings, infrastructure, legal due diligence for both private and public entities, Banking Law and financial services.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "2") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Dispute Resolution\nOur dispute resolution prowess spans across litigation, arbitration, and mediation. We handle cases in various sectors including Administrative Law, Competition, Banking and Finance Litigation, Construction and Infrastructure Dispute Resolution, Corporate and Securities Litigation, Insurance Dispute Resolution and Insolvency Litigationfocusing on achieving favorable outcomes while minimizing risk and disruption to our clients’ operations.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "3") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Real Estate and Construction Law\nNavigate real estate transactions and construction projects with confidence. Our teams specialize in contract negotiation, land use approvals, and real estate finance, providing tailored advice for developers, investors, and property managers.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "4") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Employment and Labor Law\nManage your workforce with confidence under our advisory. From employment contracts and workplace policies to labour disputes and regulatory compliance, our expertise ensures your practices align with labour laws and protect both your company and your employees.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "5") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Technology, Media and Technology Law\nOur expertise covers a broad spectrum of technology-related issues, including data protection, cybersecurity, intellectual property rights, technology law (AI, machine learning, and Fintech), media law and compliance with emerging technology regulations. We support startups and businesses in ensuring that their innovations are protected and their ventures comply with relevant laws.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "6") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Tax Law\nOur tax specialists provide strategic advice to ensure compliance and optimize tax positions. We handle everything from routine corporate tax planning and compliance to complex international tax matters and dispute resolution with tax authorities.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "7") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Banking and Financial Services\nWe advise banks, financial institutions, and fintech companies on regulatory compliance, financial instruments, and loan agreements. Our team ensures that your financial operations align with current laws and best practices, facilitating robust financial transactions.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "8") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Environmental Law and Sustainability\nAddress the complexities of environmental compliance and sustainability. Our firm supports clients in navigating regulations related to renewable energy projects, environmental due diligence, and sustainable business practices.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "9") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Mergers and Acquisitions\nWe leverage the experience of our our M&A team to provide end-to-end support at every phase of the merger or acquisition process. We provide restructuring advice, conduct due diligence, advise on compliance with all legal formalities, and prepare and negotiate transaction documents, including share purchase agreements, subscription agreements, options agreements and shareholders’ agreements.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "10") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Intellectual Property\nProtect your most valuable assets with our intellectual property expertise. From filing patents to defending against infringement, our team supports innovation by securing your intellectual property rights across various industries.\n1. Book appointment\n2. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "11") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			await client.messages.create({
				body: "Invalid option\n\nBelow are our legal services:\n\n1. Corporate & Commercial Law\n2. Dispute Resolution\n3. Real Estate and Construction Law\n4. Employment and Labor Law\n5. Technology, Media and Technology Law\n6. Tax Law\n7. Banking and Financial Services\n8. Environmental Law and Sustainability\n9. Mergers and Acquisitions\n10. Intellectual Property\n\n11. Back to main menu",
				from: "whatsapp:+14155238886",
				to: from,
			});
		}
	} else if (currentstep === "2") {
		if (body === "1") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "bookappointment", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: "Please provide your details to book an appointment\n\nWhat is your fullname?",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
		if (body === "2") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	}
};

const applyProbono = async (currentstep, from, body) => {
	if (currentstep === "1") {
		if (body === "1") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "2", languagePreference: "english" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "What type of case do you need assistance with?\n\n1. Employment Issue\n2. Car Accident\n3. Domestic Violence\n4. Someone was arrested\n5. Land Issues\n6. Other\n7. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "2") {
			await client.messages.create({
				body: "KiSwahili will be available soon please use english",
				from: "whatsapp:+14155238886",
				to: from,
			});
		} else if (body === "3") {
			await client.messages.create({
				body: "French will be available soon please use english",
				from: "whatsapp:+14155238886",
				to: from,
			});
		} else if (body === "4") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			await client.messages.create({
				body: "Invalid oiption\n\nPlease select the language you would like to be assisted in\n\n1. English\n2. KiSwahili\n3. French\n4. Back to menu",
				from: "whatsapp:+14155238886",
				to: from,
			});
		}
	} else if (currentstep === "2") {
		if (body === "1") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", proBonoCaseType: "Employment" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?\n\n#Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "2") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", proBonoCaseType: "Car Accident" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?\n\n#Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "3") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", proBonoCaseType: "Domestic Violence" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?\n\n#Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "4") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", proBonoCaseType: "Someone Arrested" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?\n\n#Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "5") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", proBonoCaseType: "Land Issue" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?\n\n#Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "6") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "3", proBonoCaseType: "Other" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Please provide the following details so that our probono team will reach out to you\n\nWhat is your full name?\n\n#Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "7") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			await client.messages.create({
				body: "Invalid option\n\nWhat type of case do you need assistance with?\n\n1. Employment Issue\n2. Car Accident\n3. Domestic Violence\n4. Someone was arrested\n5. Land Issues\n6. Other\n7. Back to main menu",
				from: "whatsapp:+14155238886",
				to: from,
			});
		}
	} else if (currentstep === "3") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "4", $set: { "appointmentDetails.name": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: "What is your phone number?\n\n#. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "4") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "5", $set: { "appointmentDetails.phone": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: "What is your email address?\n\n#. Back to main menu",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "5") {
		if (body === "#") {
			const changeflow = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ flow: "mainmenu", currentStep: "1" }
			);
			if (changeflow) {
				await client.messages.create({
					body: mainmenu,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "6", $set: { "appointmentDetails.email": body } }
			);
			if (nextstep) {
				await client.messages.create({
					body: `Confirm details?\n\nName :${nextstep.appointmentDetails.name}\nPhone :${nextstep.appointmentDetails.phone}\nEmail :${body}\nCase Type :${nextstep.proBonoCaseType} \n\n1.Confirm\n2.Cancel`,
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	} else if (currentstep === "6") {
		if (body === "1") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "1", flow: "mainmenu" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Application successfully submited. Our probono team will reach out to you",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		} else if (body === "2") {
			const nextstep = await Session.findOneAndUpdate(
				{ userNumber: from },
				{ currentStep: "1", flow: "mainmenu" }
			);
			if (nextstep) {
				await client.messages.create({
					body: "Application cancelled",
					from: "whatsapp:+14155238886",
					to: from,
				});
			}
		}
	}
};
