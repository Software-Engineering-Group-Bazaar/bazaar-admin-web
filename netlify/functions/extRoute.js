const axios = require('axios');

exports.handler = async (event, context) => {
  return await axios.get(event.url);
};
