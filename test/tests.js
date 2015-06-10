var testDiv = document.getElementById("qunit-fixture");

module( "Baseline Tests" );
test( "Dable exists", function() {
	//Given: Nothing
	
	//When: We check the type of Dable
	var result = typeof Dable;
	
	//Then: Dable's type is a function
	ok( result == 'function', "Dable is a function" ); 
});
test( "Dable defaults are empty, not null", function() {
	//Given: Nothing
	
	//When: we create a new Dable
	var dable = new Dable();
	
	//Then: It's defaults are empty, not null
	console.log(dable);
	ok( dable != null, "Dable is not null" );
	ok( dable.id != null, "ID is not null" );
	ok( dable.id == "", "ID is empty");
	ok( dable.columns != null, "Columns is not null" );
	ok( dable.columns instanceof Array, "Columns is an Array" );
	ok( dable.columns.length == 0, "Columns is empty" );
	ok( dable.columnData != null, "ColumnData is not null" );
	ok( dable.columnData instanceof Array, "ColumnData is an Array" );
	ok( dable.columnData.length == 0, "ColumnData is empty" );
	ok( dable.rows != null, "Rows is not null" );
	ok( dable.rows instanceof Array, "Rows is an Array" );
	ok( dable.rows.length == 0, "Rows is empty" );
	ok( dable.rowObjects != null, "RowObjects is not null" );
	ok( dable.rowObjects instanceof Array, "RowObjects is an Array" );
	ok( dable.rowObjects.length == 0, "RowObjects is empty" );
	ok( dable.hiddenColumns != null, "HiddenColumns is not null" );
	ok( dable.hiddenColumns instanceof Array, "HiddenColumns is an Array" );
	ok( dable.hiddenColumns.length == 0, "HiddenColumns is empty" );
	ok( dable.filters != null, "Filters is not null" );
	ok( dable.filters instanceof Array, "Filters is an Array" );
	ok( dable.filters.length == 2, "Filters contains the 2 default filters" );
	ok( dable.pageSizes != null, "PageSizes is not null" );
	ok( dable.pageSizes instanceof Array, "PageSizes is an Array" );
	ok( dable.pageSizes.length == 4, "PageSizes contains the 2 default filters" );
	ok( dable.async != null, "Async is not null" );
	ok( dable.async == false, "Async is false" );
	ok( dable.asyncData != null, "AsyncData is not null" );
	ok( dable.asyncData instanceof Object, "AsyncData is an object" );
	ok( Object.keys(dable.asyncData).length == 0, "AsyncData has no properties" );
	ok( dable.asyncLength != null, "AsyncLength is not null" );
	ok( dable.asyncLength == 1000, "AsyncLength is the default: 1000" );
	ok( dable.asyncStart != null, "AsyncStart is not null" );
	ok( dable.asyncStart == 0, "AsyncStart is the default: 0" );
	ok( dable.currentFilter != null, "CurrentFilter is not null" );
	ok( dable.currentFilter == "", "CurrentFilter is empty" );
	ok( dable.dableClass != null, "DableClass is not null" );
	ok( dable.dableClass == "", "DableClass is empty" );
	ok( dable.evenRowColor != null, "EvenRowColor is not null" );
	ok( dable.evenRowColor == "#E2E4FF", "EvenRowColor is the default: #E2E4FF" );
	ok( dable.evenRowClass != null, "EvenRowClass is not null" );
	ok( dable.evenRowClass == "table-row-even", "EvenRowClass is the default: table-row-even" );
	ok( dable.footerClass != null, "FooterClass is not null" );
	ok( dable.footerClass == "", "FooterClass is empty" );
	ok( dable.headerClass != null, "HeaderClass is not null" );
	ok( dable.headerClass == "", "HeaderClass is empty" );
	ok( dable.oddRowColor != null, "OddRowColor is not null" );
	ok( dable.oddRowColor == "white", "OddRowColor is the default: #E2E4FF" );
	ok( dable.oddRowClass != null, "OddRowClass is not null" );
	ok( dable.oddRowClass == "table-row-odd", "OddRowClass is the default: table-row-odd" );
	ok( dable.pageNumber != null, "PageNumber is not null" );
	ok( dable.pageNumber == 0, "PageNumber is the default: 0" );
	ok( dable.pageSize != null, "PageSize is not null" );
	ok( dable.pageSize == 10, "PageSize is the default: 10" );
	ok( dable.minimumSearchLength != null, "MinimumSearchLength is not null" );
	ok( dable.minimumSearchLength == 1, "MinimumSearchLength is the default: 1" );
	ok( dable.pagerButtonsClass != null, "PagerButtonsClass is not null" );
	ok( dable.pagerButtonsClass == "table-page", "PagerButtonsClass is the default: table-page" );
	ok( dable.pagerIncludeFirstAndLast != null, "PagerIncludeFirstAndLast is not null" );
	ok( dable.pagerIncludeFirstAndLast == false, "PagerIncludeFirstAndLast is the default: false" );
	ok( dable.pagerSize != null, "PagerSize is not null" );
	ok( dable.pagerSize == 0, "PagerSize is the default: 0" );
	ok( dable.sortClass != null, "SortClass is not null" );
	ok( dable.sortClass == "table-sort", "SortClass is the default: table-sort" );
	ok( dable.sortColumn === null, "SortColumn is null" );
	ok( dable.sortOrder != null, "SortOrder is not null" );
	ok( dable.sortOrder == "descending", "SortOrder is the default: descending" );
	ok( dable.style != null, "Style is not null" );
	ok( dable.style == "none", "Style is the default: none" );
	ok( dable.tableClass != null, "TableClass is not null" );
	ok( dable.tableClass == "", "TableClass is empty" );
	ok( dable.tfoothtml != null, "TFootHtml is not null" );
	ok( dable.tfoothtml == "", "TFootHtml is empty" );
});

