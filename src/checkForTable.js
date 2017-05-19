export default function(input) { //Check for existing table
  if (input) {
    if (input.nodeType && input.nodeName.toLowerCase() == 'div') {
      if (input.hasAttribute('id')) {
        this.id = input.getAttribute('id');
      } else {
        this.id = 'Dable1';
        input.setAttribute('id', 'Dable1');
      }
    } else if (window.jQuery && input instanceof jQuery && input[0].nodeType) {
      //jquery object
      if (input[0].hasAttribute('id')) {
        this.id = input[0].getAttribute('id');
      } else {
        this.id = 'Dable1';
        input[0].setAttribute('id', 'Dable1');
      }
    } else {
      this.id = input.toString();
    }

    var tableDiv = document.getElementById(this.id);
    if (tableDiv && this.rows && this.rows.length < 1) {
      var table = tableDiv.querySelector('table');
      if (table) {
        if (tableDiv.hasAttribute('class')) {
          this.dableClass = tableDiv.getAttribute('class');
        }

        var newTable = this.GenerateTableFromHtml(table);
        //Make it a Dable!
        return newTable;
      }
    }
    return this.id;
  }
  return false;
}
