// Upper case the first letter of a string
exports.toTitleCase = string => {
  const excludedWords = ['or', 'and', 'on', 'of', 'to', 'the']
  return string.replace(/\w\S*/g, text => {
    if (!excludedWords.includes(text)) {
      return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
    } else {
      return text
    }
  })
}