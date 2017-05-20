import {bind} from './utils';

export default function(tableInput) {
  var tableId = this.CheckForTable(tableInput);
  if (!tableId) {
    return false;
  }

  var tableDiv = document.getElementById(tableId);
  if (!tableDiv) {
    return false;
  }

  if (this.async) {
    this.asyncRequest(0, '', -1, true, bind(function(error) {
      if (error) {throw error;}
      tableDiv.innerHTML = '';

      var header = this.BuildHeader(tableDiv);
      var table = this.BuildTable(tableDiv);
      var footer = this.BuildFooter(tableDiv);
      tableDiv.appendChild(header);
      tableDiv.appendChild(table);
      tableDiv.appendChild(footer);

      this.UpdateStyle(tableDiv);
    }, this));
  } else {
    tableDiv.innerHTML = '';

    var header = this.BuildHeader(tableDiv);
    var table = this.BuildTable(tableDiv);
    var footer = this.BuildFooter(tableDiv);
    tableDiv.appendChild(header);
    tableDiv.appendChild(table);
    tableDiv.appendChild(footer);

    this.UpdateStyle(tableDiv);
  }
}
