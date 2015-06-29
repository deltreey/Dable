Dable
=====

[![Join the chat at https://gitter.im/deltreey/Dable](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/deltreey/Dable?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Codacy Badge](https://www.codacy.com/project/badge/2106c1def8564436b6e6aef5980fd668)](https://www.codacy.com/app/suicidolt/Dable)
[![Code Climate](https://codeclimate.com/github/deltreey/Dable/badges/gpa.svg)](https://codeclimate.com/github/deltreey/Dable)
[![Test Coverage](https://codeclimate.com/github/deltreey/Dable/badges/coverage.svg)](https://codeclimate.com/github/deltreey/Dable/coverage)
[![Travis CI](https://travis-ci.org/deltreey/Dable.svg?branch=master)](https://travis-ci.org/deltreey/Dable)
[![bitHound Score](https://www.bithound.io/github/deltreey/Dable/badges/score.svg)](https://www.bithound.io/github/deltreey/Dable)


Dable (pronounced 'dabble') is a simple javascript table control with filtering, sorting, paging, styles, and more!

Dable is simple and elegant.  It has __zero__ dependencies and works in IE8+.

Also Found On
-----
**NuGet**: https://www.nuget.org/packages/Dable/<br />
**Chocolatey**: https://chocolatey.org/packages/Dable/1.2.1<br />
**bower**: `bower install dable`

How To
-----

Initialize a new Dable with

```javascript
var dable = new Dable();
```
Build your Dable by giving it data and column names.

```javascript
var data = [ [ 1, 2 ], [ 3, 4 ] ];
var columns = [ 'Odd', 'Even' ];

dable.SetDataAsRows(data);		// We can import data as rows or columns for flexibility
dable.SetColumnNames(columns);	// Because the data is raw, we need to name our columns
```
If you want to style your Dable, you can use custom styling with easy to remember classes and IDs.
Or you can just select JQueryUI or Bootstrap for preconfigured styles.

```javascript
dable.style = "JqueryUI";	// Don't worry about uppercase/lowercase
```
Dable is pure javascript, so you don't have to add a CSS file to your project.  However, if you use a custom style, make sure you include the relevant stylesheet.

Creating your Dable is as simple as using the id of a div from your page and calling

```javascript
dable.BuildAll(divId);
```
Or, if you prefer HTML to Javascript, build your table in HTML, and then create your Dable in one step.

```html
<div id="TableDable">
	<table>
		<thead>
			<tr>
				<th>Odd</th>
				<th>Even</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>2</td>
			</tr>
			<tr>
				<td>3</td>
				<td>4</td>
			</tr>
		</tbody>
	</table>
</div>
<script type="text/javascript">
	var dable = new Dable("TableDable");
</script>
```
__Everything in Dable is designed to be modifiable by you.__

The Search is an array of callbacks, so you can add your own with a simple command.

```javascript
dable.filters.push(function (searchText, cellValue) {
	//this is a custom filter
});
```
Because it's a simple array, you can wipe out the existing filters altogether if you don't like them.
Your columns are a simple object array.  Each object has a `Tag`, a `FriendlyName`, and can be provided with `CustomRendering` and `CustomSortFunc` callbacks

```javascript
{ Tag, FriendlyName, CustomSortFunc, CustomRendering }
```
These callbacks are simple to use too.  When you want to render something uniquely, just return the text to render and it'll be stuck in the cell.

```javascript
dable.columnData[0].CustomRendering = function (cellValue) {
	return '<a target="_blank" href="/?cell=' + cellValue + '">' + cellValue + '</a>';
}
```
When you want to sort something uniquely, just return an array of the rows to present in whatever order you want.

```javascript
dable.columnData[1].CustomSortFunc = function (columnIndex, ascending, currentRowObjects) {
	return currentRowObjects.reverse();
}
```
The `CustomSortFunc` property also allows you to keep a column from sorting.  Just set it to `false`.
```javascript
dable.columnData[2].CustomSortFunc = false;
```
What about printing?  If your table is paged, you need to be able to output all the rows to print!
Here's a sample of how to do this extremely complex Dable procedure.

```javascript
dable.pageNumber = 0;				// Go back to the first page
dable.pageSize = dable.rows.length;	// Change the page size to the whole table size
dable.UpdateDisplayedRows();		// Update the table
dable.UpdateStyle();				// Reapply our styles
```

Every function inside of Dable is accessible, down to the initial rendering functions!

For more examples, check out the site! http://deltreey.github.io/Dable/

Breaking Changes
-----

`1.0 - 1.1:` Dable custom sort functions now use rowObjects instead of rows.  rowObjects have the `Row` property which contains the row as it existed before but also includes the `RowNumber` property which makes things like delete buttons easier to implement.
