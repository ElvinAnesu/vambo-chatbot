import { Twilio } from "twilio";
import { NextResponse } from "next/server";
import connectdb from "@/mongodb";
import Session from "@/app/models/sessions";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

const welcometxt =
	"Hi👋, I am Mwanasharia, your legal AI personal assistant. I can help you with a number of tasks in multiple African languages.";
const mainmenu =
	"How can I help you today🙂\n1. Access laws of Kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates";
const contactdetails =
	"Here are our contact details:\n\n1. Email: law@kdhadvocates.com\n2. Phone: +254 798 595 416\n3. Address: IPS Building, Floor 1, Suite 2 Kimathi Street, Nairobi, Kenya";
const mainmenu2 =
	"How else can I help you today🙂\n1. Access laws of Kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates";
const mainmenuerror =
	"Invalid selection. How can I help you today🙂\n1. Access laws of Kenya\n2. Legal Services\n3. Book an appointment\n4. Apply for Pro Bono Assistance\n5. Contact KDH Advocates";

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
		law: "Brokers Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1930/56/eng@2022-12-31/source",
	},
	{
		law: "Building Surveyors Act",
		url: "https://new.kenyalaw.org/akn/ke/act/2018/19/eng@2022-12-31/source",
	},
	{
		law: "Building Society Act",
		url: "https://new.kenyalaw.org/akn/ke/act/1956/29/eng@2022-12-31/source",
	},
];

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
async function accessLawsFlow(from, session) {
	const currentStep = session.currentStep;
	if (currentStep === 1) {
		// First batch of laws
		const firstFiveLaws = laws.slice(0, 5);
		let lawList = "Here are 5 laws:\n\n";
		firstFiveLaws.forEach((law, index) => {
			lawList += `${index + 1}. ${law.law} - ${law.url}\n\n`;
		});

		// Add options to view more or return to the main menu
		const options = "6. View More Laws\n7. Return to Main Menu";
		const response = lawList + options;

		// Send the list of laws and options to the user
		await sendWhatsAppMessage(from, response);

		// Update session step to allow for further interactions
		session.currentStep = 2;
		await session.save();
	} else if (currentStep === 2) {
		// User selected to either view more or return to main menu
		if (body === "6") {
			// Next set of laws (if available)
			const moreLaws = laws.slice(5);
			let moreLawList = "Here are more laws:\n\n";
			moreLaws.forEach((law, index) => {
				moreLawList += `${index + 6}. ${law.law} - ${law.url}\n\n`;
			});

			// Present the final options
			const options = "7. Return to Main Menu";
			const response = moreLawList + options;

			await sendWhatsAppMessage(from, response);
		} else if (body === "7") {
			// Return to main menu
			session.currentStep = 0;
			await session.save();
			await sendWhatsAppMessage(from, mainmenu2);
		} else {
			// Invalid input, send error message
			await sendWhatsAppMessage(from, mainmenuerror);
		}
	}
}

export async function POST(request) {
	const rawBody = await request.text();
	const formData = new URLSearchParams(rawBody);
	const body = formData.get("Body").trim();
	const from = formData.get("From");

	try {
		// Connect to the database
		await connectdb();

		let sessionexists = await Session.findOne({ userNumber: from });
		if (!sessionexists) {
			// If session doesn't exist, create one and send welcome + main menu
			await Session.create({
				userNumber: from,
				currentStep: 0,
			});
			await sendWhatsAppMessage(from, welcometxt);
			await sendWhatsAppMessage(from, mainmenu);
		} else {
			const currentStep = sessionexists.currentStep;

			// Handle user input from main menu or access laws flow
			if (currentStep === 0) {
				switch (body) {
					case "1":
						// Switch to "Access Laws of Kenya" flow
						sessionexists.currentStep = 1;
						await sessionexists.save();
						await accessLawsFlow(from, sessionexists);
						break;
					case "2":
						await sendWhatsAppMessage(from, "You selected Legal Services.");
						break;
					case "3":
						await sendWhatsAppMessage(
							from,
							"You selected Book an appointment."
						);
						break;
					case "4":
						await sendWhatsAppMessage(
							from,
							"You selected Apply for Pro Bono Assistance."
						);
						break;
					case "5":
						await sendWhatsAppMessage(
							from,
							`Contact Details:\n\n${contactdetails}`
						);
						break;
					default:
						await sendWhatsAppMessage(from, mainmenuerror);
				}
			} else if (currentStep === 1 || currentStep === 2) {
				// Continue with the laws flow
				await accessLawsFlow(from, sessionexists);
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error.message);
		return NextResponse.json({
			status: 500,
			message: "Error sending message",
			success: false,
		});
	}
}
