export const childCare = async agent => {
  const { tbd } = await import('../globalFunctions')

  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}