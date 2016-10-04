var utils = require('./utils');

var Dable = function (tableOrId) {
    utils.mixin(this, Dable.defaults);
    this.BuildAll(tableOrId);
};

Dable.defaults = {
    id: '',
    columns: [],
    rows: [],
    rowObjects: [],
    visibleRows: [],
    visibleRowObjects: [],
    hiddenColumns: [],
    currentFilter: '',
    sortColumn: null,
    sortOrder: 'descending',
    minimumSearchLength: 1,
    columnData: [],
    pageNumber: 0,
    pageSize: 10,
    pageSizes: [10, 25, 50, 100],
    pagerSize: 0,
    pagerIncludeFirstAndLast: false,
    async: false,
    asyncData: {},
    asyncStart: 0,
    asyncLength: 1000,
    tfoothtml: '',
    //Basic Styling
    style: 'none',
    evenRowColor: '#E2E4FF',
    oddRowColor: 'white',
    //Classes
    dableClass: '',
    headerClass: '',
    tableClass: '',
    sortClass: 'table-sort',
    evenRowClass: 'table-row-even',
    oddRowClass: 'table-row-odd',
    footerClass: '',
    pagerButtonsClass: 'table-page'
};

Dable.prototype.RowCount = function () {
    return this.rows.length;
};

Dable.prototype.VisibleRowCount = function () {
    return this.visibleRows.length;
};

Dable.prototype.NumberOfPages = function () {
    var n = this.VisibleRowCount() / this.pageSize;
    return Math.ceil(n);
};

Dable.prototype.GetPageForRow = function (row) {
    return Math.ceil(row / this.pageSize);
};

Dable.prototype.asyncRequest = function (start, filter, sortColumn, ascending, callback) {//callback if async
    var dable = this;
    if (typeof callback == 'undefined') {
        callback = false;
    }

    var dableRequest = new XMLHttpRequest();
    dableRequest.onreadystatechange = function () {
        if (dableRequest.readyState == 4 && dableRequest.status == 200) {
            var data = JSON.parse(dableRequest.responseText);
            var actualData = data;
            if (data.rows === undefined) {
                actualData = JSON.parse(data.d);
            }

            var actualRows = actualData.rows;
            if (actualRows === undefined) { //need rows in return data
                console.error('Error, no rows in data from source');
                if (callback) {
                    return callback('Error, no rows in data from source');
                }

                return;
            } else if (actualData.includedRowCount === undefined) {   //need filtered row count in data
                console.error('Error, no includedRowCount in data from source');
                if (callback) {
                    return callback('Error, no includedRowCount in data from source');
                }

                return; 
            } else if (actualData.rowCount === undefined) {   //need filtered row count in data
                console.error('Error, no rowCount in data from source');
                if (callback) {
                    return callback('Error, no rowCount in data from source');
                }

                return; 
            }

            //create empty rows for the rest of the set
            actualRows.reverse();
            for (var i = 0; i < start; ++i) {
                actualRows.push([]);
            }

            actualRows.reverse();
            for (var i = (start + dable.asyncLength);
                 i < actualData.includedRowCount;
                 ++i) {
                actualRows.push([]);
            }

            //update
            dable.SetDataAsRows(actualRows);
            this.RowCount = function () { return actualData.rowCount; };
            this.VisibleRowCount = function () {
                return actualData.includedRowCount;
            };

            if (callback !== false &&
                    !!(callback &&
                        callback.call &&
                        callback.apply)) {
                callback();
            }
        }
    };

    dableRequest.open('POST', this.async, callback !== false);
    dableRequest.setRequestHeader('content-type', 'application/json');
    var requestObject = JSON.parse(JSON.stringify(this.asyncData));
    requestObject['start'] = start;
    this.asyncStart = start;
    requestObject['count'] = this.asyncLength;
    requestObject['filter'] = filter;
    requestObject['sortColumn'] = sortColumn === null ? -1 : sortColumn;
    requestObject['ascending'] = ascending;
    dableRequest.send(JSON.stringify(requestObject));
};

Dable.prototype.asyncReload = function (callback) {
    if (!callback) {
        callback = utils.bind(function(error) {
            if (error) {
                throw error;
            } else {
                this.UpdateDisplayedRows();
                this.UpdateStyle();
            }
        }, this);
    }

    var ascending = true;
    if (this.sortOrder.length > 3 &&
            this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
        ascending = false;
    }

    this.asyncRequest(this.asyncStart, this.currentFilter, this.sortColumn,
        ascending, callback);
};

