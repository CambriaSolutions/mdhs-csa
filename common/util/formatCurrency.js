// Format any number as currency, with prefixed $ sign, commas added per thousands & decimals fixed to 2
exports.formatCurrency = num => {
  return (
    '$' +
    parseFloat(num)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  )
}