module( "Pager Tests" );
test( "Dable Pager goes forward", function() {
	//Given: a table made into a Dable with more than 1 page
	MakeSimpleTable(testDiv);
	var dable = new Dable(testDiv.id);
	
	//When: we call page forward and check the first cell of the table
	dable.NextPage();
	var firstCell = testDiv.querySelector('td');
	
	//Then: we see the next page
	equal( dable.pageNumber, 1 );
	equal( firstCell.innerHTML, "10" );
});

test( "Dable Pager goes backward", function() {
	//Given: a table made into a Dable with more than 1 page and go to page 2
	MakeSimpleTable(testDiv);
	var dable = new Dable(testDiv.id);
	dable.NextPage();
	
	//When: we call page backward and check the first cell of the table
	dable.PreviousPage();
	var firstCell = testDiv.querySelector('td');
	
	//Then: we see the first page
	equal( dable.pageNumber, 0 );
	equal( firstCell.innerHTML, "0" );
});

module( "Style Tests" );
test( 'Dable with style="none" has basic elements', function() {
	//Given: a table
	document.body.appendChild(testDiv);
	MakeSimpleTable(testDiv);
	
	//When: we make it a dable
	var dable = new Dable(testDiv.id);
	
	//Then: we see the elements we expect
		//Element pattern
	equal(testDiv.children.length, 3);
	var header = testDiv.children[0];
	var table = testDiv.querySelector('table');
	var footer = testDiv.children[2];
	equal(header.children.length, 3);
	equal(header.children[0].children.length, 2);
	equal(header.children[0].children[0].children.length, 0);
	equal(header.children[0].children[1].children.length, 4);
	equal(header.children[0].children[1].children[0].children.length, 0);
	equal(header.children[0].children[1].children[1].children.length, 0);
	equal(header.children[0].children[1].children[2].children.length, 0);
	equal(header.children[0].children[1].children[3].children.length, 0);
	equal(header.children[1].children.length, 2);
	equal(header.children[1].children[0].children.length, 0)
	equal(header.children[1].children[1].children.length, 0)
	equal(header.children[2].children.length, 0);
	equal(footer.children.length, 3);
	equal(footer.children[0].children.length, 1);
	equal(footer.children[0].children[0].children.length, 0);
	equal(footer.children[1].children.length, 2);
	equal(footer.children[1].children[0].children.length, 1);
	equal(footer.children[1].children[0].children[0].children.length, 0);
	equal(footer.children[1].children[1].children[0].children.length, 0);
	equal(footer.children[2].children.length, 0);
	equal(table.children.length, 2);
	equal(table.children[0].children.length, 1);
	equal(table.children[0].children[0].children.length, 4);
	equal(table.children[0].children[0].children[0].children.length, 3);
	equal(table.children[0].children[0].children[1].children.length, 3);
	equal(table.children[0].children[0].children[2].children.length, 3);
	equal(table.children[0].children[0].children[3].children.length, 3);
	equal(table.children[0].children[0].children[0].children[0].children.length, 0);
	equal(table.children[0].children[0].children[1].children[0].children.length, 0);
	equal(table.children[0].children[0].children[2].children[0].children.length, 0);
	equal(table.children[0].children[0].children[3].children[0].children.length, 0);
	equal(table.children[0].children[0].children[0].children[1].children.length, 0);
	equal(table.children[0].children[0].children[1].children[1].children.length, 0);
	equal(table.children[0].children[0].children[2].children[1].children.length, 0);
	equal(table.children[0].children[0].children[3].children[1].children.length, 0);
	equal(table.children[0].children[0].children[0].children[2].children.length, 0);
	equal(table.children[0].children[0].children[1].children[2].children.length, 0);
	equal(table.children[0].children[0].children[2].children[2].children.length, 0);
	equal(table.children[0].children[0].children[3].children[2].children.length, 0);
	equal(table.children[1].children.length, 10);
	equal(table.children[1].children[0].children.length, 4);
	equal(table.children[1].children[0].children[0].children.length, 0);
	equal(table.children[1].children[0].children[1].children.length, 0);
	equal(table.children[1].children[0].children[2].children.length, 0);
	equal(table.children[1].children[0].children[3].children.length, 0);
		//IDs
	equal(header.id, testDiv.id + "_header");
	equal(footer.id, testDiv.id + "_footer");
	equal(header.children[1].children[1].id, testDiv.id + "_search");
	equal(footer.children[0].children[0].id, testDiv.id + "_showing");
	equal(footer.children[1].children[0].id, testDiv.id + "_page_prev");
	equal(footer.children[1].children[1].id, testDiv.id + "_page_next");
	equal(table.children[1].id, testDiv.id + "_body");
		//Text
	equal(header.children[0].children[0].innerHTML, "Show ");
	equal(header.children[1].children[0].innerHTML, "Search ");
	equal(footer.children[0].children[0].innerHTML, "Showing 1 to 10 of 20 entries");
	equal(header.children[0].children[1].children[0].innerHTML, "10");
	equal(header.children[0].children[1].children[1].innerHTML, "25");
	equal(header.children[0].children[1].children[2].innerHTML, "50");
	equal(header.children[0].children[1].children[3].innerHTML, "100");
	equal(footer.children[1].children[0].children[0].innerHTML, "Prev");
	equal(footer.children[1].children[1].children[0].innerHTML, "Next");
	equal(table.children[0].children[0].children[0].children[0].innerHTML, "Column 0 ");
	equal(table.children[0].children[0].children[1].children[0].innerHTML, "Column 1 ");
	equal(table.children[0].children[0].children[2].children[0].innerHTML, "Column 2 ");
	equal(table.children[0].children[0].children[3].children[0].innerHTML, "Column 3 ");
	equal(table.children[1].children[0].children[0].innerHTML, 0);
	equal(table.children[1].children[0].children[1].innerHTML, 1);
	equal(table.children[1].children[0].children[2].innerHTML, 2);
	equal(table.children[1].children[0].children[3].innerHTML, 3);
		//Values
	equal(header.children[0].children[1].children[0].value, "10");
	equal(header.children[0].children[1].children[1].value, "25");
	equal(header.children[0].children[1].children[2].value, "50");
	equal(header.children[0].children[1].children[3].value, "100");
		//Styles
	equal(table.style.width, "100%");
	equal(header.style.padding, "5px");
	equal(footer.style.padding, "5px");
	equal(header.children[0].style.float, "left");
	equal(header.children[1].style.float, "right");
	equal(header.children[2].style.clear, "both");
	equal(footer.children[0].style.float, "left");
	equal(footer.children[1].style.float, "right");
	equal(footer.children[1].style.listStyle, "none");
	equal(footer.children[2].style.clear, "both");
	equal(footer.children[1].children[0].style.display, "inline");
	equal(footer.children[1].children[1].style.display, "inline");
	equal(footer.children[1].children[0].style.marginRight, "5px");
	equal(footer.children[1].children[1].style.marginRight, "5px");
	equal(table.children[0].children[0].children[0].style.padding, "5px");
	equal(table.children[0].children[0].children[1].style.padding, "5px");
	equal(table.children[0].children[0].children[2].style.padding, "5px");
	equal(table.children[0].children[0].children[3].style.padding, "5px");
	//equal(table.children[0].children[0].children[0].style.cursor, "default");
	//equal(table.children[0].children[0].children[1].style.cursor, "default");
	//equal(table.children[0].children[0].children[2].style.cursor, "default");
	//equal(table.children[0].children[0].children[3].style.cursor, "default");
	equal(table.children[0].children[0].children[0].children[0].style.float, "left");
	equal(table.children[0].children[0].children[0].children[1].style.float, "right");
	equal(table.children[0].children[0].children[0].children[2].style.clear, "both");
	equal(table.children[0].children[0].children[1].children[0].style.float, "left");
	equal(table.children[0].children[0].children[1].children[1].style.float, "right");
	equal(table.children[0].children[0].children[1].children[2].style.clear, "both");
	equal(table.children[0].children[0].children[2].children[0].style.float, "left");
	equal(table.children[0].children[0].children[2].children[1].style.float, "right");
	equal(table.children[0].children[0].children[2].children[2].style.clear, "both");
	equal(table.children[0].children[0].children[3].children[0].style.float, "left");
	equal(table.children[0].children[0].children[3].children[1].style.float, "right");
	equal(table.children[0].children[0].children[3].children[2].style.clear, "both");
	equal(table.children[1].children[0].style.backgroundColor, "rgb(226, 228, 255)");
	equal(table.children[1].children[1].style.backgroundColor, "white");
	equal(table.children[1].children[2].style.backgroundColor, "rgb(226, 228, 255)");
	equal(table.children[1].children[3].style.backgroundColor, "white");
	equal(table.children[1].children[4].style.backgroundColor, "rgb(226, 228, 255)");
	equal(table.children[1].children[5].style.backgroundColor, "white");
	equal(table.children[1].children[6].style.backgroundColor, "rgb(226, 228, 255)");
	equal(table.children[1].children[7].style.backgroundColor, "white");
	equal(table.children[1].children[8].style.backgroundColor, "rgb(226, 228, 255)");
	equal(table.children[1].children[9].style.backgroundColor, "white");
	equal(table.children[1].children[0].children[0].style.padding, "5px");
	equal(table.children[1].children[0].children[1].style.padding, "5px");
	equal(table.children[1].children[0].children[2].style.padding, "5px");
	equal(table.children[1].children[0].children[3].style.padding, "5px");
		//Classes
	equal(footer.children[1].children[0].className, "table-page");
	equal(footer.children[1].children[1].className, "table-page");
	equal(table.children[0].children[0].children[0].children[1].className, "table-sort");
	equal(table.children[0].children[0].children[1].children[1].className, "table-sort");
	equal(table.children[0].children[0].children[2].children[1].className, "table-sort");
	equal(table.children[0].children[0].children[3].children[1].className, "table-sort");
	equal(table.children[1].children[0].className, "table-row-even");
	equal(table.children[1].children[1].className, "table-row-odd");
	equal(table.children[1].children[2].className, "table-row-even");
	equal(table.children[1].children[3].className, "table-row-odd");
	equal(table.children[1].children[4].className, "table-row-even");
	equal(table.children[1].children[5].className, "table-row-odd");
	equal(table.children[1].children[6].className, "table-row-even");
	equal(table.children[1].children[7].className, "table-row-odd");
	equal(table.children[1].children[8].className, "table-row-even");
	equal(table.children[1].children[9].className, "table-row-odd");
		//State
	equal(footer.children[1].children[0].getAttribute("disabled"), "disabled");
});

