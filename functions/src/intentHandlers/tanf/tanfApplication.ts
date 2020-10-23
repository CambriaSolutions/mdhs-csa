import { handleEndConversation } from '../globalFunctions'

export const tanfApplication = async agent => {
  try {
    const link = '<a href="https://www.access.ms.gov/Application" target="_blank">click here</a>'

    await agent.add(
      'The TANF Program provides for families with needy children under age 18. \
      The program is designed to help families achieve self-sufficiency through employment \
      and training.'
    )

    await agent.add(`Please ${link} to start a new TANF application.`)
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}