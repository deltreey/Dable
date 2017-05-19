import {doSort} from './utils';

export default function(tableDiv) {
  if (!tableDiv) {
    return false;
  }

  //all the elements we need to build a neat table
  var table = document.createElement('table');
  var head = document.createElement('thead');
  var headCell = document.createElement('th');
  var body = document.createElement('tbody');
  var row = document.createElement('tr');
  var span = document.createElement('span');
  //The thead section contains the column names
  var headRow = row.cloneNode(false);
  for (var i = 0; i < this.columnData.length; ++i) {
    var tempCell = headCell.cloneNode(false);
    var nameSpan = span.cloneNode(false);
    nameSpan.innerHTML = this.columnData[i].FriendlyName + ' ';
    tempCell.appendChild(nameSpan);

    if (this.columnData[i].CustomSortFunc !== false) {
      var sortSpan = span.cloneNode(false);
      sortSpan.setAttribute('class', this.sortClass);
      sortSpan.innerHTML = 'v';
      tempCell.appendChild(sortSpan);
      tempCell.onclick = doSort(this);
    }

    var clear = span.cloneNode(false);
    tempCell.appendChild(clear);

    tempCell.setAttribute('data-tag', this.columnData[i].Tag);
    headRow.appendChild(tempCell);
  }
  head.appendChild(headRow);
  table.appendChild(head);

  this.visibleRows = this.rows.slice(0);
  this.visibleRowObjects = this.rowObjects.slice(0);
  body = this.UpdateDisplayedRows(body);
  body.id = this.id + '_body';
  table.appendChild(body);
  if (this.tfoothtml) {
    var foot = document.createElement('tfoot');
    foot.innerHTML = this.tfoothtml;
    table.appendChild(foot);
  }

  return table;
}
