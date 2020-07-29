const dialogflowFirebaseFulfillment = require('./dialogflowFirebaseFulfillment')
const eventRequest = require('./eventRequest')
const textRequest = require('./textRequest')

module.exports = {
  'dialogflowFirebaseFulfillment': { 'httpTrigger': dialogflowFirebaseFulfillment, 'corsEnabled': false },
  'eventRequest': { 'httpTrigger': eventRequest, 'corsEnabled': true },
  'textRequest': { 'httpTrigger': textRequest, 'corsEnabled': true },
}