test( 'Dable with style="clear" has basic elements but no style', function() {
	//Given: a table
	document.body.appendChild(testDiv);
	MakeSimpleTable(testDiv);
	
	//When: we make it a dable with style 'clear'
	var dable = new Dable(testDiv.id);
	dable.style = "clear";
	dable.UpdateStyle();
	
	//Then: we see the elements we expect
		//Element pattern
	equal(testDiv.children.length, 3);
	var header = testDiv.children[0];
	var table = testDiv.querySelector('table');
	var footer = testDiv.children[2];
	equal(header.children.length, 3);
	equal(header.children[0].children.length, 2);
	equal(header.children[0].children[0].children.length, 0);
	equal(header.children[0].children[1].children.length, 4);
	equal(header.children[0].children[1].children[0].children.length, 0);
	equal(header.children[0].children[1].children[1].children.length, 0);
	equal(header.children[0].children[1].children[2].children.length, 0);
	equal(header.children[0].children[1].children[3].children.length, 0);
	equal(header.children[1].children.length, 2);
	equal(header.children[1].children[0].children.length, 0)
	equal(header.children[1].children[1].children.length, 0)
	equal(header.children[2].children.length, 0);
	equal(footer.children.length, 3);
	equal(footer.children[0].children.length, 1);
	equal(footer.children[0].children[0].children.length, 0);
	equal(footer.children[1].children.length, 2);
	equal(footer.children[1].children[0].children.length, 1);
	equal(footer.children[1].children[0].children[0].children.length, 0);
	equal(footer.children[1].children[1].children[0].children.length, 0);
	equal(footer.children[2].children.length, 0);
	equal(table.children.length, 2);
	equal(table.children[0].children.length, 1);
	equal(table.children[0].children[0].children.length, 4);
	equal(table.children[0].children[0].children[0].children.length, 3);
	equal(table.children[0].children[0].children[1].children.length, 3);
	equal(table.children[0].children[0].children[2].children.length, 3);
	equal(table.children[0].children[0].children[3].children.length, 3);
	equal(table.children[0].children[0].children[0].children[0].children.length, 0);
	equal(table.children[0].children[0].children[1].children[0].children.length, 0);
	equal(table.children[0].children[0].children[2].children[0].children.length, 0);
	equal(table.children[0].children[0].children[3].children[0].children.length, 0);
	equal(table.children[0].children[0].children[0].children[1].children.length, 0);
	equal(table.children[0].children[0].children[1].children[1].children.length, 0);
	equal(table.children[0].children[0].children[2].children[1].children.length, 0);
	equal(table.children[0].children[0].children[3].children[1].children.length, 0);
	equal(table.children[0].children[0].children[0].children[2].children.length, 0);
	equal(table.children[0].children[0].children[1].children[2].children.length, 0);
	equal(table.children[0].children[0].children[2].children[2].children.length, 0);
	equal(table.children[0].children[0].children[3].children[2].children.length, 0);
	equal(table.children[1].children.length, 10);
	equal(table.children[1].children[0].children.length, 4);
	equal(table.children[1].children[0].children[0].children.length, 0);
	equal(table.children[1].children[0].children[1].children.length, 0);
	equal(table.children[1].children[0].children[2].children.length, 0);
	equal(table.children[1].children[0].children[3].children.length, 0);
		//IDs
	equal(header.id, testDiv.id + "_header");
	equal(footer.id, testDiv.id + "_footer");
	equal(header.children[1].children[1].id, testDiv.id + "_search");
	equal(footer.children[0].children[0].id, testDiv.id + "_showing");
	equal(footer.children[1].children[0].id, testDiv.id + "_page_prev");
	equal(footer.children[1].children[1].id, testDiv.id + "_page_next");
	equal(table.children[1].id, testDiv.id + "_body");
		//Text
	equal(header.children[0].children[0].innerHTML, "Show ");
	equal(header.children[1].children[0].innerHTML, "Search ");
	equal(footer.children[0].children[0].innerHTML, "Showing 1 to 10 of 20 entries");
	equal(header.children[0].children[1].children[0].innerHTML, "10");
	equal(header.children[0].children[1].children[1].innerHTML, "25");
	equal(header.children[0].children[1].children[2].innerHTML, "50");
	equal(header.children[0].children[1].children[3].innerHTML, "100");
	equal(footer.children[1].children[0].children[0].innerHTML, "Prev");
	equal(footer.children[1].children[1].children[0].innerHTML, "Next");
	equal(table.children[0].children[0].children[0].children[0].innerHTML, "Column 0 ");
	equal(table.children[0].children[0].children[1].children[0].innerHTML, "Column 1 ");
	equal(table.children[0].children[0].children[2].children[0].innerHTML, "Column 2 ");
	equal(table.children[0].children[0].children[3].children[0].innerHTML, "Column 3 ");
	equal(table.children[1].children[0].children[0].innerHTML, 0);
	equal(table.children[1].children[0].children[1].innerHTML, 1);
	equal(table.children[1].children[0].children[2].innerHTML, 2);
	equal(table.children[1].children[0].children[3].innerHTML, 3);
		//Values
	equal(header.children[0].children[1].children[0].value, "10");
	equal(header.children[0].children[1].children[1].value, "25");
	equal(header.children[0].children[1].children[2].value, "50");
	equal(header.children[0].children[1].children[3].value, "100");
		//Styles
	notEqual(table.style.width, "100%");
	notEqual(header.style.padding, "5px");
	notEqual(footer.style.padding, "5px");
	notEqual(header.children[0].style.float, "left");
	notEqual(header.children[1].style.float, "right");
	notEqual(header.children[2].style.clear, "both");
	notEqual(footer.children[0].style.float, "left");
	notEqual(footer.children[1].style.float, "right");
	notEqual(footer.children[1].style.listStyle, "none");
	notEqual(footer.children[2].style.clear, "both");
	notEqual(footer.children[1].children[0].style.display, "inline");
	notEqual(footer.children[1].children[1].style.display, "inline");
	notEqual(footer.children[1].children[0].style.marginRight, "5px");
	notEqual(footer.children[1].children[1].style.marginRight, "5px");
	notEqual(table.children[0].children[0].children[0].style.padding, "5px");
	notEqual(table.children[0].children[0].children[1].style.padding, "5px");
	notEqual(table.children[0].children[0].children[2].style.padding, "5px");
	notEqual(table.children[0].children[0].children[3].style.padding, "5px");
	//notEqual(table.children[0].children[0].children[0].style.cursor, "default");
	//notEqual(table.children[0].children[0].children[1].style.cursor, "default");
	//notEqual(table.children[0].children[0].children[2].style.cursor, "default");
	//notEqual(table.children[0].children[0].children[3].style.cursor, "default");
	notEqual(table.children[0].children[0].children[0].children[0].style.float, "left");
	notEqual(table.children[0].children[0].children[0].children[1].style.float, "right");
	notEqual(table.children[0].children[0].children[0].children[2].style.clear, "both");
	notEqual(table.children[0].children[0].children[1].children[0].style.float, "left");
	notEqual(table.children[0].children[0].children[1].children[1].style.float, "right");
	notEqual(table.children[0].children[0].children[1].children[2].style.clear, "both");
	notEqual(table.children[0].children[0].children[2].children[0].style.float, "left");
	notEqual(table.children[0].children[0].children[2].children[1].style.float, "right");
	notEqual(table.children[0].children[0].children[2].children[2].style.clear, "both");
	notEqual(table.children[0].children[0].children[3].children[0].style.float, "left");
	notEqual(table.children[0].children[0].children[3].children[1].style.float, "right");
	notEqual(table.children[0].children[0].children[3].children[2].style.clear, "both");
	notEqual(table.children[1].children[0].style.backgroundColor, "rgb(226, 228, 255)");
	notEqual(table.children[1].children[1].style.backgroundColor, "white");
	notEqual(table.children[1].children[2].style.backgroundColor, "rgb(226, 228, 255)");
	notEqual(table.children[1].children[3].style.backgroundColor, "white");
	notEqual(table.children[1].children[4].style.backgroundColor, "rgb(226, 228, 255)");
	notEqual(table.children[1].children[5].style.backgroundColor, "white");
	notEqual(table.children[1].children[6].style.backgroundColor, "rgb(226, 228, 255)");
	notEqual(table.children[1].children[7].style.backgroundColor, "white");
	notEqual(table.children[1].children[8].style.backgroundColor, "rgb(226, 228, 255)");
	notEqual(table.children[1].children[9].style.backgroundColor, "white");
	notEqual(table.children[1].children[0].children[0].style.padding, "5px");
	notEqual(table.children[1].children[0].children[1].style.padding, "5px");
	notEqual(table.children[1].children[0].children[2].style.padding, "5px");
	notEqual(table.children[1].children[0].children[3].style.padding, "5px");
		//Classes
	equal(footer.children[1].children[0].className, "table-page");
	equal(footer.children[1].children[1].className, "table-page");
	equal(table.children[0].children[0].children[0].children[1].className, "table-sort");
	equal(table.children[0].children[0].children[1].children[1].className, "table-sort");
	equal(table.children[0].children[0].children[2].children[1].className, "table-sort");
	equal(table.children[0].children[0].children[3].children[1].className, "table-sort");
	equal(table.children[1].children[0].className, "table-row-even");
	equal(table.children[1].children[1].className, "table-row-odd");
	equal(table.children[1].children[2].className, "table-row-even");
	equal(table.children[1].children[3].className, "table-row-odd");
	equal(table.children[1].children[4].className, "table-row-even");
	equal(table.children[1].children[5].className, "table-row-odd");
	equal(table.children[1].children[6].className, "table-row-even");
	equal(table.children[1].children[7].className, "table-row-odd");
	equal(table.children[1].children[8].className, "table-row-even");
	equal(table.children[1].children[9].className, "table-row-odd");
		//State
	equal(footer.children[1].children[0].getAttribute("disabled"), "disabled");
});

