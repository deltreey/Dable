export default function(footer) {
  if (!footer) {
    return false;
  }
  var start = this.pageNumber * this.pageSize + 1;
  var end = start + this.pageSize - 1;
  if (end > this.VisibleRowCount()) {
    end = this.VisibleRowCount();
  }

  var showing = footer.querySelector('#' + this.id + '_showing');
  if (showing) {
    if (this.RowCount() === 0) {
      showing.innerHTML = 'There are no entries';
    } else if (this.VisibleRowCount() === 0) {
      showing.innerHTML = 'Showing 0 entries';
    } else {
      showing.innerHTML = 'Showing ' + start + ' to ' + end + ' of ' +
        this.VisibleRowCount() + ' entries';
    }

    if (this.VisibleRowCount() != this.RowCount()) {
      showing.innerHTML += ' (filtered from ' + this.RowCount() +
        ' total entries)';
    }
  }

  var right = footer.querySelector('#' + this.id + '_page_prev').parentElement;
  footer.replaceChild(this.BuildPager(), right);

  return footer;
}
