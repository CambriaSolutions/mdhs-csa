exports.apptsRoot = async agent => {
  try {
    await agent.add('Appointments placeholder')
  } catch (err) {
    console.log(err)
  }
}
