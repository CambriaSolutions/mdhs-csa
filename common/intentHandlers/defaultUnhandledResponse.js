// Handles default unhandled intent when no categories are found
exports.defaultUnhandledResponse = async agent => {
  try {
    await agent.add(
      `I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.`
    )
  } catch (err) {
    console.error(err)
  }
}
