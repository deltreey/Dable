import {removeStyle} from './utils';

export default function(tableDiv) {
  if (!tableDiv) {
    return false;
  }

  var header = tableDiv.querySelector('#' + this.id + '_header');
  var footer = tableDiv.querySelector('#' + this.id + '_footer');
  var span = document.createElement('span');
  header.setAttribute('class', 'fg-toolbar ui-widget-header ' +
    'ui-corner-tl ui-corner-tr ui-helper-clearfix');

  var headCells = tableDiv.querySelectorAll('th');
  for (var i = 0; i < headCells.length; ++i) {
    headCells[i].setAttribute('class', 'ui-state-default');
    var sort = headCells[i].querySelector('.' + this.sortClass);
    if (sort) {
      if (sort.innerText.charCodeAt(0) == 9660) {
        sort.setAttribute('class', this.sortClass +
          ' ui-icon ui-icon-triangle-1-s');
      } else if (sort.innerText.charCodeAt(0) == 9650) {
        sort.setAttribute('class', this.sortClass +
          ' ui-icon ui-icon-triangle-1-n');
      }

      sort.innerHTML = '';
    }
  }

  var pagerItems = footer.querySelectorAll('li');
  for (var j = 0; j < pagerItems.length; ++j) {
    removeStyle(pagerItems[j]);
  }

  footer.setAttribute('class', 'fg-toolbar ui-widget-header ' +
    'ui-corner-bl ui-corner-br ui-helper-clearfix');
  var pageClass = 'fg-button ui-button ui-state-default ui-corner-left ' +
    this.pagerButtonsClass;

  var pageButtons = footer.querySelectorAll('.' + this.pagerButtonsClass);
  for (var k = 0; k < pageButtons.length; ++k) {
    pageButtons[k].setAttribute('class', pageClass);
  }

  var pageLeft = footer.querySelector('#' + this.id + '_page_prev');
  pageLeft.innerHTML = '';
  var pageLeftSpan = span.cloneNode(false);
  pageLeftSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-w');
  pageLeft.appendChild(pageLeftSpan);
  if (pageLeft.getAttribute('disabled')) {
    pageLeft.setAttribute('class', pageClass + ' ui-state-disabled');
  }

  var pageRight = footer.querySelector('#' + this.id + '_page_next');
  pageRight.innerHTML = '';
  var pageRightSpan = span.cloneNode(false);
  pageRightSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-e');
  pageRight.appendChild(pageRightSpan);
  if (pageRight.getAttribute('disabled')) {
    pageRight.setAttribute('class', pageClass + ' ui-state-disabled');
  }

  if (this.pagerIncludeFirstAndLast) {
    var pageFirst = footer.querySelector('#' + this.id + '_page_first');
    var pageLast = footer.querySelector('#' + this.id + '_page_last');
    pageFirst.innerHTML = '';
    var pageFirstSpan = span.cloneNode(false);
    pageFirstSpan.setAttribute('class', 'ui-icon ui-icon-arrowthickstop-1-w');
    pageFirst.appendChild(pageFirstSpan);
    pageLast.innerHTML = '';
    var pageLastSpan = span.cloneNode(false);
    pageLastSpan.setAttribute('class', 'ui-icon ui-icon-arrowthickstop-1-e');
    pageLast.appendChild(pageLastSpan);
  }
}
