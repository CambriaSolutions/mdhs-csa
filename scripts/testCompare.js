const IntentComparator = require('./intentComparator.js');

var comparator = new IntentComparator('calc-root', '../agent/intents', './exported/intents');
console.log(comparator.compare());