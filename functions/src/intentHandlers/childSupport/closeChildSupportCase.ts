export const closeCSCQACloseCase = async agent => {
  const { supportType } = await import('./support')

  try {
    await supportType(agent, 'request case closure')
  } catch (err) {
    console.error(err.message, err)
  }
}