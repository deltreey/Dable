import {doSearch} from './utils';

export default function(tableDiv) {
  if (!tableDiv) {
    return false;
  }
  var div = document.createElement('div');
  var span = document.createElement('span');
  var select = document.createElement('select');
  var option = document.createElement('option');
  var input = document.createElement('input');

  var left = div.cloneNode(false);
  var show = span.cloneNode(false);
  show.innerHTML = 'Show ';
  left.appendChild(show);
  var entryCount = select.cloneNode(false);
  for (var i = 0; i < this.pageSizes.length; ++i) {
    var tempOption = option.cloneNode(false);
    tempOption.innerHTML = this.pageSizes[i];
    tempOption.setAttribute('value', this.pageSizes[i]);
    entryCount.appendChild(tempOption);
  }

  var dable = this;
  entryCount.onchange = function() {
    var entCnt = this;
    var value = entCnt.value;
    dable.pageSize = parseInt(value, 10);
    dable.UpdateDisplayedRows(document.getElementById(dable.id + '_body'));
    dable.UpdateStyle(tableDiv);
  };

  var options = entryCount.querySelectorAll('option');
  for (var j = 0; j < options.length; ++j) {
    if (options[j].value == dable.pageSize) {
      options[j].selected = true;
      break;
    }
  }

  left.appendChild(entryCount);

  var right = div.cloneNode(false);
  var search = span.cloneNode(false);
  search.innerHTML = 'Search ';
  right.appendChild(search);
  var inputSearch = input.cloneNode(false);
  inputSearch.setAttribute('id', this.id + '_search');
  inputSearch.onkeyup = doSearch(this);
  right.appendChild(inputSearch);

  var clear = div.cloneNode(false);

  var head = div.cloneNode(false);
  head.id = this.id + '_header';
  head.appendChild(left);
  head.appendChild(right);
  head.appendChild(clear);

  return head;
}
