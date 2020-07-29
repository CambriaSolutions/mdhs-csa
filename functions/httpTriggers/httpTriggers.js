const dialogflowFirebaseFulfillment = require('./dialogflowFirebaseFulfillment')
const eventRequest = require('./eventRequest')
const textRequest = require('./textRequest')
const downloadExport = require ('./downloadExport')

module.exports = {
  'dialogflowFirebaseFulfillment': { 'httpTrigger': dialogflowFirebaseFulfillment, 'corsEnabled': false },
  'eventRequest': { 'httpTrigger': eventRequest, 'corsEnabled': true },
  'textRequest': { 'httpTrigger': textRequest, 'corsEnabled': true },
  'downloadExport': { 'httpTrigger': downloadExport, 'corsEnabled': true },
}