export const phoneNumber = async agent => {
  try {
    const { tbd } = await import('../globalFunctions')

    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}