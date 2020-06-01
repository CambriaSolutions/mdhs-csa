require('dotenv').config()

exports.admin = require('firebase-admin')

exports.app = admin.initializeApp()

exports.db = admin.firestore()

exports.projectId = app.options.credential.projectId