test( 'Dable with style="bootstrap" has basic elements and slightly different styling and classes', function() {
	//Given: a table
	document.body.appendChild(testDiv);
	MakeSimpleTable(testDiv);
	
	//When: we make it a dable
	var dable = new Dable(testDiv.id);
	dable.style = 'bootstrap';
	dable.UpdateStyle();
	
	//Then: we see the elements we expect
		//Element pattern
	equal(testDiv.children.length, 3);
	var header = testDiv.children[0];
	var table = testDiv.querySelector('table');
	var footer = testDiv.children[2];
	equal(header.children.length, 3);
	equal(header.children[0].children.length, 2);
	equal(header.children[0].children[0].children.length, 0);
	equal(header.children[0].children[1].children.length, 4);
	equal(header.children[0].children[1].children[0].children.length, 0);
	equal(header.children[0].children[1].children[1].children.length, 0);
	equal(header.children[0].children[1].children[2].children.length, 0);
	equal(header.children[0].children[1].children[3].children.length, 0);
	equal(header.children[1].children.length, 2);
	equal(header.children[1].children[0].children.length, 0)
	equal(header.children[1].children[1].children.length, 0)
	equal(header.children[2].children.length, 0);
	equal(footer.children.length, 3);
	equal(footer.children[0].children.length, 1);
	equal(footer.children[0].children[0].children.length, 0);
	equal(footer.children[1].children.length, 2);
	equal(footer.children[1].children[0].children.length, 1);
	equal(footer.children[1].children[0].children[0].children.length, 0);
	equal(footer.children[1].children[1].children[0].children.length, 0);
	equal(footer.children[2].children.length, 0);
	equal(table.children.length, 2);
	equal(table.children[0].children.length, 1);
	equal(table.children[0].children[0].children.length, 4);
	equal(table.children[0].children[0].children[0].children.length, 3);
	equal(table.children[0].children[0].children[1].children.length, 3);
	equal(table.children[0].children[0].children[2].children.length, 3);
	equal(table.children[0].children[0].children[3].children.length, 3);
	equal(table.children[0].children[0].children[0].children[0].children.length, 0);
	equal(table.children[0].children[0].children[1].children[0].children.length, 0);
	equal(table.children[0].children[0].children[2].children[0].children.length, 0);
	equal(table.children[0].children[0].children[3].children[0].children.length, 0);
	equal(table.children[0].children[0].children[0].children[1].children.length, 0);
	equal(table.children[0].children[0].children[1].children[1].children.length, 0);
	equal(table.children[0].children[0].children[2].children[1].children.length, 0);
	equal(table.children[0].children[0].children[3].children[1].children.length, 0);
	equal(table.children[0].children[0].children[0].children[2].children.length, 0);
	equal(table.children[0].children[0].children[1].children[2].children.length, 0);
	equal(table.children[0].children[0].children[2].children[2].children.length, 0);
	equal(table.children[0].children[0].children[3].children[2].children.length, 0);
	equal(table.children[1].children.length, 10);
	equal(table.children[1].children[0].children.length, 4);
	equal(table.children[1].children[0].children[0].children.length, 0);
	equal(table.children[1].children[0].children[1].children.length, 0);
	equal(table.children[1].children[0].children[2].children.length, 0);
	equal(table.children[1].children[0].children[3].children.length, 0);
		//IDs
	equal(header.id, testDiv.id + "_header");
	equal(footer.id, testDiv.id + "_footer");
	equal(header.children[1].children[1].id, testDiv.id + "_search");
	equal(footer.children[0].children[0].id, testDiv.id + "_showing");
	equal(footer.children[1].children[0].id, testDiv.id + "_page_prev");
	equal(footer.children[1].children[1].id, testDiv.id + "_page_next");
	equal(table.children[1].id, testDiv.id + "_body");
		//Text
	equal(header.children[0].children[0].innerHTML, "Show ");
	equal(header.children[1].children[0].innerHTML, "Search ");
	equal(footer.children[0].children[0].innerHTML, "Showing 1 to 10 of 20 entries");
	equal(header.children[0].children[1].children[0].innerHTML, "10");
	equal(header.children[0].children[1].children[1].innerHTML, "25");
	equal(header.children[0].children[1].children[2].innerHTML, "50");
	equal(header.children[0].children[1].children[3].innerHTML, "100");
			// different from default
	equal(footer.children[1].children[0].children[0].innerHTML, "");
	equal(footer.children[1].children[1].children[0].innerHTML, "");
			// /different
	equal(table.children[0].children[0].children[0].children[0].innerHTML, "Column 0 ");
	equal(table.children[0].children[0].children[1].children[0].innerHTML, "Column 1 ");
	equal(table.children[0].children[0].children[2].children[0].innerHTML, "Column 2 ");
	equal(table.children[0].children[0].children[3].children[0].innerHTML, "Column 3 ");
	equal(table.children[1].children[0].children[0].innerHTML, 0);
	equal(table.children[1].children[0].children[1].innerHTML, 1);
	equal(table.children[1].children[0].children[2].innerHTML, 2);
	equal(table.children[1].children[0].children[3].innerHTML, 3);
		//Values
	equal(header.children[0].children[1].children[0].value, "10");
	equal(header.children[0].children[1].children[1].value, "25");
	equal(header.children[0].children[1].children[2].value, "50");
	equal(header.children[0].children[1].children[3].value, "100");
		//Styles
	equal(table.style.width, "100%");
	equal(header.style.padding, "5px");
	equal(footer.style.padding, "5px");
	equal(header.children[0].style.float, "left");
	equal(header.children[1].style.float, "right");
	equal(header.children[2].style.clear, "both");
	equal(footer.children[0].style.float, "left");
	equal(footer.children[1].style.float, "right");
	equal(footer.children[1].style.listStyle, "none");
	equal(footer.children[2].style.clear, "both");
			// different from default
	equal(footer.children[1].children[0].style.display, "");
	equal(footer.children[1].children[1].style.display, "");
	equal(footer.children[1].children[0].style.marginRight, "");
	equal(footer.children[1].children[1].style.marginRight, "");
			// /different
	equal(table.children[0].children[0].children[0].style.padding, "5px");
	equal(table.children[0].children[0].children[1].style.padding, "5px");
	equal(table.children[0].children[0].children[2].style.padding, "5px");
	equal(table.children[0].children[0].children[3].style.padding, "5px");
	//equal(table.children[0].children[0].children[0].style.cursor, "default");
	//equal(table.children[0].children[0].children[1].style.cursor, "default");
	//equal(table.children[0].children[0].children[2].style.cursor, "default");
	//equal(table.children[0].children[0].children[3].style.cursor, "default");
	equal(table.children[0].children[0].children[0].children[0].style.float, "left");
	equal(table.children[0].children[0].children[0].children[1].style.float, "right");
	equal(table.children[0].children[0].children[0].children[2].style.clear, "both");
	equal(table.children[0].children[0].children[1].children[0].style.float, "left");
	equal(table.children[0].children[0].children[1].children[1].style.float, "right");
	equal(table.children[0].children[0].children[1].children[2].style.clear, "both");
	equal(table.children[0].children[0].children[2].children[0].style.float, "left");
	equal(table.children[0].children[0].children[2].children[1].style.float, "right");
	equal(table.children[0].children[0].children[2].children[2].style.clear, "both");
	equal(table.children[0].children[0].children[3].children[0].style.float, "left");
	equal(table.children[0].children[0].children[3].children[1].style.float, "right");
	equal(table.children[0].children[0].children[3].children[2].style.clear, "both");
			// different from default
	equal(table.children[1].children[0].style.backgroundColor, "");
	equal(table.children[1].children[1].style.backgroundColor, "");
	equal(table.children[1].children[2].style.backgroundColor, "");
	equal(table.children[1].children[3].style.backgroundColor, "");
	equal(table.children[1].children[4].style.backgroundColor, "");
	equal(table.children[1].children[5].style.backgroundColor, "");
	equal(table.children[1].children[6].style.backgroundColor, "");
	equal(table.children[1].children[7].style.backgroundColor, "");
	equal(table.children[1].children[8].style.backgroundColor, "");
	equal(table.children[1].children[9].style.backgroundColor, "");
			// /different
	equal(table.children[1].children[0].children[0].style.padding, "5px");
	equal(table.children[1].children[0].children[1].style.padding, "5px");
	equal(table.children[1].children[0].children[2].style.padding, "5px");
	equal(table.children[1].children[0].children[3].style.padding, "5px");
		//Classes
			// different from default
	equal(footer.children[1].children[0].className, "btn btn-default table-page");
	equal(footer.children[1].children[1].className, "btn btn-default table-page");
	equal(table.children[0].children[0].children[0].children[1].className, "table-sort glyphicon glyphicon-chevron-up");
	equal(table.children[0].children[0].children[1].children[1].className, "table-sort glyphicon glyphicon-chevron-up");
	equal(table.children[0].children[0].children[2].children[1].className, "table-sort glyphicon glyphicon-chevron-up");
	equal(table.children[0].children[0].children[3].children[1].className, "table-sort glyphicon glyphicon-chevron-up");
			// /different
	equal(table.children[1].children[0].className, "table-row-even");
	equal(table.children[1].children[1].className, "table-row-odd");
	equal(table.children[1].children[2].className, "table-row-even");
	equal(table.children[1].children[3].className, "table-row-odd");
	equal(table.children[1].children[4].className, "table-row-even");
	equal(table.children[1].children[5].className, "table-row-odd");
	equal(table.children[1].children[6].className, "table-row-even");
	equal(table.children[1].children[7].className, "table-row-odd");
	equal(table.children[1].children[8].className, "table-row-even");
	equal(table.children[1].children[9].className, "table-row-odd");
		//State
	equal(footer.children[1].children[0].getAttribute("disabled"), "disabled");
});

