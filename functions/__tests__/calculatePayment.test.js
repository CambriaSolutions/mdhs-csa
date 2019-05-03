const { calculatePayment } = require('../calculatePayment')

describe('Payment Estimator', () => {
  test('Should throw an error if options are missing', () => {
    expect(() => {
      calculatePayment(123)
    }).toThrow()
  })

  test('Should throw an error if partial children are used', () => {
    expect(() => {
      const opts = {
        numChildren: 1.5,
        incomeTerm: 'annual',
        grossIncome: 50000,
        taxDeductions: 500,
        ssDeductions: 500,
        retirementContributions: 500,
        otherChildSupport: 0,
      }
      calculatePayment(opts)
    }).toThrow()
  })

  test('Should calculate correctly for annual income', () => {
    const opts = {
      numChildren: 1,
      incomeTerm: 'annual',
      grossIncome: 100000,
      taxDeductions: 20000,
      ssDeductions: 5000,
      retirementContributions: 5000,
      otherChildSupport: 5000,
    }
    expect(calculatePayment(opts)).toBe(758)
  })

  test('Should calculate correctly for annual income and no retirement contributions', () => {
    const opts = {
      numChildren: 3,
      incomeTerm: 'annual',
      grossIncome: 25000,
      taxDeductions: 3000,
      ssDeductions: 1500,
      retirementContributions: 0,
      otherChildSupport: 1000,
    }
    expect(calculatePayment(opts)).toBe(358)
  })

  test('Should calculate correctly for annual income, no retirement contributions & no existing child support', () => {
    const opts = {
      numChildren: 1,
      incomeTerm: 'annual',
      grossIncome: 75000,
      taxDeductions: 3000,
      ssDeductions: 1500,
      retirementContributions: 0,
      otherChildSupport: 0,
    }
    expect(calculatePayment(opts)).toBe(823)
  })

  test('Should calculate correctly for matched child count', () => {
    const opts = {
      numChildren: 3,
      incomeTerm: 'annual',
      grossIncome: 100000,
      taxDeductions: 20000,
      ssDeductions: 5000,
      retirementContributions: 5000,
      otherChildSupport: 5000,
    }
    expect(calculatePayment(opts)).toBe(1192)
  })

  test('Should calculate correctly for overflow child count', () => {
    const opts = {
      numChildren: 12,
      incomeTerm: 'annual',
      grossIncome: 100000,
      taxDeductions: 20000,
      ssDeductions: 5000,
      retirementContributions: 5000,
      otherChildSupport: 5000,
    }
    expect(calculatePayment(opts)).toBe(1408)
  })
})
