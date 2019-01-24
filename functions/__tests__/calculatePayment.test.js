const { calculatePayment } = require('../calculatePayment')

describe('Payment Estimator', () => {
  test('Should throw an error if options are missing', () => {
    expect(() => {
      calculatePayment(123)
    }).toThrow()
  })

  test('Should calculate correctly for annual income', () => {
    const opts = {
      income: 50000,
      cadence: 'annual',
      numChildren: 1,
      includeArrears: false,
    }
    expect(calculatePayment(opts)).toBe(583)
  })

  test('Should calculate correctly for biweekly income', () => {
    const opts = {
      income: 2083.33,
      cadence: 'biweekly',
      numChildren: 1,
      includeArrears: false,
    }
    expect(calculatePayment(opts)).toBe(583)
  })

  test('Should calculate correctly for monthly income', () => {
    const opts = {
      income: 4166.67,
      cadence: 'monthly',
      numChildren: 1,
      includeArrears: false,
    }
    expect(calculatePayment(opts)).toBe(583)
  })

  test('Should calculate correctly for matched child count', () => {
    const opts = {
      income: 50000,
      cadence: 'annual',
      numChildren: 3,
      includeArrears: false,
    }
    expect(calculatePayment(opts)).toBe(917)
  })

  test('Should calculate correctly for overflow child count', () => {
    const opts = {
      income: 50000,
      cadence: 'annual',
      numChildren: 12,
      includeArrears: false,
    }
    expect(calculatePayment(opts)).toBe(1083)
  })

  test('Should calculate correctly for arrears payments', () => {
    const opts = {
      income: 50000,
      cadence: 'annual',
      numChildren: 1,
      includeArrears: true,
    }
    expect(calculatePayment(opts)).toBe(700)
  })
})