Dable.prototype.searchFunc = function (event) {
    var searchBox = this;
    if (searchBox.id != this.id + '_search') {
        return false;
    }

    if (!searchBox.value ||
            searchBox.value.length < this.minimumSearchLength) {
        this.currentFilter = '';
    }
    else {
        var searchText = searchBox.value;
        this.currentFilter = searchText;
    }

    if (this.async) {
        var ascending = true;
        if (this.sortOrder.length > 3 &&
                this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
            ascending = false;
        }
        this.asyncRequest(
            0,
            this.currentFilter,
            this.sortColumn,
            ascending,
            utils.bind(function (error) {
                if (error) { throw error; }
                var body = document.getElementById(this.id + '_body');
                this.UpdateDisplayedRows(body);
                this.UpdateStyle(document.getElementById(this.id));
            }, this));
    } else {
        var includedRows = [];
        var includedRowObjects = [];
        if (this.currentFilter) {
            for (var i = 0; i < this.filters.length; ++i) {
                for (var j = 0; j < this.rows.length; ++j) {
                    if (includedRows.indexOf(this.rows[j]) > -1) {
                        continue;
                    }

                    for (var k = 0; k < this.rows[j].length; ++k) {
                        if (this.filters[i](
                                this.currentFilter,
                                this.rows[j][k])) {
                            includedRows.push(this.rows[j]);
                            includedRowObjects.push(this.rowObjects[j]);
                            break;
                        }
                    }
                }
            }
        } else {
            includedRows = this.rows;
            includedRowObjects = this.rowObjects;
        }

        this.visibleRows = includedRows;
        this.visibleRowObjects = includedRowObjects;
        var body = document.getElementById(this.id + '_body');
        this.UpdateDisplayedRows(body);
        this.UpdateStyle(document.getElementById(this.id));
    }
};

Dable.prototype.sortFunc = function (event) {
    var tag = this.tagName;
    //prevent sorting from some form elements
    if(tag != 'INPUT' &&
            tag != 'BUTTON' &&
            tag != 'SELECT' &&
            tag != 'TEXTAREA') {
        var columnCell = this;  //use this here, as the event.srcElement
                                                        //is probably a <span>
        var sortSpan = columnCell.querySelector('.' + this.sortClass);
        var columnTag = columnCell.getAttribute('data-tag');
        var columnIndex = -1;

        for (var i = 0; i < this.columnData.length; ++i) {
            if (this.columnData[i].Tag.toLowerCase() ==
                columnTag.toLowerCase()) {
                columnIndex = i;
                break;
            }
        }

        if (columnIndex == -1) {
            return false;
        }

        this.sortColumn = columnIndex;
        var ascend = false;
        if (this.sortOrder.length > 3 &&
                this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
            ascend = true;  //switching from descending to ascending
        }

        if (ascend) {
            this.sortOrder = 'asc';
            sortSpan.innerHTML = '^';
        } else {
            this.sortOrder = 'desc';
            sortSpan.innerHTML = 'v';
        }
        
        if (this.async) {
          this.asyncRequest(
                this.asyncStart,
                this.currentFilter,
                columnIndex,
                ascend,
                utils.bind(function (error) {
                    if (error) { throw error; }
                    this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
                    this.UpdateDisplayedRows(
                        document.getElementById(this.id + '_body'));
                    this.UpdateStyle();
                }, this));
        } else if (this.columnData[columnIndex].CustomSortFunc) {
            this.visibleRowObjects = this.columnData[columnIndex]
                .CustomSortFunc(columnIndex, ascend, this.visibleRowObjects);
            this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
            this.UpdateDisplayedRows(
                document.getElementById(this.id + '_body'));
            this.UpdateStyle();
        } else {
            this.visibleRowObjects = this
                .baseSort(columnIndex, ascend, this.visibleRowObjects);
            this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
            this.UpdateDisplayedRows(
                document.getElementById(this.id + '_body'));
            this.UpdateStyle();
        }
        
        
    }
};

