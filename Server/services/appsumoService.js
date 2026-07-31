const crypto = require('crypto')
const axios = require('axios')

const APPSUMO_API_KEY = process.env.APPSUMO_API_KEY
const APPSUMO_CLIENT_ID = process.env.APPSUMO_CLIENT_ID
const APPSUMO_CLIENT_SECRET = process.env.APPSUMO_CLIENT_SECRET
const APPSUMO_REDIRECT_URI = process.env.APPSUMO_REDIRECT_URI

function verifyWebhookSignature(timestamp, rawBody, signature) {
    const payload = `${timestamp}${rawBody}`
    const expected = crypto.createHmac('sha256', APPSUMO_API_KEY).update(payload).digest('hex')
    return expected === signature
}

async function exchangeCodeForToken(code) {
    const response = await axios.post('https://appsumo.com/openid/token/', {
        client_id: APPSUMO_CLIENT_ID,
        client_secret: APPSUMO_CLIENT_SECRET,
        redirect_uri: APPSUMO_REDIRECT_URI,
        code,
        grant_type: 'authorization_code'
    })
    return response.data
}

async function fetchLicenseKey(accessToken) {
    const response = await axios.get('https://appsumo.com/openid/license_key/', {
        params: { access_token: accessToken }
    })
    return response.data
}

async function getLicense(licenseKey) {
    const response = await axios.get(`https://api.licensing.appsumo.com/v2/licenses/${licenseKey}`, {
        headers: { 'X-AppSumo-Licensing-Key': APPSUMO_API_KEY }
    })
    return response.data
}

module.exports = { verifyWebhookSignature, exchangeCodeForToken, fetchLicenseKey, getLicense }
