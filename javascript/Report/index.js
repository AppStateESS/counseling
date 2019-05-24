'use strict'
import datepicker from 'js-datepicker'
import 'js-datepicker/dist/datepicker.min.css'

/* global $, reportType, startDate, endDate, endStr, startStr */

const selectDate = function (e) {
  const ds = e.dateSelected
  const yearStr = ds.getFullYear().toString()
  const month = ds.getMonth() + 1
  let monthStr = month.toString()
  if (month < 10) {
    monthStr = '0' + monthStr
  }
  const day = ds.getDate()
  let dayStr = day.toString()
  if (day < 10) {
    dayStr = '0' + dayStr
  }

  const datestamp = yearStr + monthStr + dayStr
  return datestamp
}

if ($('#pick-date').length > 0) {
  datepicker('#pick-date', {
    dateSelected: new Date(startDate.year, startDate.month, startDate.day),
    onSelect: (e) => {
      const datestamp = selectDate(e)
      window.location.href = 'counseling/Admin/Report/' + reportType + '/' +
          datestamp
    }
  })
}

if ($('#pick-start-date').length > 0) {
  datepicker('#pick-start-date', {
    dateSelected: new Date(startDate.year, startDate.month, startDate.day),
    onSelect: (e) => {
      const datestamp = selectDate(e)
      window.location.href = 'counseling/Admin/Report/Interval/' + datestamp + '/' +
          endStr
    }
  })

  datepicker('#pick-end-date', {
    dateSelected: new Date(endDate.year, endDate.month, endDate.day),
    onSelect: (e) => {
      const datestamp = selectDate(e)
      window.location.href = 'counseling/Admin/Report/Interval/' + startStr + '/' +
          datestamp
    }
  })
}
