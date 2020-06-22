exports.docUpload = async agent => {
  try {
    const link = '<a href="https://ea-upload.mdhs.ms.gov/" target="_blank">click here</a>'
    await agent.add('You have the option to upload documentation for your SNAP and TANF programs as requested.')
    await agent.add(`Please ${link} to upload documents requested by your county`)
  } catch (err) {
    console.error(err)
  }
}