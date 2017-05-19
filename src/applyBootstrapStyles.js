import {removeStyle} from './utils';

export default function(tableDiv) {
  if (!tableDiv) {
    return false;
  }

  var span = document.createElement('span');
  var header = tableDiv.querySelector('#' + this.id + '_header');
  var footer = tableDiv.querySelector('#' + this.id + '_footer');
  var table = tableDiv.querySelector('table');
  table.setAttribute('class', 'table table-bordered table-striped');
  table.setAttribute('style', 'width: 100%; margin-bottom: 0;');
  header.setAttribute('class', 'panel-heading');
  footer.setAttribute('class', 'panel-footer');
  tableDiv.setAttribute('class', 'panel panel-info');
  tableDiv.setAttribute('style', 'margin-bottom: 0;');

  var tableRows = table.querySelectorAll('tbody tr');
  for (var i = 0; i < tableRows.length; ++i) { //remove manual striping
    tableRows[i].removeAttribute('style');
  }

  var headCells = table.querySelectorAll('th');
  for (var j = 0; j < headCells.length; ++j) {
    var sort = headCells[j].querySelector('.' + this.sortClass);
    if (sort) {
      if (sort.innerText.charCodeAt(0) == 9660) {
        sort.setAttribute('class', this.sortClass +
          ' glyphicon glyphicon-chevron-down');
      } else if (sort.innerText.charCodeAt(0) == 9650) {
        sort.setAttribute('class', this.sortClass +
          ' glyphicon glyphicon-chevron-up');
      }

      sort.innerHTML = '';
    }
  }

  var pageClass = 'btn btn-default ' + this.pagerButtonsClass;
  var pageLeft = footer.querySelector('#' + this.id + '_page_prev');
  var pageRight = footer.querySelector('#' + this.id + '_page_next');
  var pageParent = pageLeft.parentElement;

  var pagerItems = footer.querySelectorAll('li');
  for (var k = 0; k < pagerItems.length; ++k) {
    removeStyle(pagerItems[k]);
  }

  pageParent.setAttribute('class', 'btn-group');

  pageLeft.innerHTML = '';
  var pageLeftSpan = span.cloneNode(false);
  pageLeftSpan.setAttribute('class', 'glyphicon glyphicon-arrow-left');
  pageLeft.appendChild(pageLeftSpan);

  pageRight.innerHTML = '';
  var pageRightSpan = span.cloneNode(false);
  pageRightSpan.setAttribute('class', 'glyphicon glyphicon-arrow-right');
  pageRight.appendChild(pageRightSpan);

  if (this.pagerIncludeFirstAndLast) {
    var pageFirst = footer.querySelector('#' + this.id + '_page_first');
    var pageLast = footer.querySelector('#' + this.id + '_page_last');
    pageFirst.innerHTML = '';
    var pageFirstSpan = span.cloneNode(false);
    pageFirstSpan.setAttribute('class', 'glyphicon glyphicon-fast-backward');
    pageFirst.appendChild(pageFirstSpan);
    pageLast.innerHTML = '';
    var pageLastSpan = span.cloneNode(false);
    pageLastSpan.setAttribute('class', 'glyphicon glyphicon-fast-forward');
    pageLast.appendChild(pageLastSpan);
  }

  var pageButtons = footer.querySelectorAll('.' + this.pagerButtonsClass);
  for (var l = 0; l < pageButtons.length; ++l) {
    pageButtons[l].setAttribute('class', pageClass);
  }
}