module( "Function Counts" );
test( 'Creating an Dable from Data', function() {
	//Given: a spy on UpdateDisplayedRows, an empty dable, and some data for our Dable
	var dable = new Dable();
	sinon.spy(dable, "UpdateDisplayedRows");
	sinon.spy(dable, "UpdateStyle");
	var data = [ [ 1, 2 ], [ 3, 4 ] ];
	var columns = [ 'Odd', 'Even' ]
	dable.SetDataAsRows(data);
	dable.SetColumnNames(columns);
	
	//When: we build the Dable
	dable.BuildAll(testDiv.id);
	
	//Then: We get the mock only called once
	equal(dable.UpdateDisplayedRows.callCount, 1);
	equal(dable.UpdateStyle.callCount, 1);
});

test( 'Creating a Dable from a table', function() {
	//Given: a spy on UpdateDisplayedRows, an empty dable, and a table full of data
	var dable = new Dable();
	sinon.spy(dable, "UpdateDisplayedRows");
	sinon.spy(dable, "UpdateStyle");
	MakeSimpleTable(testDiv);
	
	//When: we build the Dable
	dable.BuildAll(testDiv.id);
	
	//Then: we get the mock only called once
	equal(dable.UpdateDisplayedRows.callCount, 1);
	equal(dable.UpdateStyle.callCount, 1);
});

