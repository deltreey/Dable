export default function(columnNames) {
  if (!columnNames) {
    return false;
  }

  for (var i = 0; i < columnNames.length; ++i) {
    if (this.columnData.length <= i) {
      this.columnData.push({
        Tag: columnNames[i],
        FriendlyName: columnNames[i],
        CustomSortFunc: null,
        CustomRendering: null
      });
    } else {
      this.columnData[i].Name = columnNames[i];
    }
  }
}
