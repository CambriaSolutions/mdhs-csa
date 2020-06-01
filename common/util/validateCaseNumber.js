// Used to validate that the user has provided a valid case number
// Valid case numbers start with a 6, are nine digits long, and may have
// a letter of the alphabet at the end.
exports.validateCaseNumber = caseNumber => {
  let validCaseNumber = true
  if (caseNumber.charAt(0) !== '6') {
    validCaseNumber = false
  }
  if (caseNumber.length !== 9 && caseNumber.length !== 10) {
    validCaseNumber = false
  }
  if (
    caseNumber.length === 10 &&
    caseNumber.charAt(9).match(/[a-z]/g === null)
  ) {
    validCaseNumber = false
  }
  if (caseNumber.length === 10) {
    const numberWithoutAlpha = caseNumber.slice(0, 9)

    if (isNaN(numberWithoutAlpha)) {
      validCaseNumber = false
    }
  }
  if (caseNumber.length === 9 && isNaN(caseNumber)) {
    validCaseNumber = false
  }
  return validCaseNumber
}