export default function(tableDiv) {
  var result = false;

  var checkId = '';
  if (!tableDiv) {
    checkId = this.id;
  } else if (tableDiv && tableDiv.nodeType &&
      tableDiv.nodeName.toLowerCase() == 'div') {
    checkId = tableDiv.id;
  } else if (tableDiv && window.jQuery &&
      tableDiv instanceof jQuery && tableDiv[0].nodeType) {
    checkId = tableDiv[0].id;
  } else if (tableDiv) {
    checkId = tableDiv;
  }

  checkId += '_header';
  var headerElement = document.getElementById(checkId);
  if (headerElement) {
    result = true;
  }

  return result;
}
