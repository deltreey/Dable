export default function(tableDiv) {
  if (this.dableClass) {
    tableDiv.setAttribute('class', this.dableClass);
  }

  var table = tableDiv.querySelector('table');
  table.setAttribute('style', 'width: 100%;');
  if (this.tableClass) {
    table.setAttribute('class', this.tableClass);
  }

  var oddRows = tableDiv.querySelectorAll('.' + this.oddRowClass);
  for (var i = 0; i < oddRows.length; ++i) {
    oddRows[i].setAttribute('style', 'background-color: ' + this.oddRowColor);
  }

  var evenRows = tableDiv.querySelectorAll('.' + this.evenRowClass);
  for (var j = 0; j < evenRows.length; ++j) {
    evenRows[j].setAttribute('style', 'background-color: ' + this.evenRowColor);
  }
  var cells = tableDiv.querySelectorAll('tbody td');
  for (var k = 0; k < cells.length; ++k) {
    cells[k].setAttribute('style', 'padding: 5px;');
  }

  var headCellClear;
  var headCells = tableDiv.querySelectorAll('th');
  for (var l = 0; l < headCells.length; ++l) {
    headCells[l].setAttribute('style', 'padding: 5px;');
    var headCellLeft = headCells[l].children[0];
    headCellLeft.setAttribute('style', 'float: left');
    if (this.columnData[l].CustomSortFunc !== false) {
      var headCellRight = headCells[l].children[1];
      headCellRight.setAttribute('style', 'float: right');
      headCellClear = headCells[l].children[2];
      headCellClear.setAttribute('style', 'clear: both;');

      headCells[l].onmouseover = function() {
        this.setAttribute('style', 'padding: 5px; cursor: pointer');
      };
      headCells[l].onmouseout = function() {
        this.setAttribute('style', 'padding: 5px; cursor: default');
      };
    } else {
      headCellClear = headCells[l].children[1];
      headCellClear.setAttribute('style', 'clear: both;');
    }
  }

  var header = tableDiv.querySelector('#' + this.id + '_header');
  header.setAttribute('style', 'padding: 5px;');
  if (this.headerClass) {
    header.setAttribute('class', this.headerClass);
  }

  var headLeft = header.children[0];
  headLeft.setAttribute('style', 'float: left;');
  var headRight = header.children[1];
  headRight.setAttribute('style', 'float: right;');
  var headClear = header.children[2];
  headClear.setAttribute('style', 'clear: both;');

  var footer = tableDiv.querySelector('#' + this.id + '_footer');
  footer.setAttribute('style', 'padding: 5px;');
  if (this.footerClass) {
    footer.setAttribute('class', this.footerClass);
  }

  var footLeft = footer.children[0];
  footLeft.setAttribute('style', 'float: left;');
  var footClear = footer.children[2];
  footClear.setAttribute('style', 'clear: both;');
  var footRight = footer.children[1];
  footRight.setAttribute('style', 'float: right; list-style: none;');
  var footRightItems = footRight.querySelectorAll('li');
  for (var m = 0; m < footRightItems.length; ++m) {
    footRightItems[m].setAttribute('style',
      'display: inline; margin-right: 5px;');
  }
}
