import {removeStyle} from './utils';

export default function(tableDiv) {
  tableDiv.removeAttribute('class');
  var children = tableDiv.children;
  for (var i = 0; i < children.length; ++i) {
    children[i].removeAttribute('class');
  }

  var header = children[0];
  var headerChildren = header.children;
  for (var j = 0; j < headerChildren.length; ++j) {
    headerChildren[j].removeAttribute('class');
  }

  var table = children[1];
  var thead = table.children[0];
  thead.removeAttribute('class');
  thead.children[0].removeAttribute('class');
  var theadCells = thead.children[0].children;
  for (var k = 0; k < theadCells.length; ++k) {
    theadCells[k].removeAttribute('class');
  }

  var sorts = tableDiv.querySelectorAll('.' + this.sortClass);
  for (var l = 0; l < sorts.length; ++l) {
    sorts[l].innerHTML = '';
    sorts[l].setAttribute('class', this.sortClass);
    if (sorts[l].parentElement.cellIndex === this.sortColumn) {
      sorts[l].innerHTML = '&#9650;';
      if (this.sortOrder.toLowerCase().substr(0, 4) == 'desc') {
        sorts[l].innerHTML = '&#9660;';
      }
    }
  }

  var tbody = table.children[1];
  tbody.removeAttribute('class');

  var footer = children[2];
  var footerChildren = footer.children;
  var leftChildren = footerChildren[0].children;
  for (var m = 0; m < leftChildren.length; ++m) {
    leftChildren[m].removeAttribute('class');
  }

  var right = footer.querySelector('#' + this.id + '_page_prev').parentElement;
  footer.replaceChild(this.BuildPager(), right);

  //basically, don't remove style from tfoot, in case user added it
  tableDiv.removeAttribute('style');
  removeStyle(children[0]);
  children[1].removeAttribute('style');
  removeStyle(children[2]);
  removeStyle(thead);
  removeStyle(tbody);
}
