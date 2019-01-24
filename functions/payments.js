exports.pmtRoot = async agent => {
  try {
    await agent.add('payments placeholder')
  } catch (err) {
    console.log(err)
  }
}
