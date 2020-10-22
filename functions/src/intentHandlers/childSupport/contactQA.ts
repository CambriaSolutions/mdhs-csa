export const contactSupportHandoff = async agent => {
  const { supportRoot } = await import('./support')

  try {
    await supportRoot(agent)
  } catch (error) {
    console.error(error)
  }
}