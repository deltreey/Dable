import {bind} from './utils';

export default function(page) {
  this.pageNumber = page;
  if (this.async &&
      (this.asyncStart > this.pageNumber * this.pageSize ||
        this.pageNumber * this.pageSize >=
        this.asyncStart + this.asyncLength)) {
    var newStart = this.pageNumber * this.pageSize;
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
