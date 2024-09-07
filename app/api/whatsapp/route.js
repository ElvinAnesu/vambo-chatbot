// pages/api/whatsapp.js

import { Twilio } from 'twilio';

const accountSid = "AC18e60f8ef151bedb8a9a4f5fa4688fae";
const authToken = "";
const client = new Twilio(accountSid, authToken);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { Body, From } = req.body;

        let responseMessage;

        // Your chatbot logic
        if (Body.toLowerCase().includes('hello')) {
            responseMessage = 'Hi there! How can I help you today?';
        } else {
            responseMessage = 'Sorry, I didn\'t understand that. Can you please rephrase?';
        }

        try {
            await client.messages.create({
                body: responseMessage,
                from: 'whatsapp:+14155238886', // Your Twilio number
                to: From
            });
            res.status(200).send('Message sent');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error sending message');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
