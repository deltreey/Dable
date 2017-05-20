import {bind} from './utils';

export default function() {
  this.pageNumber = this.NumberOfPages() - 1;
  //page number is 0 based
  if (this.async &&
      (this.asyncStart > this.pageNumber * this.pageSize ||
        this.pageNumber * this.pageSize >
        this.asyncStart + this.asyncLength)) {
    var newStart = 0;
    var pages = 1000 / this.pageSize - 1;
    //-1 for the page number and -1 to include current page
    if (this.pageNumber - pages > -1) {
      newStart = (this.pageNumber - pages) * this.pageSize;
    }

    var ascending = true;
    if (this.sortOrder.length > 3 &&
        this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
      ascending = false;
    }

    this.asyncRequest(newStart, this.currentFilter, this.sortColumn, ascending,
      bind(function(error) {
        if (error) {throw error;}
        this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
        this.UpdateStyle();
      }, this));
  } else {
    this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
    this.UpdateStyle();
  }
}
