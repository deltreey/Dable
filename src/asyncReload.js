import {bind} from './utils';

export default function(callback) {
  if (!callback) {
    callback = bind(function(error) {
      if (error) {
        throw error;
      } else {
        this.UpdateDisplayedRows();
        this.UpdateStyle();
      }
    }, this);
  }

  var ascending = true;
  if (this.sortOrder.length > 3 &&
      this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
    ascending = false;
  }

  this.asyncRequest(this.asyncStart, this.currentFilter, this.sortColumn,
    ascending, callback);
}
