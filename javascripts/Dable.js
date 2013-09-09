!(function (define) {
	define([], function () {
		return function (tableId) {
			var $export = {
				id: tableId,
				columns: [],
				rows: [],
				visibleRows: [],
				hiddenColumns: [],
				sortColumn: null,
				sortOrder: 'descending',
				columnData: [],
				pageNumber: 0,
				pageSize: 10,
				pageSizes: [10,25,50,100],
				style: 'none',
				evenRowColor: '#E2E4FF',
				oddRowColor: 'white'
			};	
				
			$export.searchFunc = function (event) {
				var searchBox = this;
				if (searchBox.id != $export.id + '_search') {
					return false;
				}
				var searchText = searchBox.value;
				var includedRows = [];
				if (searchText) {
					for (var i = 0; i < $export.filters.length; ++i) {
						for (var j = 0; j < $export.rows.length; ++j) {
							if (ArrayContains(includedRows, $export.rows[j])) {
								continue;
							}
							for (var k = 0; k < $export.rows[j].length; ++k) {
								if ($export.filters[i](searchText, $export.rows[j][k])) {
									includedRows.push($export.rows[j]);
									break;
								}
							}
						}
					}
				}
				else {
					includedRows = $export.rows;
				}

				$export.visibleRows = includedRows;
				var body = document.getElementById($export.id + '_body');
				$export.UpdateDisplayedRows(body);
				$export.UpdateStyle(document.getElementById($export.id));
			};
			$export.sortFunc = function (event) {
				var columnCell = this;  //use this here, as the event.srcElement is probably a <span>
				var sortSpan = columnCell.querySelector('.table-sort');
				var columnTag = columnCell.getAttribute('data-tag');
				var columnIndex = -1;

				for (var i = 0; i < $export.columnData.length; ++i) {
					if ($export.columnData[i].Tag.toLowerCase() == columnTag.toLowerCase()) {
						columnIndex = i;
						break;
					}
				}
				if (columnIndex == -1) {
					return false;
				}
				
				$export.sortColumn = columnIndex;
				var ascend = false;
				if ($export.sortOrder.length > 3 && $export.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
					ascend = true;
				}
				if (ascend) {
					$export.sortOrder = 'asc';
					sortSpan.innerHTML = '^';
				}
				else {
					$export.sortOrder = 'desc';
					sortSpan.innerHTML = 'v';
				}

				if ($export.columnData[columnIndex].CustomSortFunc) {
					$export.visibleRows = $export.columnData[columnIndex].CustomSortFunc(columnIndex, ascend, $export.visibleRows);
				}
				else {
					$export.visibleRows = $export.baseSort(columnIndex, ascend, $export.visibleRows);
				}

				$export.UpdateDisplayedRows(document.getElementById($export.id + '_body'));
				$export.UpdateStyle();
			};
			
			$export.baseSort = function (columnIndex, ascending, currentRows) {
				var isInt = true;
				var newRows = currentRows.slice(0);
				for (var i = 0; i < currentRows.length; ++i) {
					if (parseInt(currentRows[i][columnIndex]).toString().toLowerCase() == 'nan') {
						isInt = false;
						break;
					}
				}

				if (isInt) {
					newRows = newRows.sort(function (a, b) {
						return parseInt(a[columnIndex]) - parseInt(b[columnIndex]);
					});
				}
				else {
					newRows = newRows.sort(function (a, b) {
						if (a[columnIndex] > b[columnIndex]) {
							return 1;
						}
						else if (a[columnIndex] < b[columnIndex]) {
							return -1;
						}
						else {
							return 0;
						}
					});
				}

				if (!ascending) {
					newRows = newRows.reverse();
				}

				return newRows;
			};
			$export.filters = [
				//PHRASES FILTER
				function (searchText, value) {
					searchText = searchText.toString().toLowerCase();
					value = value.toString().toLowerCase();
					var phrases = [];
					var regex = /\s*".*?"\s*/g;
					var match;
					while(match = regex.exec(searchText)) {
						var phrase = match[0].replace(/"/g, '').trim();
						phrases.push(phrase);
						searchText = searchText.replace(match[0], " ");
					}

					for (var i = 0; i < phrases.length; ++i) {
						if (value.indexOf(phrases[i]) > -1) {
							return true;
						}
					}
					return false;
				},
				//WORDS FILTER, IGNORING PHRASES
				function (searchText, value) {
					searchText = searchText.toString().toLowerCase();
					value = value.toString().toLowerCase();
					var regex = /\s*".*?"\s*/g;
					var match;
					while (match = regex.exec(searchText)) {
						searchText = searchText.replace(match[0], ' ');
					} //remove phrases
					var splitText = searchText.split(' ');
					for (var i = 0; i < splitText.length; ++i) {
						if (!splitText[i]) {  //clear out empty strings
							splitText.splice(i, 1);
							--i;
						}
					}

					for (var i = 0; i < splitText.length; ++i) {
						if (value.indexOf(splitText[i]) > -1) {
							return true;
						}
					}
					return false;
				}
			];

			$export.SetColumnNames = function (columnNames) {
				if (!columnNames) {
					return false;
				};
				
				for (var i = 0; i < columnNames.length; ++i) {
					if ($export.columnData.length <= i) {
						$export.columnData.push({
							Tag: columnNames[i],
							FriendlyName: columnNames[i],
							CustomSortFunc: null,
							CustomRendering: null
						});
					}
					else {
						$export.columnData[i].Name = columnNames[i];
					}
				}
			};
			$export.SetDataAsColumns = function (columns) {
				if (!columns) {
					return false;
				}

				var tableRows = [];
				for (var i = 0; i < columns.length; ++i) {
					while (tableRows.length < columns[i].length) {
						tableRows.push([]);
					}
					for (var j = 0; j < columns[i].length; ++j) {
						tableRows[j][i] = columns[i][j];
					}
				};

				$export.columns = columns;
				$export.rows = tableRows;
			};
			$export.SetDataAsRows = function (rows) {
				if (!rows) {
					return false;
				}

				var tableColumns = [];
				for (var i = 0; i < rows.length; ++i) {
					while (tableColumns.length < rows[i].length) {
						tableColumns.push([]);
					}
					for (var j = 0; j < rows[i].length; ++j) {
						tableColumns[j][i] = rows[i][j];
					}
				}

				$export.columns = tableColumns;
				$export.rows = rows;
			};

			$export.UpdateDisplayedRows = function (body) {
				if (!body) {
					body = document.getElementById($export.id + '_body');
					if (!body) {
						return false;
					}
				}
				var tempBody = body.cloneNode(false);
				while (tempBody.firstChild) {
				    tempBody.removeChild(tempBody.firstChild);
				}
				var displayedRows = [];
				var row = document.createElement('tr');
				var cell = document.createElement('td');
				//get the display start id
				var pageDisplay = ($export.pageNumber * $export.pageSize);
				if ($export.visibleRows.length <= pageDisplay) {    //if this is too big, go back to page 1
					$export.pageNumber = 0;
					pageDisplay = 0;
				}
				//get the display end id
				var length = pageDisplay + $export.pageSize;
				if (pageDisplay + $export.pageSize >= $export.visibleRows.length) { //if this is too big, only show remaining rows
					length = $export.visibleRows.length;
				}
			    //loop through the visible rows and display this page
				var rows = [];
				for (var i = pageDisplay; i < length; ++i) {
					var tempRow = row.cloneNode(false);
					if (i % 2 == 0) {
						tempRow.setAttribute('class', 'table-row-even');
					}
					else {
						tempRow.setAttribute('class', 'table-row-odd');
					}

					for (var j = 0; j < $export.visibleRows[i].length; ++j) {
						var tempCell = cell.cloneNode(false);
						var text = $export.visibleRows[i][j];
						if ($export.columnData[j].CustomRendering != null) {
							text = $export.columnData[j].CustomRendering(text);
						}
						tempCell.innerHTML = text;
						tempRow.appendChild(tempCell);
					}
					tempBody.appendChild(tempRow);
				}
				
				if (body.parentElement) {
				    body.parentElement.replaceChild(tempBody, body);
				}
				body = tempBody;

				var footer = document.getElementById($export.id + '_footer');
				$export.UpdateFooter(footer);
				return body;
			};
			$export.UpdateFooter = function (footer) {
				if (!footer) {
					return false;
				}
				var start = ($export.pageNumber * $export.pageSize) + 1;
				var end = start + $export.pageSize - 1;
				if (end > $export.visibleRows.length) {
					end = $export.visibleRows.length;
				}
				
				var showing = footer.querySelector('#' + $export.id + '_showing');
				if (showing) {
					showing.innerHTML = "Showing " + start + " to " + end + " of " + ($export.visibleRows.length) + " entries";
					if ($export.visibleRows.length != $export.rows.length) {
						showing.innerHTML += " (filtered from " + ($export.rows.length) + " total entries)";
					}
				}

				var pageLeft = footer.querySelector('#' + $export.id + '_page_prev');
				var pageRight = footer.querySelector('#' + $export.id + '_page_next');
				if (start == 1) {
					pageLeft.setAttribute('disabled', 'disabled');
				}
				else {
					pageLeft.removeAttribute('disabled');
				}
				if (end >= $export.visibleRows.length) {
					pageRight.setAttribute('disabled', 'disabled');
				}
				else {
					pageRight.removeAttribute('disabled');
				}

				return footer;
			};
			$export.UpdateStyle = function (tableDiv, style) {
				if (!tableDiv) {
					tableDiv = document.getElementById($export.id);
					if (!tableDiv) {
						return false;
					}
				}
				if (!style) {
					style = $export.style;
				}
				$export.style = style;

				//initial style cleanup
				$export.RemoveStyles(tableDiv);
				//base styles for 'none', the other styles sometimes build on these, so we apply them beforehand
				$export.ApplyBaseStyles(tableDiv);
				
				if (style.toLowerCase() == 'none') {
					return true;
				}
				else {
					if (style.toLowerCase() == 'jqueryui') {
						$export.ApplyJqueryUIStyles(tableDiv);
					}
					else if (style.toLowerCase() == 'bootstrap') {
						$export.ApplyBootstrapStyles(tableDiv);
					}
				}
			};
			
			$export.RemoveStyles = function (tableDiv) {
				tableDiv.removeAttribute('class');
				var children = tableDiv.children;
				for (var i = 0; i < children.length; ++i) {
					children[i].removeAttribute('class');
				}
				var headerChildren = children[0].children;
				for (var i = 0; i < headerChildren.length; ++i) {
					headerChildren[i].removeAttribute('class');
				}
				
				var table = children[1];
				var thead = table.children[0];
				thead.removeAttribute('class');
				thead.children[0].removeAttribute('class');
				var theadCells = thead.children[0].children;
				for (var i = 0; i < theadCells.length; ++i) {
					theadCells[i].removeAttribute('class');
				}
				var tbody = table.children[1];
				tbody.removeAttribute('class');
				
				var footerChildren = children[2].children;
				var leftChildren = footerChildren[0].children;
				for (var i = 0; i < leftChildren.length; ++i) {
					leftChildren[i].removeAttribute('class');
				}
				var rightChildren = footerChildren[1].children;
				for (var i = 0; i < rightChildren.length; ++i) {
					rightChildren[i].removeAttribute('class');
				}
			}
			$export.ApplyBaseStyles = function (tableDiv) {
				var table = tableDiv.querySelector('table');
				table.setAttribute('style', 'width: 100%;');
				
				var sorts = tableDiv.querySelectorAll('.table-sort');
				for (var i = 0; i < sorts.length; ++i) {
					sorts[i].setAttribute('class', 'table-sort');
					sorts[i].innerHTML = '^';
					if (i == $export.sortColumn) {
						if ($export.sortOrder.toLowerCase().substr(0, 4) == 'desc') {
							sorts[i].innerHTML = 'v';
						}
					}
				}
				var oddRows = tableDiv.querySelectorAll('.table-row-odd');
				for (var i = 0; i < oddRows.length; ++i) {
					oddRows[i].setAttribute('style', 'background-color: ' + $export.oddRowColor);
				}
				var evenRows = tableDiv.querySelectorAll('.table-row-even');
				for (var i = 0; i < evenRows.length; ++i) {
					evenRows[i].setAttribute('style', 'background-color: ' + $export.evenRowColor);
				}
				var cells = tableDiv.querySelectorAll('td, th');
				for (var i = 0; i < cells.length; ++i) {
					cells[i].setAttribute('style', 'padding: 5px;');
				}
				var header = tableDiv.querySelector('#' + $export.id + '_header');
				header.setAttribute('style', 'padding: 5px;');
				var footer = tableDiv.querySelector('#' + $export.id + '_footer');
				footer.setAttribute('style', 'padding: 5px;');
			}
			$export.ApplyJqueryUIStyles = function (tableDiv) {
				if (!tableDiv) {
					return false;
				}
				var header = tableDiv.querySelector('#' + $export.id + '_header');
				var footer = tableDiv.querySelector('#' + $export.id + '_footer');
				var span = document.createElement('span');

				header.setAttribute('class', 'fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix');

				var headCells = tableDiv.querySelectorAll('th');
				for (var i = 0; i < headCells.length; ++i) {
					headCells[i].setAttribute('class', 'ui-state-default');
					var sort = headCells[i].querySelector('.table-sort');
					if (sort.innerHTML == 'v') {
						sort.setAttribute('class', 'table-sort ui-icon ui-icon-triangle-1-s');
					}
					else {
						sort.setAttribute('class', 'table-sort ui-icon ui-icon-triangle-1-n');
					}
					sort.innerHTML = '';
				}

				footer.setAttribute('class', 'fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix');
				var pageClass = 'fg-button ui-button ui-state-default ui-corner-left';

				var pageLeft = footer.querySelector('#' + $export.id + '_page_prev');
				pageLeft.innerHTML = '';
				var pageLeftSpan = span.cloneNode(false);
				pageLeftSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-w');
				pageLeft.appendChild(pageLeftSpan);
				var pageLeftClass = pageClass;
				if (pageLeft.getAttribute('disabled')) {
					pageLeftClass += ' ui-state-disabled';
				}
				pageLeft.setAttribute('class', pageLeftClass);

				var pageRight = footer.querySelector('#' + $export.id + '_page_next');
				pageRight.innerHTML = '';
				var pageRightSpan = span.cloneNode(false);
				pageRightSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-e');
				pageRight.appendChild(pageRightSpan);
				var pageRightClass = pageClass;
				if (pageRight.getAttribute('disabled')) {
					pageRightClass += ' ui-state-disabled';
				}
				pageRight.setAttribute('class', pageRightClass);
			};
			$export.ApplyBootstrapStyles = function (tableDiv) {
				if (!tableDiv) {
					return false;
				}
				var div = document.createElement('div');
				var span = document.createElement('span');
				var header = tableDiv.querySelector('#' + $export.id + '_header');
				var footer = tableDiv.querySelector('#' + $export.id + '_footer');
				var table = tableDiv.querySelector('table');
				table.setAttribute('class', 'table table-bordered table-striped');
				table.setAttribute('style', 'width: 100%; margin-bottom: 0;');
				header.setAttribute('class', 'panel-heading');
				footer.setAttribute('class', 'panel-footer');
				tableDiv.setAttribute('class', 'panel panel-info');
				tableDiv.setAttribute('style', 'margin-bottom: 0;');

				var tableRows = table.querySelectorAll('.tbody tr');
				for (var i = 0; i < tableRows.length; ++i) {    //remove manual striping
					tableRows[i].removeAttribute('style');
				}

				var headCells = table.querySelectorAll('th');
				for (var i = 0; i < headCells.length; ++i) {
					var sort = headCells[i].querySelector('.table-sort');
					if (sort.innerHTML == 'v') {
						sort.setAttribute('class', 'table-sort glyphicon glyphicon-chevron-down');
					}
					else {
						sort.setAttribute('class', 'table-sort glyphicon glyphicon-chevron-up');
					}
					sort.innerHTML = '';
				}

				var pageClass = 'btn btn-default';
				var pageLeft = footer.querySelector('#' + $export.id + '_page_prev');
				var pageRight = footer.querySelector('#' + $export.id + '_page_next');
				var pageParent = pageLeft.parentElement;
				
				pageParent.setAttribute('class', 'btn-group');

				pageLeft.innerHTML = '';
				var pageLeftSpan = span.cloneNode(false);
				pageLeftSpan.setAttribute('class', 'glyphicon glyphicon-arrow-left');
				pageLeft.appendChild(pageLeftSpan);
				pageLeft.setAttribute('class', pageClass);
				
				pageRight.innerHTML = '';
				var pageRightSpan = span.cloneNode(false);
				pageRightSpan.setAttribute('class', 'glyphicon glyphicon-arrow-right');
				pageRight.appendChild(pageRightSpan);
				pageRight.setAttribute('class', pageClass);
			};
			
			$export.CheckForTable = function () {//Check for existing table
				var tableDiv = document.getElementById($export.id);
				if (tableDiv) {
					var table = tableDiv.querySelector("table");
					if (table) {
							var newTable = $export.GenerateTableFromHtml(table);	//Make it a Dable!
							$export.BuildAll(newTable);
							return true;
					}
				}
				return false;
			}
			$export.GenerateTableFromHtml = function (tableNode) {
				if (!tableNode) {
					return false;
				}
				var headers = tableNode.querySelectorAll("thead tr th");
				var colNames = [];
				for (var i = 0; i < headers.length; ++i) {	//add our column names
					colNames.push(headers[i].innerHTML);
				}
				$export.SetColumnNames(colNames);
				
				var rowsHtml = tableNode.querySelectorAll("tbody tr");
				var allRows = [];
				for (var i = 0; i < rowsHtml.length; ++i) {
					allRows.push([]);
					var rowCells = rowsHtml[i].children;
					for (var j = 0; j < rowCells.length; ++j) {
						allRows[i].push(rowCells[j].innerHTML);
					}
				}
				$export.SetDataAsRows(allRows);
				
				var parentDiv = tableNode.parentElement;
				parentDiv.innerHTML = '';
				
				return parentDiv.id;
			};
			
			$export.BuildAll = function (tableId) {
				if (!tableId) {
					tableId = $export.id;
				}
				$export.id = tableId;
				var tableDiv = document.getElementById(tableId);
				
				if (!tableDiv) {
					if (!$export.rows || $export.rows.length < 1) {
						if ($export.CheckForTable()) {
							return true;	//build table off of existing data
						}
					}
					else {
						return false;   //get the right element type
					}
				}
				else if (tableDiv.nodeName.toLowerCase() != 'div') {
					return false;
				}
				
				tableDiv.innerHTML = '';

				var header = $export.BuildHeader(tableDiv);
				var table = $export.BuildTable(tableDiv);
				var footer = $export.BuildFooter(tableDiv);

				tableDiv.appendChild(header);
				tableDiv.appendChild(table);
				tableDiv.appendChild(footer);

				$export.UpdateStyle(tableDiv);
			};
			$export.BuildHeader = function (tableDiv) {
				if (!tableDiv) {
					return false;
				}
				var div = document.createElement('div');
				var span = document.createElement('span');
				var select = document.createElement('select');
				var option = document.createElement('option');
				var input = document.createElement('input');

				var left = div.cloneNode(false);
				var show = span.cloneNode(false);
				show.innerHTML = 'Show ';
				left.appendChild(show);
				var entryCount = select.cloneNode(false);
				for (var i = 0; i < $export.pageSizes.length; ++i) {
					var tempOption = option.cloneNode(false);
					tempOption.innerHTML = $export.pageSizes[i];
					tempOption.setAttribute('value', $export.pageSizes[i]);
					entryCount.appendChild(tempOption);
				}
				entryCount.onchange = function () {
					var entCnt = this;
					var value = entCnt.value;
					$export.pageSize = parseInt(value);
					$export.UpdateDisplayedRows(document.getElementById($export.id + '_body'));
					$export.UpdateStyle(tableDiv);
				};
				left.appendChild(entryCount);
				left.setAttribute('style', 'float: left;');

				var right = div.cloneNode(false);
				var search = span.cloneNode(false);
				search.innerHTML = 'Search ';
				right.appendChild(search);
				var inputSearch = input.cloneNode(false);
				inputSearch.setAttribute('id', $export.id + '_search');
				inputSearch.onkeyup = $export.searchFunc;
				right.appendChild(inputSearch);
				right.setAttribute('style', 'float: right;');

				var clear = div.cloneNode(false);
				clear.setAttribute('style', 'clear: both;');

				var head = div.cloneNode(false);
				head.id = $export.id + '_header';
				head.appendChild(left);
				head.appendChild(right);
				head.appendChild(clear);

				return head;
			};
			$export.BuildTable = function (tableDiv) {
				if (!tableDiv) {
					return false;
				}
				//all the elements we need to build a neat table
				var table = document.createElement('table');
				var head = document.createElement('thead');
				var headCell = document.createElement('th');
				var body = document.createElement('tbody');
				var row = document.createElement('tr');
				var span = document.createElement('span');
				//The thead section contains the column names
				var headRow = row.cloneNode(false);
				headRow.onmouseover = function () {
					this.setAttribute('style', 'cursor: pointer');
				};
				headRow.onmouseout = function () {
					this.setAttribute('style', 'cursor: default');
				};
				for (var i = 0; i < $export.columnData.length; ++i) {
					var tempCell = headCell.cloneNode(false);
					var nameSpan = span.cloneNode(false);
					nameSpan.innerHTML = $export.columnData[i].FriendlyName + ' ';
					nameSpan.setAttribute('style', 'float: left');
					tempCell.appendChild(nameSpan);

					var sortSpan = span.cloneNode(false);
					sortSpan.setAttribute('class', 'table-sort');
					sortSpan.innerHTML = 'v';
					sortSpan.setAttribute('style', 'float: right');
					tempCell.appendChild(sortSpan);

					var clear = span.cloneNode(false);
					clear.setAttribute('style', 'clear: both;');
					tempCell.appendChild(clear);
					tempCell.setAttribute('data-tag', $export.columnData[i].Tag);
					tempCell.onclick = $export.sortFunc;
					headRow.appendChild(tempCell);
				}
				head.appendChild(headRow);
				table.appendChild(head);
				
				$export.visibleRows = $export.rows;
				body = $export.UpdateDisplayedRows(body);
				body.id = $export.id + '_body';
				table.appendChild(body);
				table.setAttribute('style', 'width: 100%');

				return table;
			};
			$export.BuildFooter = function (tableDiv) {
				if (!tableDiv) {
					return false;
				}
				var div = document.createElement('div');
				var span = document.createElement('span');
				var button = document.createElement('button');

				var left = div.cloneNode(false);
				var showing = span.cloneNode(false);
				showing.id = $export.id + '_showing';
				left.appendChild(showing);
				left.setAttribute('style', 'float: left;');

				var right = div.cloneNode(false);
				var pageLeft = button.cloneNode(false);
				pageLeft.innerHTML = 'Prev';
				pageLeft.setAttribute('type', 'button');
				pageLeft.setAttribute('class', 'table-page');
				pageLeft.id = $export.id + '_page_prev';
				pageLeft.onclick = function () {
					$export.pageNumber -= 1;
					$export.UpdateDisplayedRows(document.getElementById($export.id + '_body'));
					$export.UpdateStyle(tableDiv);
				};
				
				right.appendChild(pageLeft);
				var pageRight = button.cloneNode(false);
				pageRight.innerHTML = 'Next';
				pageRight.setAttribute('type', 'button');
				pageLeft.setAttribute('class', 'table-page');
				pageRight.id = $export.id + '_page_next';
				pageRight.onclick = function () {
					$export.pageNumber += 1;
					$export.UpdateDisplayedRows(document.getElementById($export.id + '_body'));
					$export.UpdateStyle();
				};
				right.appendChild(pageRight);
				right.setAttribute('style', 'float: right;');

				var clear = div.cloneNode(false);
				clear.setAttribute('style', 'clear: both;');

				var footer = div.cloneNode(false);
				footer.id = $export.id + '_footer';
				footer.innerHTML = '';
				footer.appendChild(left);
				footer.appendChild(right);
				footer.appendChild(clear);
				return $export.UpdateFooter(footer);
			};

			//Utility function
			function ArrayContains(array, object) {
				for (var i = 0; i < array.length; ++i) {
					if (array[i] === object) {
						return true;
					}
				}
				return false;
			}
			
			$export.CheckForTable();
			return $export;
		};
	});
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
	if (typeof module !== 'undefined' && module.exports) { //Node
		module.exports = factory();
	} else {
		window['Dable'] = factory();
	}
}));
