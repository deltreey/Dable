export default function(start, filter, sortColumn, ascending, callback) { //callback if async
  var dable = this;
  if (typeof callback === 'undefined') {
    callback = false;
  }

  var dableRequest = new XMLHttpRequest();
  dableRequest.onreadystatechange = function() {
    if (dableRequest.readyState == 4 && dableRequest.status == 200) {
      var data = JSON.parse(dableRequest.responseText);
      var actualData = data;
      if (data.rows === undefined) {
        actualData = JSON.parse(data.d);
      }

      var actualRows = actualData.rows;
      if (actualRows === undefined) { //need rows in return data
        console.error('Error, no rows in data from source');
        if (callback) {
          return callback('Error, no rows in data from source');
        }

        return;
      } else if (actualData.includedRowCount === undefined) { //need filtered row count in data
        console.error('Error, no includedRowCount in data from source');
        if (callback) {
          return callback('Error, no includedRowCount in data from source');
        }

        return;
      } else if (actualData.rowCount === undefined) { //need filtered row count in data
        console.error('Error, no rowCount in data from source');
        if (callback) {
          return callback('Error, no rowCount in data from source');
        }

        return;
      }

      //create empty rows for the rest of the set
      actualRows.reverse();
      for (var i = 0; i < start; ++i) {
        actualRows.push([]);
      }

      actualRows.reverse();
      for (var j = start + dable.asyncLength;
          j < actualData.includedRowCount; ++j) {
        actualRows.push([]);
      }

      //update
      dable.SetDataAsRows(actualRows);
      this.RowCount = function() {return actualData.rowCount;};
      this.VisibleRowCount = function() {
        return actualData.includedRowCount;
      };

      if (callback !== false &&
          Boolean(callback && callback.call && callback.apply)) {
        callback();
      }
    }
  };

  dableRequest.open('POST', this.async, callback !== false);
  dableRequest.setRequestHeader('content-type', 'application/json');
  var requestObject = JSON.parse(JSON.stringify(this.asyncData));
  requestObject.start = start;
  this.asyncStart = start;
  requestObject.count = this.asyncLength;
  requestObject.filter = filter;
  requestObject.sortColumn = sortColumn === null ? -1 : sortColumn;
  requestObject.ascending = ascending;
  dableRequest.send(JSON.stringify(requestObject));
}
