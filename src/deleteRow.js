import {triggerKeyup} from './utils';

export default function(rowNumber) {
  for (var i = 0; i < this.rowObjects.length; ++i) {
    if (this.rowObjects[i].RowNumber == rowNumber) {
      this.rowObjects.splice(i, 1);
      this.rows = this.CreateRowsFromObjects(this.rowObjects);
      break;
    }
  }

  for (var j = 0; j < this.visibleRowObjects.length; ++j) {
    if (this.visibleRowObjects[j].RowNumber == rowNumber) {
      this.visibleRowObjects.splice(j, 1);
      this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
    }
  }

  triggerKeyup(document.querySelector('#' + this.id + '_search'));
}
