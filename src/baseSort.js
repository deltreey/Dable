export default function(columnIndex, ascending, currentRowObjects) {
  var isInt = true;
  var isDate = true;
  var newRowObjects = currentRowObjects.slice(0);
  for (var i = 0; i < currentRowObjects.length; ++i) {
    //simple 2/21/2010 style dates parse cleanly to int, so we can drop out
    //if this won't parse
    if (parseInt(currentRowObjects[i].Row[columnIndex], 10).toString()
        .toLowerCase() == 'nan') {
      isInt = false;
    }
    //check for dates
    var dateString = currentRowObjects[i].Row[columnIndex].toString();
    var splitDate = dateString.split('/');
    if (splitDate.length != 3 ||
        (splitDate[0].length < 1 || splitDate[0].length > 2) ||
        (splitDate[1].length < 1 || splitDate[1].length > 2) ||
        splitDate[2].length != 2 && splitDate[2].length != 4) {
      isDate = false;
    }
  }

  if (isDate) {
    newRowObjects = newRowObjects.sort(function(a, b) {
      //default to US Date schema
      var splitDateA = a.Row[columnIndex].split('/');
      var yearA = splitDateA[2].toString();
      var monthA = splitDateA[0].toString();
      var dayA = splitDateA[1].toString();
      if (yearA.length == 2) {
        yearA = '20' + yearA;
        //don't guess, let them use 4 digits if they want 19xx
      }
      if (monthA.length == 1) {
        monthA = '0' + monthA;
      }
      if (dayA.length == 1) {
        dayA = '0' + dayA;
      }
      var yearMonthDayA = yearA + monthA + dayA;
      var splitDateB = b.Row[columnIndex].split('/');
      var yearB = splitDateB[2].toString();
      var monthB = splitDateB[0].toString();
      var dayB = splitDateB[1].toString();
      if (yearB.length == 2) {
        yearB = '20' + yearB;
        //don't guess, let them use 4 digits if they want 19xx
      }
      if (monthB.length == 1) {
        monthB = '0' + monthB;
      }
      if (dayB.length == 1) {
        dayB = '0' + dayB;
      }
      var yearMonthDayB = yearB + monthB + dayB;
      return parseInt(yearMonthDayA, 10) - parseInt(yearMonthDayB, 10);
    });
  } else if (isInt) {
    newRowObjects = newRowObjects.sort(function(a, b) {
      return parseInt(a.Row[columnIndex], 10) -
        parseInt(b.Row[columnIndex], 10);
    });
  } else {
    newRowObjects = newRowObjects.sort(function(a, b) {
      if (a.Row[columnIndex] > b.Row[columnIndex]) {
        return 1;
      } else if (a.Row[columnIndex] < b.Row[columnIndex]) {
        return -1;
      }
      return 0;
    });
  }

  if (!ascending) {
    newRowObjects = newRowObjects.reverse();
  }

  return newRowObjects;
}
