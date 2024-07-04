import { Twilio } from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new Twilio(accountSid, authToken)

export async function POST(req){
    
    const incomingMessage = req.body.Body;
    const from = req.body.From

    let responseMessage

    if (incomingMessage.toLowerCase() === 'hello') {
        responseMessage = 'Hi there! How can I help you today?';
    } else {
        responseMessage = 'Sorry, I did not understand that. Can you please rephrase?';
    }

    client.messages
            .create({
                body: responseMessage,
                from: 'whatsapp:+14155238886', // Your Twilio number
                to: from
            })
            .then((message) => {
                console.log(message.sid);
                res.status(200).send('Message sent');
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error sending message');
            });
}