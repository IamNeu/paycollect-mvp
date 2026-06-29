const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns')

const snsClient = new SNSClient({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})

const sendSMS = async({ phoneNumber, message }) => {
    try {
        // Format phone number — must include country code
        let formattedNumber = phoneNumber.toString().trim()
        if (!formattedNumber.startsWith('+')) {
            formattedNumber = '+' + formattedNumber
        }

        const command = new PublishCommand({
            Message: message,
            PhoneNumber: formattedNumber,
            MessageAttributes: {
                'AWS.SNS.SMS.SMSType': {
                    DataType: 'String',
                    StringValue: 'Transactional'
                },
                'AWS.SNS.SMS.SenderID': {
                    DataType: 'String',
                    StringValue: 'PayCollect'
                }
            }
        })

        const response = await snsClient.send(command)
        console.log('SMS sent successfully:', response.MessageId)
        return { success: true, messageId: response.MessageId }
    } catch (err) {
        console.error('SMS error:', err.message)
        return { success: false, error: err.message }
    }
}

module.exports = { sendSMS }