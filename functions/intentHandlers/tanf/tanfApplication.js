exports.tanfApplication = async agent => {
  try {
    const link = '<a href="https://www.access.ms.gov/Application" target="_blank">click here</a>'
    await agent.add(
      'TANF, formerly known as the food stamp program, provides monthly benefits that help low income households buy the food they need for good health.'
    )
    await agent.add(`Please ${link} to start a new TANF application.`)
  } catch (err) {
    console.error(err)
  }
}