export default function(body) {
  if (!body) {
    body = document.getElementById(this.id + '_body');
    if (!body) {
      return false;
    }
  }

  var tempBody = body.cloneNode(false);
  while (tempBody.firstChild) {
    tempBody.removeChild(tempBody.firstChild);
  }

  // var displayedRows = [];
  var row = document.createElement('tr');
  var cell = document.createElement('td');
  //get the display start id
  var pageDisplay = this.pageNumber * this.pageSize;
  if (this.VisibleRowCount() <= pageDisplay) {
    //if this is too big, go back to page 1
    this.pageNumber = 0;
    pageDisplay = 0;
  }

  //get the display end id
  var length = pageDisplay + this.pageSize;
  if (pageDisplay + this.pageSize >= this.VisibleRowCount()) {
    //if this is too big, only show remaining rows
    length = this.VisibleRowCount();
  }

  //loop through the visible rows and display this page
  for (var i = pageDisplay; i < length; ++i) {
    var tempRow = row.cloneNode(false);
    if (i % 2 === 0) {
      tempRow.setAttribute('class', this.evenRowClass);
    } else {
      tempRow.setAttribute('class', this.oddRowClass);
    }

    for (var j = 0; j < this.visibleRows[i].length; ++j) {
      var tempCell = cell.cloneNode(false);
      var text = this.visibleRows[i][j];
      if (this.columnData[j].CustomRendering !== null) {
        text = this.columnData[j].CustomRendering(text,
          this.visibleRowObjects[i].RowNumber);
      }
      tempCell.innerHTML = text;
      tempRow.appendChild(tempCell);
    }

    tempBody.appendChild(tempRow);
  }

  if (body.parentElement) {
    body.parentElement.replaceChild(tempBody, body);
  }

  body = tempBody;

  var footer = document.getElementById(this.id + '_footer');
  this.UpdateFooter(footer);
  return body;
}
