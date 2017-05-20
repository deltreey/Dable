import {triggerKeyup} from './utils';

export default function(row) {
  var rowNumber;
  if (this.rowObjects.length === 0) {
    rowNumber = 0;
  } else {
    rowNumber = this.rowObjects[this.rowObjects.length - 1].RowNumber + 1;
  }
  this.rows.push(row);
  this.rowObjects.push({Row: row, RowNumber: rowNumber});
  triggerKeyup(document.querySelector('#' + this.id + '_search'));
}
