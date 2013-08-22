var Dable = function (tableId) {
    var tbl = this;

    tbl.id = tableId;
    tbl.columns = [];
    tbl.rows = [];
    tbl.visibleRows = [];
    tbl.displayedRows = [];
    tbl.hiddenColumns = [];
    tbl.sortColumn = null;
    tbl.sortOrder = 'descending';
    tbl.columnData = [];
    tbl.pageNumber = 0;
    tbl.pageSize = 10;
    tbl.pageSizes = [ 10, 25, 50, 100 ];
    tbl.style = 'none';
    tbl.evenRowColor = '#E2E4FF';
    tbl.oddRowColor = 'white';
    tbl.searchFunc = function (event) {
        if (!event) {
            return false;
        }
        
        var searchBox = event.srcElement;
        if (searchBox.id != tbl.id + '_search') {
            return false;
        }
        var searchText = searchBox.value;
        var includedRows = [];
        if (searchText) {
            for (var i = 0; i < tbl.filters.length; ++i) {
                for (var j = 0; j < tbl.rows.length; ++j) {
                    if (ArrayContains(includedRows, tbl.rows[j])) {
                        continue;
                    }
                    for (var k = 0; k < tbl.rows[j].length; ++k) {
                        if (tbl.filters[i](searchText, tbl.rows[j][k])) {
                            includedRows.push(tbl.rows[j]);
                            break;
                        }
                    }
                }
            }
        }
        else {
            includedRows = tbl.rows;
        }

        tbl.visibleRows = includedRows;
        var body = document.getElementById(tbl.id + '_body');
        tbl.UpdateDisplayedRows(body);
        tbl.UpdateStyle(document.getElementById(tbl.id));
    };
    tbl.sortFunc = function (event) {
        if (!event) {
            return false;
        }
        var columnCell = this;  //use this here, as the event.srcElement is probably a <span>
        var sortSpan = columnCell.querySelector('.table-sort');
        var columnTag = columnCell.getAttribute('data-tag');
        var columnIndex = -1;

        for (var i = 0; i < tbl.columnData.length; ++i) {
            if (tbl.columnData[i].Tag.toLowerCase() == columnTag.toLowerCase()) {
                columnIndex = i;
                break;
            }
        }
        if (columnIndex == -1) {
            return false;
        }

        var ascend = false;
        if (tbl.sortOrder.length > 3 && tbl.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
            ascend = true;
        }
        if (ascend) {
            tbl.sortOrder = 'asc';
            sortSpan.innerHTML = '^';
        }
        else {
            tbl.sortOrder = 'desc';
            sortSpan.innerHTML = 'v';
        }

        if (tbl.columnData[columnIndex].CustomSortFunc) {
            tbl.visibleRows = tbl.columnData[columnIndex].CustomSortFunc(columnIndex, ascend, tbl.visibleRows);
        }
        else {
            tbl.visibleRows = tbl.baseSort(columnIndex, ascend, tbl.visibleRows);
        }

        tbl.UpdateDisplayedRows(document.getElementById(tbl.id + '_body'));
        tbl.UpdateStyle();
    };
    tbl.baseSort = function (columnIndex, ascending, currentRows) {
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
    tbl.filters = [
        //PHRASES FILTER
        function (searchText, value) {
            searchText = searchText.toString().toLowerCase();
            value = value.toString().toLowerCase();
            var phrases = [];
            var regex = /\s*".*?"\s*/g;
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

    tbl.SetColumnNames = function (columnNames) {
        if (!columnNames) {
            return false;
        };
        
        for (var i = 0; i < columnNames.length; ++i) {
            if (tbl.columnData.length <= i) {
                tbl.columnData.push({
                    Tag: columnNames[i],
                    FriendlyName: columnNames[i],
                    CustomSortFunc: null,
                    CustomRendering: null
                });
            }
            else {
                tbl.columnData[i].Name = columnNames[i];
            }
        }
    };
    tbl.SetDataAsColumns = function (columns) {
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

        tbl.columns = columns;
        tbl.rows = tableRows;
    };
    tbl.SetDataAsRows = function (rows) {
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

        tbl.columns = tableColumns;
        tbl.rows = rows;
    };

    tbl.UpdateDisplayedRows = function (body) {
        if (!body) {
            body = document.getElementById(tbl.id + '_body');
            if (!body) {
                return false;
            }
        }
        body.innerHTML = '';
        var displayedRows = [];
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        //get the display start id
        var pageDisplay = (tbl.pageNumber * tbl.pageSize);
        if (tbl.visibleRows.length <= pageDisplay) {    //if this is too big, go back to page 1
            tbl.pageNumber = 0;
            pageDisplay = 0;
        }
        //get the display end id
        var length = pageDisplay + tbl.pageSize;
        if (pageDisplay + tbl.pageSize >= tbl.visibleRows.length) { //if this is too big, only show remaining rows
            length = tbl.visibleRows.length;
        }
        //loop through the visible rows and display this page
        for (var i = pageDisplay; i < length; ++i) {
            var tempRow = row.cloneNode(false);
            if (i % 2 == 0) {
                tempRow.setAttribute('class', 'table-row-even');
            }
            else {
                tempRow.setAttribute('class', 'table-row-odd');
            }

            for (var j = 0; j < tbl.visibleRows[i].length; ++j) {
                var tempCell = cell.cloneNode(false);
                var text = tbl.visibleRows[i][j];
                if (tbl.columnData[j].CustomRendering != null) {
                    text = tbl.columnData[j].CustomRendering(text);
                }
                tempCell.innerHTML = text;
                tempRow.appendChild(tempCell);
            }
            body.appendChild(tempRow);
        }

        var footer = document.getElementById(tbl.id + '_footer');
        tbl.UpdateFooter(footer);
        return body;
    };
    tbl.UpdateFooter = function (footer) {
        if (!footer) {
            return false;
        }
        var start = (tbl.pageNumber * tbl.pageSize) + 1;
        var end = start + tbl.pageSize - 1;
        if (end > tbl.visibleRows.length) {
            end = tbl.visibleRows.length;
        }
        
        var showing = footer.querySelector('#' + tbl.id + '_showing');
        if (showing) {
            showing.innerHTML = "Showing " + start + " to " + end + " of " + (tbl.visibleRows.length) + " entries";
            if (tbl.visibleRows.length != tbl.rows.length) {
                showing.innerHTML += " (filtered from " + (tbl.rows.length) + " total entries)";
            }
        }

        var pageLeft = footer.querySelector('#' + tbl.id + '_page_prev');
        var pageRight = footer.querySelector('#' + tbl.id + '_page_next');
        if (start == 1) {
            pageLeft.setAttribute('disabled', 'disabled');
        }
        else {
            pageLeft.removeAttribute('disabled');
        }
        if (end >= tbl.visibleRows.length) {
            pageRight.setAttribute('disabled', 'disabled');
        }
        else {
            pageRight.removeAttribute('disabled');
        }

        return footer;
    };
    tbl.UpdateStyle = function (tableDiv, style) {
        if (!tableDiv) {
            tableDiv = document.getElementById(tbl.id);
            if (!tableDiv) {
                return false;
            }
        }
        if (!style) {
            style = tbl.style;
        }
        tbl.style = style;

        var oddRows = tableDiv.querySelectorAll('.table-row-odd');
        for (var i = 0; i < oddRows.length; ++i) {
            oddRows[i].setAttribute('style', 'background-color: ' + tbl.oddRowColor);
        }
        var evenRows = tableDiv.querySelectorAll('.table-row-even');
        for (var i = 0; i < evenRows.length; ++i) {
            evenRows[i].setAttribute('style', 'background-color: ' + tbl.evenRowColor);
        }
        var cells = tableDiv.querySelectorAll('td');
        for (var i = 0; i < cells.length; ++i) {
            cells[i].setAttribute('style', 'padding: 5px;');
        }
        if (style.toLowerCase() == 'none') {
            return false;
        }

        else {
            if (style.toLowerCase() == 'jqueryui') {
                tbl.ApplyJqueryUIStyles(tableDiv);
            }
            else if (style.toLowerCase() == 'bootstrap') {
                tbl.ApplyBootstrapStyles(tableDiv);
            }
        }
    };

    tbl.ApplyJqueryUIStyles = function (tableDiv) {
        if (!tableDiv) {
            return false;
        }
        var header = tableDiv.querySelector('#' + tbl.id + '_header');
        var footer = tableDiv.querySelector('#' + tbl.id + '_footer');
        var span = document.createElement('span');

        header.setAttribute('class', 'fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix');
        header.setAttribute('style', 'padding: 5px;');

        var headCells = tableDiv.querySelectorAll('th');
        for (var i = 0; i < headCells.length; ++i) {
            headCells[i].setAttribute('class', 'ui-state-default');
            headCells[i].setAttribute('style', 'padding: 5px;');
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
        footer.setAttribute('style', 'padding: 5px;');
        var pageClass = 'fg-button ui-button ui-state-default ui-corner-left';

        var pageLeft = footer.querySelector('#' + tbl.id + '_page_prev');
        pageLeft.innerHTML = '';
        var pageLeftSpan = span.cloneNode(false);
        pageLeftSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-w');
        pageLeft.appendChild(pageLeftSpan);
        var pageLeftClass = pageClass;
        if (pageLeft.getAttribute('disabled')) {
            pageLeftClass += ' ui-state-disabled';
        }
        pageLeft.setAttribute('class', pageLeftClass);

        var pageRight = footer.querySelector('#' + tbl.id + '_page_next');
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
    tbl.ApplyBootstrapStyles = function (tableDiv) {
        if (!tableDiv) {
            return false;
        }
        var div = document.createElement('div');
        var span = document.createElement('span');
        var header = tableDiv.querySelector('#' + tbl.id + '_header');
        var footer = tableDiv.querySelector('#' + tbl.id + '_footer');
        var table = tableDiv.querySelector('table');
        table.setAttribute('class', 'table-striped');
        header.setAttribute('class', 'panel-heading');
        footer.setAttribute('class', 'panel-footer');
        tableDiv.setAttribute('class', 'panel panel-info');

        tableDiv.innerHTML = '';
        var tableBox = div.cloneNode(false);
        tableBox.setAttribute('class', 'panel-body');
        tableBox.appendChild(table);
        tableDiv.appendChild(header);
        tableDiv.appendChild(tableBox);
        tableDiv.appendChild(footer);

        var tableRows = table.querySelectorAll('.tbody tr');
        for (var i = 0; i < tableRows.length; ++i) {    //remove manual striping
            tableRows[i].removeAttribute('style');
        }

        var headCells = table.querySelectorAll('th');
        for (var i = 0; i < headCells.length; ++i) {
            headCells[i].setAttribute('style', 'border: 1px solid black; padding: 5px;');
            var sort = headCells[i].querySelector('.table-sort');
            if (sort.innerHTML == 'v') {
                sort.setAttribute('class', 'table-sort glyphicon glyphicon-chevron-up');
            }
            else {
                sort.setAttribute('class', 'table-sort glyphicon glyphicon-chevron-down');
            }
            sort.innerHTML = '';
        }

        var pageClass = 'btn btn-default';
        var pageLeft = footer.querySelector('#' + tbl.id + '_page_prev');
        var pageRight = footer.querySelector('#' + tbl.id + '_page_next');
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

    tbl.BuildAll = function (tableId) {
        if (!tableId) {
            tableId = tbl.id;
        }
        tbl.id = tableId;
        var tableDiv = document.getElementById(tableId);
        if (!tableDiv
            || tableDiv.nodeName.toLowerCase() != 'div') {
            return false;   //get the right element type
        }

        var header = tbl.BuildHeader(tableDiv);
        var table = tbl.BuildTable(tableDiv);
        var footer = tbl.BuildFooter(tableDiv);

        tableDiv.appendChild(header);
        tableDiv.appendChild(table);
        tableDiv.appendChild(footer);

        tbl.UpdateStyle(tableDiv);
    };
    tbl.BuildHeader = function (tableDiv) {
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
        for (var i = 0; i < tbl.pageSizes.length; ++i) {
            var tempOption = option.cloneNode(false);
            tempOption.innerHTML = tbl.pageSizes[i];
            tempOption.setAttribute('value', tbl.pageSizes[i]);
            entryCount.appendChild(tempOption);
        }
        entryCount.onchange = function () {
            var entCnt = this;
            var value = entCnt.value;
            tbl.pageSize = parseInt(value);
            tbl.UpdateDisplayedRows(document.getElementById(tbl.id + '_body'));
            tbl.UpdateStyle(tableDiv);
        };
        left.appendChild(entryCount);
        left.setAttribute('style', 'float: left;');

        var right = div.cloneNode(false);
        var search = span.cloneNode(false);
        search.innerHTML = 'Search ';
        right.appendChild(search);
        var inputSearch = input.cloneNode(false);
        inputSearch.setAttribute('id', tbl.id + '_search');
        inputSearch.onkeyup = tbl.searchFunc;
        right.appendChild(inputSearch);
        right.setAttribute('style', 'float: right;');

        var clear = div.cloneNode(false);
        clear.setAttribute('style', 'clear: both;');

        var head = div.cloneNode(false);
        head.id = tbl.id + '_header';
        head.appendChild(left);
        head.appendChild(right);
        head.appendChild(clear);

        return head;
    };
    tbl.BuildTable = function (tableDiv) {
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
        for (var i = 0; i < tbl.columnData.length; ++i) {
            var tempCell = headCell.cloneNode(false);
            var nameSpan = span.cloneNode(false);
            nameSpan.innerHTML = tbl.columnData[i].FriendlyName + ' ';
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
            tempCell.setAttribute('data-tag', tbl.columnData[i].Tag);
            tempCell.onclick = tbl.sortFunc;
            headRow.appendChild(tempCell);
        }
        head.appendChild(headRow);
        table.appendChild(head);
        
        tbl.visibleRows = tbl.rows;
        body = tbl.UpdateDisplayedRows(body);
        body.id = tbl.id + '_body';
        table.appendChild(body);
        table.setAttribute('style', 'width: 100%');

        return table;
    };
    tbl.BuildFooter = function (tableDiv) {
        if (!tableDiv) {
            return false;
        }
        var div = document.createElement('div');
        var span = document.createElement('span');
        var button = document.createElement('button');

        var left = div.cloneNode(false);
        var showing = span.cloneNode(false);
        showing.id = tbl.id + '_showing';
        left.appendChild(showing);
        left.setAttribute('style', 'float: left;');

        var right = div.cloneNode(false);
        var pageLeft = button.cloneNode(false);
        pageLeft.innerHTML = 'Prev';
        pageLeft.setAttribute('type', 'button');
        pageLeft.setAttribute('class', 'table-page');
        pageLeft.id = tbl.id + '_page_prev';
        pageLeft.onclick = function () {
            tbl.pageNumber -= 1;
            tbl.UpdateDisplayedRows(document.getElementById(tbl.id + '_body'));
            tbl.UpdateStyle(tableDiv);
        };
        
        right.appendChild(pageLeft);
        var pageRight = button.cloneNode(false);
        pageRight.innerHTML = 'Next';
        pageRight.setAttribute('type', 'button');
        pageLeft.setAttribute('class', 'table-page');
        pageRight.id = tbl.id + '_page_next';
        pageRight.onclick = function () {
            tbl.pageNumber += 1;
            tbl.UpdateDisplayedRows(document.getElementById(tbl.id + '_body'));
            tbl.UpdateStyle();
        };
        right.appendChild(pageRight);
        right.setAttribute('style', 'float: right;');

        var clear = div.cloneNode(false);
        clear.setAttribute('style', 'clear: both;');

        var footer = div.cloneNode(false);
        footer.id = tbl.id + '_footer';
        footer.innerHTML = '';
        footer.appendChild(left);
        footer.appendChild(right);
        footer.appendChild(clear);
        return tbl.UpdateFooter(footer);
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
};