Dable.prototype.baseSort = function (columnIndex, ascending, currentRowObjects) {
    var isInt = true;
    var isDate = true;
    var newRowObjects = currentRowObjects.slice(0);
    for (var i = 0; i < currentRowObjects.length; ++i) {
        //simple 2/21/2010 style dates parse cleanly to int, so we can drop out
        //if this won't parse
        if (parseInt(currentRowObjects[i].Row[columnIndex]).toString()
            .toLowerCase() == 'nan') {
            isInt = false;
        }
        //check for dates
        var dateString = currentRowObjects[i].Row[columnIndex].toString();
        var splitDate = dateString.split('/');
        if (splitDate.length != 3 ||
                (splitDate[0].length < 1 || splitDate[0].length > 2) ||
                (splitDate[1].length < 1 || splitDate[1].length > 2) ||
                (splitDate[2].length != 2 && splitDate[2].length != 4)) {
            isDate = false;
        }
    }

    if (isDate) {
        newRowObjects = newRowObjects.sort(function (a, b) {
            //default to US Date schema
            var splitDateA = a.Row[columnIndex].split('/');
            var yearA = splitDateA[2].toString();
            var monthA = splitDateA[0].toString();
            var dayA = splitDateA[1].toString();
            if (yearA.length == 2) {
                yearA = "20" + yearA;
                //don't guess, let them use 4 digits if they want 19xx
            }
            if (monthA.length == 1) {
                monthA = "0" + monthA;
            }
            if (dayA.length == 1) {
                dayA = "0" + dayA;
            }
            var yearMonthDayA = yearA + monthA + dayA;
            var splitDateB = b.Row[columnIndex].split('/');
            var yearB = splitDateB[2].toString();
            var monthB = splitDateB[0].toString();
            var dayB = splitDateB[1].toString();
            if (yearB.length == 2) {
                yearB = "20" + yearB;
                //don't guess, let them use 4 digits if they want 19xx
            }
            if (monthB.length == 1) {
                monthB = "0" + monthB;
            }
            if (dayB.length == 1) {
                dayB = "0" + dayB;
            }
            var yearMonthDayB = yearB + monthB + dayB;
            return parseInt(yearMonthDayA) - parseInt(yearMonthDayB);
        });
    }
    else if (isInt) {
        newRowObjects = newRowObjects.sort(function (a, b) {
            return parseInt(a.Row[columnIndex]) - parseInt(b.Row[columnIndex]);
        });
    }
    else {
        newRowObjects = newRowObjects.sort(function (a, b) {
            if (a.Row[columnIndex] > b.Row[columnIndex]) {
                return 1;
            }
            else if (a.Row[columnIndex] < b.Row[columnIndex]) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }

    if (!ascending) {
        newRowObjects = newRowObjects.reverse();
    }

    return newRowObjects;
};

Dable.prototype.filters = [
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

Dable.prototype.SetColumnNames = function (columnNames) {
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
};

Dable.prototype.DeleteRow = function(rowNumber) {
    for (var i = 0; i < this.rowObjects.length; ++i) {
        if (this.rowObjects[i].RowNumber == rowNumber) {
            this.rowObjects.splice(i, 1);
            this.rows = this.CreateRowsFromObjects(this.rowObjects);
            break;
        }
    }

    for (var i = 0; i < this.visibleRowObjects.length; ++i) {
        if (this.visibleRowObjects[i].RowNumber == rowNumber) {
            this.visibleRowObjects.splice(i, 1);
            this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects);
        }
    }

    var event = document.createEvent('KeyboardEvent');
    event.initEvent('keyup', true, true, window, false, false, false, false, 38, 38);
    document.querySelector('#' + this.id + '_search').dispatchEvent(event);
};

Dable.prototype.AddRow = function(row) {
    this.rows.push(row);
    this.rowObjects.push({ Row: row, RowNumber: this.rowObjects[this.rowObjects.length - 1].RowNumber + 1 });
    
    var event = document.createEvent('KeyboardEvent');
    event.initEvent('keyup', true, true, window, false, false, false, false, 38, 38);
    document.querySelector('#' + this.id + '_search').dispatchEvent(event);
};

Dable.prototype.CreateObjectsFromRows = function(rows) {
    var rowObjects = [];
    
    for (var i = 0; i < rows.length; ++i) {
        rowObjects.push({ Row: rows[i], RowNumber: i});
    }
    return rowObjects;
};

Dable.prototype.CreateRowsFromObjects = function(objects) {
    var rows = [];
    
    for (var i = 0; i < objects.length; ++i) {
        rows.push(objects[i].Row);
    }
    
    return rows;
};

Dable.prototype.SetDataAsColumns = function (columns) {
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
    }

    this.columns = columns;
    this.rows = tableRows;
    this.rowObjects = this.CreateObjectsFromRows(tableRows);
    this.visibleRows = this.rows.slice(0);
    this.visibleRowObjects = this.rowObjects.slice(0);
};

Dable.prototype.SetDataAsRows = function (rows) {
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

    this.columns = tableColumns;
    this.rows = rows;
    this.rowObjects = this.CreateObjectsFromRows(rows);
    this.visibleRows = rows.slice(0);
    this.visibleRowObjects = this.rowObjects.slice(0);
};

Dable.prototype.UpdateDisplayedRows = function (body) {
    if (!body) {
        body = document.getElementById(this.id + '_body');
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
    var pageDisplay = (this.pageNumber * this.pageSize);
    if (this.VisibleRowCount() <= pageDisplay) {
        //if this is too big, go back to page 1
        this.pageNumber = 0;
        pageDisplay = 0;
    }

    //get the display end id
    var length = pageDisplay + this.pageSize;
    if (pageDisplay + this.pageSize >= this.VisibleRowCount()) {
        //if this is too big, only show remaining rows
        length = this.VisibleRowCount();
    }

    //loop through the visible rows and display this page
    var rows = [];
    for (var i = pageDisplay; i < length; ++i) {
        var tempRow = row.cloneNode(false);
        if (i % 2 === 0) {
            tempRow.setAttribute('class', this.evenRowClass);
        }
        else {
            tempRow.setAttribute('class', this.oddRowClass);
        }

        for (var j = 0; j < this.visibleRows[i].length; ++j) {
            var tempCell = cell.cloneNode(false);
            var text = this.visibleRows[i][j];
            if (this.columnData[j].CustomRendering !== null) {
                text = this.columnData[j].CustomRendering(text, this.visibleRowObjects[i].RowNumber);
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

    var footer = document.getElementById(this.id + '_footer');
    this.UpdateFooter(footer);
    return body;
};

Dable.prototype.UpdateFooter = function (footer) {
    if (!footer) {
        return false;
    }
    var start = (this.pageNumber * this.pageSize) + 1;
    var end = start + this.pageSize - 1;
    if (end > this.VisibleRowCount()) {
        end = this.VisibleRowCount();
    }
    
    var showing = footer.querySelector('#' + this.id + '_showing');
    if (showing) {
        if (this.RowCount() === 0) {
            showing.innerHTML = "There are no entries";
        } else if (this.VisibleRowCount() === 0) {
            showing.innerHTML = "Showing 0 entries";
        } else {
            showing.innerHTML = "Showing " + start + " to " + end + " of " +
                (this.VisibleRowCount()) + " entries";
        }

        if (this.VisibleRowCount() != this.RowCount()) {
            showing.innerHTML += " (filtered from " + (this.RowCount()) +
                " total entries)";
        }
    }

    var right = footer.querySelector('#' + this.id + '_page_prev').parentElement;
    footer.replaceChild(this.BuildPager(), right);

    return footer;
};

Dable.prototype.UpdateStyle = function (tableDiv, style) {
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
      } else {
            if (style.toLowerCase() == 'jqueryui') {
                this.ApplyJqueryUIStyles(tableDiv);
            } else if (style.toLowerCase() == 'bootstrap') {
                this.ApplyBootstrapStyles(tableDiv);
            }
        }
    }
};

Dable.prototype.RemoveStyles = function (tableDiv) {
    tableDiv.removeAttribute('class');
    var children = tableDiv.children;
    for (var i = 0; i < children.length; ++i) {
        children[i].removeAttribute('class');
    }

    var header = children[0];
    var headerChildren = header.children;
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

    var sorts = tableDiv.querySelectorAll('.' + this.sortClass);
    for (var i = 0; i < sorts.length; ++i) {
        sorts[i].innerHTML = '';
        sorts[i].setAttribute('class', this.sortClass);
        if (i == this.sortColumn) {
            sorts[i].innerHTML = '&#9650;';
            if (this.sortOrder.toLowerCase().substr(0, 4) == 'desc') {
                sorts[i].innerHTML = '&#9660;';
            }
        }
    }
    
    var tbody = table.children[1];
    tbody.removeAttribute('class');
    
    var footer = children[2];
    var footerChildren = footer.children;
    var leftChildren = footerChildren[0].children;
    for (var i = 0; i < leftChildren.length; ++i) {
        leftChildren[i].removeAttribute('class');
    }

    var right = footer.querySelector('#' + this.id + '_page_prev')
        .parentElement;
    footer.replaceChild(this.BuildPager(), right);

    //basically, don't remove style from tfoot, in case user added it
    tableDiv.removeAttribute('style');
    RemoveStyle(children[0]);
    children[1].removeAttribute('style');
    RemoveStyle(children[2]);
    RemoveStyle(thead);
    RemoveStyle(tbody);
};

Dable.prototype.ApplyBaseStyles = function (tableDiv) {
    if (this.dableClass) {
        tableDiv.setAttribute('class', this.dableClass);
    }

    var table = tableDiv.querySelector('table');
    table.setAttribute('style', 'width: 100%;');
    if (this.tableClass) {
        table.setAttribute('class', this.tableClass);
    }
    
    var oddRows = tableDiv.querySelectorAll('.' + this.oddRowClass);
    for (var i = 0; i < oddRows.length; ++i) {
        oddRows[i].setAttribute('style', 'background-color: ' +
            this.oddRowColor);
    }

    var evenRows = tableDiv.querySelectorAll('.' + this.evenRowClass);
    for (var i = 0; i < evenRows.length; ++i) {
        evenRows[i].setAttribute('style', 'background-color: ' +
            this.evenRowColor);
    }
    var cells = tableDiv.querySelectorAll('tbody td');
    for (var i = 0; i < cells.length; ++i) {
        cells[i].setAttribute('style', 'padding: 5px;');
    }

    var headCells = tableDiv.querySelectorAll('th');
    for (var i = 0; i < headCells.length; ++i) {
        headCells[i].setAttribute('style', 'padding: 5px;');
        var headCellLeft = headCells[i].children[0];
        headCellLeft.setAttribute('style', 'float: left');
        if (this.columnData[i].CustomSortFunc !== false) {
            var headCellRight = headCells[i].children[1];
            headCellRight.setAttribute('style', 'float: right');
            var headCellClear = headCells[i].children[2];
            headCellClear.setAttribute('style', 'clear: both;');
            
            headCells[i].onmouseover = function () {
                this.setAttribute('style', 'padding: 5px; cursor: pointer');
            };
            headCells[i].onmouseout = function () {
                this.setAttribute('style', 'padding: 5px; cursor: default');
            };
        } else {
            var headCellClear = headCells[i].children[1];
            headCellClear.setAttribute('style', 'clear: both;');
        }
    }

    var header = tableDiv.querySelector('#' + this.id + '_header');
    header.setAttribute('style', 'padding: 5px;');
    if (this.headerClass) {
        header.setAttribute('class', this.headerClass);
    }

    var headLeft = header.children[0];
    headLeft.setAttribute('style', 'float: left;');
    var headRight = header.children[1];
    headRight.setAttribute('style', 'float: right;');
    var headClear = header.children[2];
    headClear.setAttribute('style', 'clear: both;');

    var footer = tableDiv.querySelector('#' + this.id + '_footer');
    footer.setAttribute('style', 'padding: 5px;');
    if (this.footerClass) {
        footer.setAttribute('class', this.footerClass);
    }

    var footLeft = footer.children[0];
    footLeft.setAttribute('style', 'float: left;');
    var footClear = footer.children[2];
    footClear.setAttribute('style', 'clear: both;');
    var footRight = footer.children[1];
    footRight.setAttribute('style', 'float: right; list-style: none;');
    var footRightItems = footRight.querySelectorAll('li');
    for (var i = 0; i < footRightItems.length; ++i) {
        footRightItems[i].setAttribute(
            'style',
            'display: inline; margin-right: 5px;');
    }
};

Dable.prototype.ApplyJqueryUIStyles = function (tableDiv) {
    if (!tableDiv) {
        return false;
    }

    var header = tableDiv.querySelector('#' + this.id + '_header');
    var footer = tableDiv.querySelector('#' + this.id + '_footer');
    var span = document.createElement('span');

    header.setAttribute(
        'class',
        'fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix');

    var headCells = tableDiv.querySelectorAll('th');
    for (var i = 0; i < headCells.length; ++i) {
        headCells[i].setAttribute('class', 'ui-state-default');
        var sort = headCells[i].querySelector('.' + this.sortClass);
        if (sort) {
            if (sort.innerText.charCodeAt(0) == 9660) {
                sort.setAttribute('class', this.sortClass +
                    ' ui-icon ui-icon-triangle-1-s');
            } else if (sort.innerText.charCodeAt(0) == 9650) {
                sort.setAttribute('class', this.sortClass +
                    ' ui-icon ui-icon-triangle-1-n');
            }

            sort.innerHTML = '';
        }
    }

    var pagerItems = footer.querySelectorAll('li');
    for (var i = 0; i < pagerItems.length; ++i) {
        RemoveStyle(pagerItems[i]);
    }

    footer.setAttribute(
        'class',
        'fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix');
    var pageClass = 'fg-button ui-button ui-state-default ui-corner-left ' +
        this.pagerButtonsClass;

    var pageButtons = footer.querySelectorAll('.' +
        this.pagerButtonsClass);
    for (var i = 0; i < pageButtons.length; ++i) {
        pageButtons[i].setAttribute('class', pageClass);
    }

    var pageLeft = footer.querySelector('#' + this.id + '_page_prev');
    pageLeft.innerHTML = '';
    var pageLeftSpan = span.cloneNode(false);
    pageLeftSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-w');
    pageLeft.appendChild(pageLeftSpan);
    if (pageLeft.getAttribute('disabled')) {
        pageLeft.setAttribute('class', pageClass + ' ui-state-disabled');
    }

    var pageRight = footer.querySelector('#' + this.id + '_page_next');
    pageRight.innerHTML = '';
    var pageRightSpan = span.cloneNode(false);
    pageRightSpan.setAttribute('class', 'ui-icon ui-icon-circle-arrow-e');
    pageRight.appendChild(pageRightSpan);
    if (pageRight.getAttribute('disabled')) {
        pageRight.setAttribute('class', pageClass + ' ui-state-disabled');
    }

    if (this.pagerIncludeFirstAndLast) {
        var pageFirst = footer.querySelector('#' + this.id +
                '_page_first');
        var pageLast = footer.querySelector('#' + this.id +
                '_page_last');
        pageFirst.innerHTML = '';
        var pageFirstSpan = span.cloneNode(false);
        pageFirstSpan.setAttribute(
                'class',
                'ui-icon ui-icon-arrowthickstop-1-w');
        pageFirst.appendChild(pageFirstSpan);
        pageLast.innerHTML = '';
        var pageLastSpan = span.cloneNode(false);
        pageLastSpan.setAttribute(
                'class',
                'ui-icon ui-icon-arrowthickstop-1-e');
        pageLast.appendChild(pageLastSpan);
    }
};

Dable.prototype.ApplyBootstrapStyles = function (tableDiv) {
    if (!tableDiv) {
        return false;
    }

    var div = document.createElement('div');
    var span = document.createElement('span');
    var header = tableDiv.querySelector('#' + this.id + '_header');
    var footer = tableDiv.querySelector('#' + this.id + '_footer');
    var table = tableDiv.querySelector('table');
    table.setAttribute('class', 'table table-bordered table-striped');
    table.setAttribute('style', 'width: 100%; margin-bottom: 0;');
    header.setAttribute('class', 'panel-heading');
    footer.setAttribute('class', 'panel-footer');
    tableDiv.setAttribute('class', 'panel panel-info');
    tableDiv.setAttribute('style', 'margin-bottom: 0;');

    var tableRows = table.querySelectorAll('tbody tr');
    for (var i = 0; i < tableRows.length; ++i) {    //remove manual striping
        tableRows[i].removeAttribute('style');
    }

    var headCells = table.querySelectorAll('th');
    for (var i = 0; i < headCells.length; ++i) {
        var sort = headCells[i].querySelector('.' + this.sortClass);
        if (sort) {
            if (sort.innerText.charCodeAt(0) == 9660) {
                sort.setAttribute('class', this.sortClass + ' glyphicon glyphicon-chevron-down');
            } else if (sort.innerText.charCodeAt(0) == 9650) {
                sort.setAttribute('class', this.sortClass + ' glyphicon glyphicon-chevron-up');
            }

            sort.innerHTML = '';
        }
    }

    var pageClass = 'btn btn-default ' + this.pagerButtonsClass;
    var pageLeft = footer.querySelector('#' + this.id + '_page_prev');
    var pageRight = footer.querySelector('#' + this.id + '_page_next');
    var pageParent = pageLeft.parentElement;
    
    var pagerItems = footer.querySelectorAll('li');
    for (var i = 0; i < pagerItems.length; ++i) {
        RemoveStyle(pagerItems[i]);
    }
    
    pageParent.setAttribute('class', 'btn-group');

    pageLeft.innerHTML = '';
    var pageLeftSpan = span.cloneNode(false);
    pageLeftSpan.setAttribute('class', 'glyphicon glyphicon-arrow-left');
    pageLeft.appendChild(pageLeftSpan);
    
    pageRight.innerHTML = '';
    var pageRightSpan = span.cloneNode(false);
    pageRightSpan.setAttribute('class', 'glyphicon glyphicon-arrow-right');
    pageRight.appendChild(pageRightSpan);

    if (this.pagerIncludeFirstAndLast) {
        var pageFirst = footer.querySelector('#' + this.id +
            '_page_first');
        var pageLast = footer.querySelector('#' + this.id +
            '_page_last');
        pageFirst.innerHTML = '';
        var pageFirstSpan = span.cloneNode(false);
        pageFirstSpan.setAttribute(
            'class',
            'glyphicon glyphicon-fast-backward');
        pageFirst.appendChild(pageFirstSpan);
        pageLast.innerHTML = '';
        var pageLastSpan = span.cloneNode(false);
        pageLastSpan.setAttribute(
            'class',
            'glyphicon glyphicon-fast-forward');
        pageLast.appendChild(pageLastSpan);
    }

    var pageButtons = footer.querySelectorAll('.' +
        this.pagerButtonsClass);
    for (var i = 0; i < pageButtons.length; ++i) {
            pageButtons[i].setAttribute('class', pageClass);
    }
};

Dable.prototype.CheckForTable = function (input) {//Check for existing table
    if (input) {
        if (input.nodeType && input.nodeName.toLowerCase() == 'div') {
            if (input.hasAttribute('id')) {
                this.id = input.getAttribute('id');
            }
            else {
                this.id = 'Dable1';
                input.setAttribute('id', 'Dable1');
            }
        } else if (window.jQuery &&
                input instanceof jQuery &&
                input[0].nodeType) {
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
};

Dable.prototype.GenerateTableFromHtml = function (tableNode) {
    if (!tableNode) {
        console.log("Dable Error: No HTML table to generate dable from");
        return false;
    }

    if (tableNode.hasAttribute('class')) {
        this.tableClass = tableNode.getAttribute('class');
    }

    var thead = tableNode.querySelector('thead');
    if (!thead) {
        console.log("Dable Error: No thead element in table");
        return false;
    }

    var headers = thead.querySelectorAll('tr th');
    var tfoot = tableNode.querySelector('tfoot');
    if (tfoot) {
        this.tfoothtml = tfoot.innerHTML;
    }

    var colNames = [];
    for (var i = 0; i < headers.length; ++i) {  //add our column names
        colNames.push(headers[i].innerHTML);
    }

    this.SetColumnNames(colNames);
    
    var rowsHtml = tableNode.querySelector('tbody').rows;
    var allRows = [];
    if (rowsHtml.length > 1 &&
            rowsHtml[0].hasAttribute('class') &&
            rowsHtml[1].hasAttribute('class')) {
        this.evenRowClass = rowsHtml[0].getAttribute('class');
        this.oddRowClass = rowsHtml[1].getAttribute('class');
    }

    for (var i = 0; i < rowsHtml.length; ++i) {
        allRows.push([]);
        var rowCells = rowsHtml[i].children;
        for (var j = 0; j < rowCells.length; ++j) {
            allRows[i].push(rowCells[j].innerHTML);
        }
    }

    this.SetDataAsRows(allRows);
    
    var parentDiv = tableNode.parentElement;
    parentDiv.innerHTML = '';
    
    return parentDiv.id;
};

Dable.prototype.Exists = function (tableDiv) {
    var result = false;
    
    var checkId = '';
    if (!tableDiv) {
        checkId = this.id;
    } else if (tableDiv &&
            tableDiv.nodeType &&
            tableDiv.nodeName.toLowerCase() == 'div') {
        checkId = tableDiv.id;
    } else if (tableDiv &&
            window.jQuery &&
            tableDiv instanceof jQuery &&
            tableDiv[0].nodeType) {
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
};

Dable.prototype.BuildAll = function (tableInput) {
    var tableId = this.CheckForTable(tableInput);
    if (!tableId) {
        return false;
    }

    var tableDiv = document.getElementById(tableId);
    if (!tableDiv) {
        return false;
    }

    if (this.async) {
        this.asyncRequest(
            0,
            '',
            -1,
            true,
            utils.bind(function (error) {
                if (error) { throw error; }
                tableDiv.innerHTML = '';

                var header = this.BuildHeader(tableDiv);
                var table = this.BuildTable(tableDiv);
                var footer = this.BuildFooter(tableDiv);

                tableDiv.appendChild(header);
                tableDiv.appendChild(table);
                tableDiv.appendChild(footer);

                this.UpdateStyle(tableDiv);
            }, this));
    } else {
        tableDiv.innerHTML = '';

        var header = this.BuildHeader(tableDiv);
        var table = this.BuildTable(tableDiv);
        var footer = this.BuildFooter(tableDiv);

        tableDiv.appendChild(header);
        tableDiv.appendChild(table);
        tableDiv.appendChild(footer);

        this.UpdateStyle(tableDiv);
    }
};

Dable.prototype.BuildHeader = function (tableDiv) {
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
    for (var i = 0; i < this.pageSizes.length; ++i) {
        var tempOption = option.cloneNode(false);
        tempOption.innerHTML = this.pageSizes[i];
        tempOption.setAttribute('value', this.pageSizes[i]);
        entryCount.appendChild(tempOption);
    }

    var dable = this;
    entryCount.onchange = function () {
        var entCnt = this;
        var value = entCnt.value;
        dable.pageSize = parseInt(value);
        dable.UpdateDisplayedRows(document.getElementById(dable.id + '_body'));
        dable.UpdateStyle(tableDiv);
    };

    var options = entryCount.querySelectorAll('option');
    for (var i = 0; i < options.length; ++i) {
        if (options[i].value == dable.pageSize) {
            options[i].selected = true;
            break;
        }
    }

    left.appendChild(entryCount);

    var right = div.cloneNode(false);
    var search = span.cloneNode(false);
    search.innerHTML = 'Search ';
    right.appendChild(search);
    var inputSearch = input.cloneNode(false);
    inputSearch.setAttribute('id', this.id + '_search');
    inputSearch.onkeyup = this.searchFunc;
    right.appendChild(inputSearch);

    var clear = div.cloneNode(false);

    var head = div.cloneNode(false);
    head.id = this.id + '_header';
    head.appendChild(left);
    head.appendChild(right);
    head.appendChild(clear);

    return head;
};

Dable.prototype.BuildTable = function (tableDiv) {
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
    for (var i = 0; i < this.columnData.length; ++i) {
        var tempCell = headCell.cloneNode(false);
        var nameSpan = span.cloneNode(false);
        nameSpan.innerHTML = this.columnData[i].FriendlyName + ' ';
        tempCell.appendChild(nameSpan);

        if (this.columnData[i].CustomSortFunc !== false) {
            var sortSpan = span.cloneNode(false);
            sortSpan.setAttribute('class', this.sortClass);
            sortSpan.innerHTML = 'v';
            tempCell.appendChild(sortSpan);
            tempCell.onclick = this.sortFunc;
        }

        var clear = span.cloneNode(false);
        tempCell.appendChild(clear);

        tempCell.setAttribute('data-tag', this.columnData[i].Tag);
        headRow.appendChild(tempCell);
    }
    head.appendChild(headRow);
    table.appendChild(head);
    
    this.visibleRows = this.rows.slice(0);
    this.visibleRowObjects = this.rowObjects.slice(0);
    body = this.UpdateDisplayedRows(body);
    body.id = this.id + '_body';
    table.appendChild(body);
    if (this.tfoothtml) {
        var foot = document.createElement('tfoot');
        foot.innerHTML = this.tfoothtml;
        table.appendChild(foot);
    }

    return table;
};

Dable.prototype.BuildFooter = function (tableDiv) {
    if (!tableDiv) {
        return false;
    }
    var div = document.createElement('div');
    var span = document.createElement('span');
    var button = document.createElement('button');

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
};

Dable.prototype.BuildPager = function () {
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var anchor = document.createElement('a');
    var right = ul.cloneNode(false);
    var dable = this;

    if (this.pagerIncludeFirstAndLast) {
        var pageFirst = li.cloneNode(false);
        var pageFirstAnchor = anchor.cloneNode(false);
        pageFirstAnchor.innerHTML = 'First';
        pageFirst.setAttribute('class', this.pagerButtonsClass);
        pageFirst.id = this.id + '_page_first';
        pageFirst.onclick = this.FirstPage;
        if (this.pageNumber <= 0) {
            pageFirst.setAttribute('disabled', 'disabled');
            pageFirst.onclick = utils.noop; //disable onclick
        }

        pageFirst.appendChild(pageFirstAnchor);
        right.appendChild(pageFirst);
    }

    var pageLeft = li.cloneNode(false);
    var pageLeftAnchor = anchor.cloneNode(false);
    pageLeftAnchor.innerHTML = 'Prev';
    pageLeft.setAttribute('class', this.pagerButtonsClass);
    pageLeft.id = this.id + '_page_prev';
    pageLeft.onclick = this.PreviousPage;
    if (this.pageNumber <= 0) {
        pageLeft.setAttribute('disabled', 'disabled');
        pageLeft.onclick = utils.noop;  //disable onclick
    }

    pageLeft.appendChild(pageLeftAnchor);
    right.appendChild(pageLeft);

    if (this.pagerSize > 0) {
        var start = this.pageNumber - parseInt(this.pagerSize / 2);
        var length = start + this.pagerSize;
        if (this.pageNumber <= (this.pagerSize / 2)) {
            // display from beginning
            length = this.pagerSize;
            start = 0;
            if (length > this.NumberOfPages()) {
                length = this.NumberOfPages();
            }   //very small tables
        } else if ((this.NumberOfPages() - this.pageNumber) <= (this.pagerSize / 2)) {
            //display the last five pages
            length = this.NumberOfPages();
            start = this.NumberOfPages() - this.pagerSize;
        }

        for (var i = start; i < length; ++i) {
            var liNode = li.cloneNode(false);
            var liNodeAnchor = anchor.cloneNode(false);
            liNodeAnchor.innerHTML = (i + 1).toString();
            var page = i;
            liNode.onclick = function(j) {
                return function() {
                    dable.GoToPage(j);
                };
            }(i);

            liNode.setAttribute('class', this.pagerButtonsClass);
            if (i == this.pageNumber) {
                liNode.setAttribute('disabled', 'disabled');
                liNode.onclick = utils.noop;    //disable onclick
            }

            liNode.appendChild(liNodeAnchor);
            right.appendChild(liNode);
        }
    }

    var pageRight = li.cloneNode(false);
    var pageRightAnchor = anchor.cloneNode(false);
    pageRightAnchor.innerHTML = 'Next';
    pageRight.setAttribute('class', this.pagerButtonsClass);
    pageRight.id = this.id + '_page_next';
    pageRight.onclick = utils.bind(this.NextPage, this);
    if (this.NumberOfPages() - 1 == this.pageNumber) {
        pageRight.setAttribute('disabled', 'disabled');
        pageRight.onclick = utils.noop; //disable onclick
    }

    pageRight.appendChild(pageRightAnchor);
    right.appendChild(pageRight);

    if (this.pagerIncludeFirstAndLast) {
        var pageLast = li.cloneNode(false);
        var pageLastAnchor = anchor.cloneNode(false);
        pageLastAnchor.innerHTML = 'Last';
        pageLast.setAttribute('class', this.pagerButtonsClass);
        pageLast.id = this.id + '_page_last';
        pageLast.onclick = utils.bind(this.LastPage, this);
        if (this.NumberOfPages() - 1 == this.pageNumber) {
            pageLast.setAttribute('disabled', 'disabled');
            pageLast.onclick = utils.noop;  //disable onclick
        }

        pageLast.appendChild(pageLastAnchor);
        right.appendChild(pageLast);
    }

    return right;
};

Dable.prototype.FirstPage = function() {
    this.pageNumber = 0;
    this.GoToPage(this.pageNumber);
};

Dable.prototype.PreviousPage = function() {
    this.pageNumber -= 1;
    this.GoToPage(this.pageNumber);
};

Dable.prototype.GoToPage = function (page) {
    this.pageNumber = page;
    if (this.async &&
            (this.asyncStart > this.pageNumber * this.pageSize ||
                this.pageNumber * this.pageSize >=
                this.asyncStart + this.asyncLength)) {
        var newStart = this.pageNumber * this.pageSize;
        var ascending = true;
        if (this.sortOrder.length > 3 && this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
            ascending = false;
        }

        this.asyncRequest(
            newStart,
            this.currentFilter,
            this.sortColumn,
            ascending,
            utils.bind(function (error) {
                if (error) { throw error; }
                this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
                this.UpdateStyle();
            }, this));
    } else {
        this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
        this.UpdateStyle();
    }
};

Dable.prototype.NextPage = function() {
    this.pageNumber += 1;
    this.GoToPage(this.pageNumber);
};

Dable.prototype.LastPage = function() {
    this.pageNumber = this.NumberOfPages() - 1;
    //page number is 0 based
    if (this.async &&
            (this.asyncStart > this.pageNumber * this.pageSize ||
                this.pageNumber * this.pageSize >
                this.asyncStart + this.asyncLength)) {
        var newStart = 0;
        var pages = (1000 / this.pageSize) - 1;
        //-1 for the page number and -1 to include current page
        if (this.pageNumber - pages > -1) {
            newStart = (this.pageNumber - pages) * this.pageSize;
        }

        var ascending = true;
        if (this.sortOrder.length > 3 &&
                this.sortOrder.substr(0, 4).toLowerCase() == 'desc') {
            ascending = false;
        }

        this.asyncRequest(
            newStart,
            this.currentFilter,
            this.sortColumn,
            ascending,
            utils.bind(function (error) {
                if (error) { throw error; }
                this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
                this.UpdateStyle();
            }, this));
    } else {
        this.UpdateDisplayedRows(document.getElementById(this.id + '_body'));
        this.UpdateStyle();
    }
};

function RemoveStyle(node) {
    node.removeAttribute('style');
    var childNodes = node.children;
    if (childNodes && childNodes.length > 0) {
        for (var i = 0; i < childNodes.length; ++i) {
            RemoveStyle(childNodes[i]);
        }
    }
}

module.exports = Dable;
