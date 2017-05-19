export default function(tableNode) {
  if (!tableNode) {
    console.error('Dable Error: No HTML table to generate dable from');
    return false;
  }

  if (tableNode.hasAttribute('class')) {
    this.tableClass = tableNode.getAttribute('class');
  }

  var thead = tableNode.querySelector('thead');
  if (!thead) {
    console.error('Dable Error: No thead element in table');
    return false;
  }

  var headers = thead.querySelectorAll('tr th');
  var tfoot = tableNode.querySelector('tfoot');
  if (tfoot) {
    this.tfoothtml = tfoot.innerHTML;
  }

  var colNames = [];
  for (var i = 0; i < headers.length; ++i) { //add our column names
    colNames.push(headers[i].innerHTML);
  }

  this.SetColumnNames(colNames);

  var rowsHtml = tableNode.querySelector('tbody').rows;
  var allRows = [];
  if (rowsHtml.length > 1 && rowsHtml[0].hasAttribute('class') &&
      rowsHtml[1].hasAttribute('class')) {
    this.evenRowClass = rowsHtml[0].getAttribute('class');
    this.oddRowClass = rowsHtml[1].getAttribute('class');
  }

  for (var j = 0; j < rowsHtml.length; ++j) {
    allRows.push([]);
    var rowCells = rowsHtml[j].children;
    for (var k = 0; k < rowCells.length; ++k) {
      allRows[j].push(rowCells[k].innerHTML);
    }
  }

  this.SetDataAsRows(allRows);

  var parentDiv = tableNode.parentElement;
  parentDiv.innerHTML = '';

  return parentDiv.id;
}
