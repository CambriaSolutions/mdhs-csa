const isNumber = require('lodash/isNumber')

// Determine the ratio multiplier required to convert income from
// any cadence to monthly. For example:
// Income: 1,000
// Cadence: biweekly
// Multiplier: 24 (24 payments in a year)
// Annual Income: 24,000
exports.getIncomeMultiplier = cadence => {
  // We can only collect income in one of the below cadences
  const allowedCadences = ['biweekly', 'monthly', 'annual']
  if (!allowedCadences.includes(cadence)) {
    throw new Error(
      `${cadence} is not an allowed cadence for estimating payments`
    )
  }

  switch (cadence) {
    case 'biweekly':
      return 24
    case 'monthly':
      return 12
    case 'annual':
      return 1
    default:
      return null
  }
}

// Determine what percentage of annual income is required to be
// contributed toward child support payments
exports.getSupportBracket = numChildren => {
  if (!isNumber(numChildren)) {
    throw new Error('numChildren must be a number for estimation')
  }
  if (numChildren < 1) {
    throw new Error('Must have at least 1 child for estimation')
  }
  if (numChildren % 1 !== 0) {
    throw new Error('Number of children must be a whole integer')
  }
  const pctBrackets = {
    1: 0.14,
    2: 0.2,
    3: 0.22,
    4: 0.24,
  }
  const highPct = 0.26
  const percentage = pctBrackets[numChildren]
    ? pctBrackets[numChildren]
    : highPct

  return percentage
}

// Simple child support estimation based on annual income,
// number of children, and arrears payments
exports.calculatePayment = ({
  income,
  cadence,
  numChildren,
  includeArrears,
}) => {
  // Get the percentage of income that should be paid per year
  const bracketPct = getSupportBracket(numChildren)

  // Get the multiplier to adjust payment to a monthly cadence, e.g. if
  // user provided bi-weekly income, we need to multiply by 2 to get
  // monthly income
  const cadenceMultiplier = getIncomeMultiplier(cadence)
  if (cadenceMultiplier === null) {
    throw new Error(
      `There was a problem determining the multiplier for payment estimation`
    )
  }

  // Convert income from provided cadence to annual
  const annualIncome = income * cadenceMultiplier

  // Determine the annual child support contribution
  const annualPayment = annualIncome * bracketPct

  // Convert annual to monthly payment
  const monthlyPayment = annualPayment / 12

  // If we want to include arrears payments, calculate them and add
  // to the total payment
  let monthlyArrears = 0
  if (includeArrears) {
    const arrearsPct = 0.2
    monthlyArrears = monthlyPayment * arrearsPct
  }

  // Only return whole numbers
  const totalPayment = Math.round(monthlyPayment + monthlyArrears)
  return totalPayment
}
