export default function(columns) {
  if (!columns) {
    return false;
  }

  var tableRows = [];
  for (var i = 0; i < columns.length; ++i) {
    while (tableRows.length < columns[i].length) {
      tableRows.push([]);
    }

    for (var j = 0; j < columns[i].length; ++j) {
      tableRows[j][i] = columns[i][j];
    }
  }

  this.columns = columns;
  this.rows = tableRows;
  this.rowObjects = this.CreateObjectsFromRows(tableRows);
  this.visibleRows = this.rows.slice(0);
  this.visibleRowObjects = this.rowObjects.slice(0);
}
