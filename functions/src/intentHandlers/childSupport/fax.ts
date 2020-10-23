export const fax = async agent => {
  const { tbd } = await import('../globalFunctions')

  try {
    await tbd(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}