test( "Calling UpdateStyle", function() {
	//Given: a spy on UpdateDisplayedRows, and a dable built from a table
	var dable = new Dable();
	MakeSimpleTable(testDiv);
	dable.BuildAll(testDiv.id);
	sinon.spy(dable, "UpdateDisplayedRows");
	
	//When: we change the dable style and call UpdateStyle
	dable.UpdateStyle();
	
	//Then: the mock is never called
	equal(dable.UpdateDisplayedRows.callCount, 0);
});

test( "Calling UpdateDisplayedRows", function() {
	//Given: a spy on UpdateStyle, and a dable built from a table
	var dable = new Dable();
	MakeSimpleTable(testDiv);
	dable.BuildAll(testDiv.id);
	sinon.spy(dable, "UpdateStyle");
	
	//When: we change the dable style and call UpdateDisplayedRows
	dable.UpdateDisplayedRows();
	
	//Then: the mock is never called
	equal(dable.UpdateStyle.callCount, 0);
});

module("Public Function Tests");
test( 'Dable Exists() returns true if Dable Exists', function() {
	//Given: a dable
	var dable = new Dable();
	MakeSimpleTable(testDiv);
	dable.BuildAll(testDiv.id);
	
	//When: we call dable.Exists()
	var result = dable.Exists();
	
	//Then: we should get "true"
	equal(result, true);
});
test( 'Dable Exists() returns false if Dable doesnt exist', function() {
	//Given: an unbuilt dable
	var dable = new Dable();
	
	//When: we call dable.Exists()
	var result = dable.Exists();
	
	//Then: we should get "false"
	equal(result, false);
});

