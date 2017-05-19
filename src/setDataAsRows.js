export default function(rows) {
  if (!rows) {
    return false;
  }

  var tableColumns = [];
  for (var i = 0; i < rows.length; ++i) {
    while (tableColumns.length < rows[i].length) {
      tableColumns.push([]);
    }

    for (var j = 0; j < rows[i].length; ++j) {
      tableColumns[j][i] = rows[i][j];
    }
  }

  this.columns = tableColumns;
  this.rows = rows;
  this.rowObjects = this.CreateObjectsFromRows(rows);
  this.visibleRows = rows.slice(0);
  this.visibleRowObjects = this.rowObjects.slice(0);
}
