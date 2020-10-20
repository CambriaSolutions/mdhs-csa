// Calculate metrics based on requests
module.exports = async (req, res) => {
  if (req.body.errorMessage) {
    console.error(new Error(req.body.errorMessage))
  } else {
    console.error(new Error('Error: mdhs-csa@appspot.gserviceaccount.com does not have storage.objects.get access to the Google Cloud Storage object.'))
  }

  res.status(200).send()
}