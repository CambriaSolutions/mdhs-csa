import { keyBy, map, reduce, orderBy, mapValues } from 'lodash'
import { format, differenceInCalendarDays } from 'date-fns'

const dateAdd = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const determineStartDate = (date, dateFilter) => {
  if (dateFilter === 'Today') {
    return new Date()
  } else if (dateFilter === 'Yesterday') {
    return dateAdd(date, -1)
  } else if (dateFilter === 'Last 7 days') {
    return dateAdd(date, -7)
  } else if (dateFilter === 'Last 30 days') {
    return dateAdd(date, -30)
  } else if (dateFilter === 'Last 90 days') {
    return dateAdd(date, -90)
  } else if (dateFilter === 'Last quarter') {
    const quarterMonthStart = Math.floor((date.getMonth() - 1) / 3) * 3 // 0 = Jan, 1 = Feb
    return new Date(date.getFullYear(), quarterMonthStart, 1);
  } else {
    // dateFilter === 'Last 12 months'
    return new Date(date.getFullYear() - 1, date.getMonth() - 1, 1);
  }
}

const determineNumberOfDaysInFilter = (date, dateFilter, filterStartDate = null, filterEndDate = null) => {
  if (dateFilter === 'Today') {
    return 1
  } else if (dateFilter === 'Yesterday') {
    return 1
  } else if (dateFilter === 'Last 7 days') {
    return 7
  } else if (dateFilter === 'Last 30 days') {
    return 30
  } else if (dateFilter === 'Last 90 days') {
    return 90
  } else if (dateFilter === 'Last quarter') {
    const quarterMonthStart = Math.floor((date.getMonth() - 1) / 3) * 3 // 0 = Jan, 1 = Feb

    if (quarterMonthStart === 0) {
      return 90
    } else if (quarterMonthStart === 3) {
      return 91
    } else if (quarterMonthStart === 6) {
      return 92
    } else {
      return 92
    }
  } else if (dateFilter === 'Last quarter') {
    // 'Last 12 months'
    return 365
  } else {
    // dateFilter === 'Custom'
    return differenceInCalendarDays(new Date(filterEndDate), new Date(filterStartDate))
  }
}

// If a day has no data (maybe it was the weekend), then we fill in that data with zeroes.
// NOTE - This will not fill in the specific support requests types with zeroes.
const fillMissingData = (metrics, dateFilter, filterStartDate = null, filterEndDate = null) => {
  const metricsByDate = keyBy(metrics, x => x.id)
  const startDate = dateFilter !== 'Custom' ? determineStartDate(new Date(), dateFilter) : new Date(filterStartDate)
  const numberOfDaysInFilter = determineNumberOfDaysInFilter(new Date(), dateFilter, filterStartDate, filterEndDate)

  let cleanedData = []

  for (var i = 0; i < numberOfDaysInFilter; i++) {
    const formattedDate = format(dateAdd(startDate, i), 'MM-dd-yyyy')
    if (metricsByDate[formattedDate]) {
      cleanedData.push({
        id: formattedDate,
        numConversations: metricsByDate[formattedDate].numConversations,
        numConversationsWithDuration: metricsByDate[formattedDate].numConversationsWithDuration,
        supportRequests: metricsByDate[formattedDate].supportRequests
      })
    } else {
      cleanedData.push({
        id: formattedDate,
        numConversations: 0,
        numConversationsWithDuration: 0,
        supportRequests: []
      })
    }
  }

  return cleanedData
}

// Not every day has a value for each type of support request. This function will make sure
// every day has a property for each support ticket type, and defaults to zero when necessary.
const sortAndFillSupportRequestBlanks = (data, typesOfSupportRequests) => {
  // Sort by date
  const dataSorted = orderBy(data, x => new Date(x.id).getTime())

  // Create an object that contains all the types of support requests (as keys), and their values are 0
  // We do it this way to keep this logic generic and future proof in case new types of support requests are added
  const defaultSupportValues = mapValues(keyBy([...typesOfSupportRequests], x => x), () => 0)

  // Spread the default support values, and override the defaults with any preexisting. 
  // All months need to have all support request types, even if 0, in order to work in graph. 
  const paddedData = map(dataSorted, x => ({
    ...defaultSupportValues,
    ...x
  }))

  return {
    typesOfSupportRequests: [...typesOfSupportRequests], // Converting from set to array
    data: paddedData
  }
}

const prepareDataForComposedChartByDay = (rawData, dateFilter, filterStartDate = null, filterEndDate = null) => {
  const data = fillMissingData(rawData, dateFilter, filterStartDate, filterEndDate)
  const typesOfSupportRequests = new Set()
  const mappedData = map(data, day => ({
    id: day.id,
    numConversations: day.numConversations,
    numConversationsWithDuration: day.numConversationsWithDuration,
    // Add each type of support ticket as a piece of data at root level for use by line chart. 
    ...(reduce(day.supportRequests, function (result, supportRequest) {
      // Add to collection of types of support requests
      typesOfSupportRequests.add(supportRequest.name)

      // Add to reducer object
      result[supportRequest.name] = !!supportRequest.occurrences ? supportRequest.occurrences : 0
      return result;
    }, {}))
  }))

  return sortAndFillSupportRequestBlanks(mappedData, typesOfSupportRequests)
}

const prepareDataForComposedChartByMonth = (data) => {
  // We need to know how many different types of support requests were submitted so the line graph can be dynamic and future proof.
  const typesOfSupportRequests = new Set()

  const dataByMonth = reduce(data, function (result, day) {
    // Create an object where each key is the year and month eg '2020-1'
    const key = `${new Date(day.id).getFullYear()}-${new Date(day.id).getMonth() + 1}`

    // Create this property (year and month) if it doesn't exist yet
    if (!result[key]) {
      result[key] = {
        id: key
      }
    }

    const monthNumConversations = !!result[key].numConversations ? result[key].numConversations : 0
    const dayNumConversations = !!day.numConversations ? day.numConversations : 0

    const monthNumConversationsWithDuration = !!result[key].numConversationsWithDuration ? result[key].numConversationsWithDuration : 0
    const dayNumConversationsWithDuration = !!day.numConversationsWithDuration ? day.numConversationsWithDuration : 0

    // Add the metrics of that day to the overall month
    result[key].numConversations = monthNumConversations + dayNumConversations
    result[key].numConversationsWithDuration = monthNumConversationsWithDuration + dayNumConversationsWithDuration

    // Add the support request metrics of that day to the overall month
    if (!!day.supportRequests) {
      day.supportRequests.forEach(x => {
        // Add to collection of types of support requests
        typesOfSupportRequests.add(x.name)

        result[key][x.name] = (result[key][x.name] ? result[key][x.name] : 0) + x.occurrences
      })
    }

    return result;
  }, {})

  return sortAndFillSupportRequestBlanks(dataByMonth, typesOfSupportRequests)
}

const prepareDataForComposedChart = (data, dateFilter, filterStartDate, filterEndDate) => {
  if (dateFilter === 'Last 12 months') {
    return prepareDataForComposedChartByMonth(data)
  } else {
    return prepareDataForComposedChartByDay(data, dateFilter, filterStartDate, filterEndDate)
  }
}

export default prepareDataForComposedChart