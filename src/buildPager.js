import {bind, noop} from './utils';

export default function() {
  var ul = document.createElement('ul');
  var li = document.createElement('li');
  var anchor = document.createElement('a');
  var right = ul.cloneNode(false);
  if (this.pagerIncludeFirstAndLast) {
    var pageFirst = li.cloneNode(false);
    var pageFirstAnchor = anchor.cloneNode(false);
    pageFirstAnchor.innerHTML = 'First';
    pageFirst.setAttribute('class', this.pagerButtonsClass);
    pageFirst.id = this.id + '_page_first';
    pageFirst.onclick = bind(this.FirstPage, this);
    if (this.pageNumber <= 0) {
      pageFirst.setAttribute('disabled', 'disabled');
      pageFirst.onclick = noop; //disable onclick
    }

    pageFirst.appendChild(pageFirstAnchor);
    right.appendChild(pageFirst);
  }

  var pageLeft = li.cloneNode(false);
  var pageLeftAnchor = anchor.cloneNode(false);
  pageLeftAnchor.innerHTML = 'Prev';
  pageLeft.setAttribute('class', this.pagerButtonsClass);
  pageLeft.id = this.id + '_page_prev';
  pageLeft.onclick = bind(this.PreviousPage, this);
  if (this.pageNumber <= 0) {
    pageLeft.setAttribute('disabled', 'disabled');
    pageLeft.onclick = noop;  //disable onclick
  }

  pageLeft.appendChild(pageLeftAnchor);
  right.appendChild(pageLeft);

  if (this.pagerSize > 0) {
    var start = this.pageNumber - parseInt(this.pagerSize / 2, 10);
    var length = start + this.pagerSize;
    if (this.pageNumber <= this.pagerSize / 2) {
      // display from beginning
      length = this.pagerSize;
      start = 0;
      if (length > this.NumberOfPages()) {
        length = this.NumberOfPages();
      } //very small tables
    } else if (this.NumberOfPages() - this.pageNumber <= this.pagerSize / 2) {
      //display the last five pages
      length = this.NumberOfPages();
      start = this.NumberOfPages() - this.pagerSize;
    }

    for (var i = start; i < length; ++i) {
      var liNode = li.cloneNode(false);
      var liNodeAnchor = anchor.cloneNode(false);
      liNodeAnchor.innerHTML = (i + 1).toString();
      liNode.onclick = bind(this.GoToPage, this, i);
      liNode.setAttribute('class', this.pagerButtonsClass);
      if (i == this.pageNumber) {
        liNode.setAttribute('disabled', 'disabled');
        liNode.onclick = noop; //disable onclick
      }

      liNode.appendChild(liNodeAnchor);
      right.appendChild(liNode);
    }
  }

  var pageRight = li.cloneNode(false);
  var pageRightAnchor = anchor.cloneNode(false);
  pageRightAnchor.innerHTML = 'Next';
  pageRight.setAttribute('class', this.pagerButtonsClass);
  pageRight.id = this.id + '_page_next';
  pageRight.onclick = bind(this.NextPage, this);
  if (this.NumberOfPages() - 1 == this.pageNumber) {
    pageRight.setAttribute('disabled', 'disabled');
    pageRight.onclick = noop; //disable onclick
  }

  pageRight.appendChild(pageRightAnchor);
  right.appendChild(pageRight);

  if (this.pagerIncludeFirstAndLast) {
    var pageLast = li.cloneNode(false);
    var pageLastAnchor = anchor.cloneNode(false);
    pageLastAnchor.innerHTML = 'Last';
    pageLast.setAttribute('class', this.pagerButtonsClass);
    pageLast.id = this.id + '_page_last';
    pageLast.onclick = bind(this.LastPage, this);
    if (this.NumberOfPages() - 1 == this.pageNumber) {
      pageLast.setAttribute('disabled', 'disabled');
      pageLast.onclick = noop;  //disable onclick
    }

    pageLast.appendChild(pageLastAnchor);
    right.appendChild(pageLast);
  }

  return right;
}
