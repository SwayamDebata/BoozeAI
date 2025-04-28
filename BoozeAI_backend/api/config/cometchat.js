require('dotenv').config();

module.exports = {
  COMETCHAT_API_KEY: process.env.COMETCHAT_API_KEY,
  COMETCHAT_APP_ID: process.env.COMETCHAT_APP_ID,
  COMETCHAT_REGION: process.env.COMETCHAT_REGION,
  COMETCHAT_API_URL: `https://${process.env.COMETCHAT_APP_ID}.api-${process.env.COMETCHAT_REGION}.cometchat.io/v3/users`
};
