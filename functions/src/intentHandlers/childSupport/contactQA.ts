export const contactSupportHandoff = async agent => {
  const { supportRoot } = await import('./support')

  try {
    await supportRoot(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}