module("Header Tests");
test( 'Preselected Page Size Populates in the UI', function() {
	//Given: a dable with a specific selected page size
	var dable = new Dable();
	MakeSimpleTable(testDiv);
	var selectedPageSize = 25;
	dable.pageSize = selectedPageSize;
	
	//When: we build the dable
	dable.BuildAll(testDiv.id);
	
	//Then: the dropdown value equals the selected page size
	var header = document.getElementById(testDiv.id + '_header');
	var pageSizeDropDown = header.querySelector('select');
	equal(pageSizeDropDown.options[pageSizeDropDown.selectedIndex].value, selectedPageSize);
});

module("Dable from HTML Tests");
test( 'With no thead the dable is not created', function() {
	//Given: a dable made from a table with no thead element
	var dable = new Dable();
	var table =  document.createElement("table");
	var tbody = document.createElement("tbody");
	var row = document.createElement("tr");
	var cell = document.createElement("td");
	
	for (var i = 0; i < 20; ++i) {
		var currentRow = row.cloneNode(false);
		for (var j = 0; j < 4; ++j) {
			var currentCell = cell.cloneNode(false);
			currentCell.innerHTML = (i + j).toString();
			currentRow.appendChild(currentCell);
		}
		tbody.appendChild(currentRow);
	}
	table.appendChild(tbody);
	testDiv.appendChild(table);
	
	//When: we build the dable
	dable.BuildAll(testDiv.id);
	
	//Then: the dable doesn't exist
	var dableHeader = document.getElementById(testDiv.id + '_header');
	equal(dable.Exists(), false);
});

function MakeSimpleTable(div) {
	var table =  document.createElement("table");
	var tbody = document.createElement("tbody");
	var thead = document.createElement("thead");
	var row = document.createElement("tr");
	var cell = document.createElement("td");
	var headCell = document.createElement("th");
	
	var headRow = row.cloneNode(false);
	for (var i = 0; i < 4; ++i) {
		var currentCell = headCell.cloneNode(false);
		currentCell.innerHTML = "Column " + i.toString();
		headRow.appendChild(currentCell);
	}
	thead.appendChild(headRow);
	table.appendChild(thead);
	
	for (var i = 0; i < 20; ++i) {
		var currentRow = row.cloneNode(false);
		for (var j = 0; j < 4; ++j) {
			var currentCell = cell.cloneNode(false);
			currentCell.innerHTML = (i + j).toString();
			currentRow.appendChild(currentCell);
		}
		tbody.appendChild(currentRow);
	}
	table.appendChild(tbody);
	div.appendChild(table);
}