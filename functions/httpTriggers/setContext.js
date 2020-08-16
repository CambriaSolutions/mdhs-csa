const admin = require('firebase-admin')
const db = admin.firestore()

module.exports = async (request, response) => {
  const session = request.body.session
  if (session) {
    const contexts = request.body.contexts
    await db.collection('preloadedContexts').doc(session).set({
      contexts: contexts
    })
    response.status(200).send()
  } else {
    response.status(500).send()
  }
}