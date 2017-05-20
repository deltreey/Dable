export default function(tableDiv) {
  if (!tableDiv) {
    return false;
  }
  var div = document.createElement('div');
  var span = document.createElement('span');
  var left = div.cloneNode(false);
  var showing = span.cloneNode(false);
  showing.id = this.id + '_showing';
  left.appendChild(showing);
  var right = this.BuildPager(footer);
  var clear = div.cloneNode(false);
  var footer = div.cloneNode(false);
  footer.id = this.id + '_footer';
  footer.innerHTML = '';
  footer.appendChild(left);
  footer.appendChild(right);
  footer.appendChild(clear);
  return this.UpdateFooter(footer);
}
