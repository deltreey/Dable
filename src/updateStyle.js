export default function(tableDiv, style) {
  if (!tableDiv) {
    tableDiv = document.getElementById(this.id);
    if (!tableDiv) {
      return false;
    }
  }

  if (!style) {
    style = this.style;
  }

  this.style = style;

  //initial style cleanup
  this.RemoveStyles(tableDiv);

  //clear is a style option to completely avoid any styling so you can
  //roll your own
  if (style.toLowerCase() != 'clear') {
    //base styles for 'none', the other styles sometimes build on these
    //so we apply them beforehand
    this.ApplyBaseStyles(tableDiv);

    if (style.toLowerCase() == 'none') {
      return true;
    }
    if (style.toLowerCase() == 'jqueryui') {
      this.ApplyJqueryUIStyles(tableDiv);
    } else if (style.toLowerCase() == 'bootstrap') {
      this.ApplyBootstrapStyles(tableDiv);
    }
  }
}
