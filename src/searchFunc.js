import {arrayContains, bind} from './utils';

export default function(searchBox) {
  if (searchBox.id != this.id + '_search') {
    return false;
  }

  if (!searchBox.value || searchBox.value.length < this.minimumSearchLength) {
    this.currentFilter = '';
  } else {
    var searchText = searchBox.value;
    this.currentFilter = searchText;
  }

  if (this.async) {
    var ascending = true;
    if (this.sortOrder.length > 3 &&
        this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
      ascending = false;
    }
    this.asyncRequest(0, this.currentFilter, this.sortColumn, ascending,
      bind(function(error) {
        if (error) {throw error;}
        var body = document.getElementById(this.id + '_body');
        this.UpdateDisplayedRows(body);
        this.UpdateStyle(document.getElementById(this.id));
      }, this));
  } else {
    var includedRows = [];
    var includedRowObjects = [];
    if (this.currentFilter) {
      for (var i = 0; i < this.filters.length; ++i) {
        for (var j = 0; j < this.rows.length; ++j) {
          if (arrayContains(includedRows, this.rows[j])) {
            continue;
          }

          for (var k = 0; k < this.rows[j].length; ++k) {
            if (this.filters[i](this.currentFilter, this.rows[j][k])) {
              includedRows.push(this.rows[j]);
              includedRowObjects.push(this.rowObjects[j]);
              break;
            }
          }
        }
      }
    } else {
      includedRows = this.rows;
      includedRowObjects = this.rowObjects;
    }

    this.visibleRows = includedRows;
    this.visibleRowObjects = includedRowObjects;
    var body = document.getElementById(this.id + '_body');
    this.UpdateDisplayedRows(body);
    this.UpdateStyle(document.getElementById(this.id));
  }
}
