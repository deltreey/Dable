/*! dable v1.2.1 (https://github.com/deltreey/Dable) */
(function() {
    var $$modules = {}, defineModule = function(name, exporter) {
        $$modules[name] = {
            exporter: exporter,
            ready: !1
        };
    }, require = function(name) {
        var m = $$modules[name];
        return m && !m.ready && (m.exports = {}, m.exporter.call(null, require, m, m.exports), 
        m.ready = !0), m && m.exports;
    };
    defineModule("./utils", function(require, module, exports) {
        exports.mixin = function(obj, mixins) {
            for (var keys = Object.keys(mixins), i = 0; i < keys.length; i++) {
                var key = keys[i];
                obj[key] = mixins[key];
            }
        }, exports.bind = function(fn, thisArg) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0);
                return fn.apply(thisArg, args);
            };
        }, exports.doSort = function(dable) {
            return function() {
                dable.sortFunc(this);
            };
        }, exports.doSearch = function(dable) {
            return function() {
                dable.searchFunc(this);
            };
        }, exports.noop = function() {};
    }), function(module) {
        function RemoveStyle(node) {
            node.removeAttribute("style");
            var childNodes = node.children;
            if (childNodes && childNodes.length > 0) for (var i = 0; i < childNodes.length; ++i) RemoveStyle(childNodes[i]);
        }
        var utils = require("./utils"), Dable = function(tableOrId) {
            utils.mixin(this, Dable.defaults), this.BuildAll(tableOrId);
        };
        Dable.defaults = {
            id: "",
            columns: [],
            rows: [],
            rowObjects: [],
            visibleRows: [],
            visibleRowObjects: [],
            hiddenColumns: [],
            currentFilter: "",
            sortColumn: null,
            sortOrder: "descending",
            minimumSearchLength: 1,
            columnData: [],
            pageNumber: 0,
            pageSize: 10,
            pageSizes: [ 10, 25, 50, 100 ],
            pagerSize: 0,
            pagerIncludeFirstAndLast: !1,
            async: !1,
            asyncData: {},
            asyncStart: 0,
            asyncLength: 1e3,
            tfoothtml: "",
            //Basic Styling
            style: "none",
            evenRowColor: "#E2E4FF",
            oddRowColor: "white",
            //Classes
            dableClass: "",
            headerClass: "",
            tableClass: "",
            sortClass: "table-sort",
            evenRowClass: "table-row-even",
            oddRowClass: "table-row-odd",
            footerClass: "",
            pagerButtonsClass: "table-page"
        }, Dable.prototype.RowCount = function() {
            return this.rows.length;
        }, Dable.prototype.VisibleRowCount = function() {
            return this.visibleRows.length;
        }, Dable.prototype.NumberOfPages = function() {
            var n = this.VisibleRowCount() / this.pageSize;
            return Math.ceil(n);
        }, Dable.prototype.GetPageForRow = function(row) {
            return Math.ceil(row / this.pageSize);
        }, Dable.prototype.asyncRequest = function(start, filter, sortColumn, ascending, callback) {
            //callback if async
            var dable = this;
            "undefined" == typeof callback && (callback = !1);
            var dableRequest = new XMLHttpRequest();
            dableRequest.onreadystatechange = function() {
                if (4 == dableRequest.readyState && 200 == dableRequest.status) {
                    var data = JSON.parse(dableRequest.responseText), actualData = data;
                    void 0 === data.rows && (actualData = JSON.parse(data.d));
                    var actualRows = actualData.rows;
                    if (void 0 === actualRows) {
                        if (//need rows in return data
                        console.error("Error, no rows in data from source"), callback) return callback("Error, no rows in data from source");
                        return;
                    }
                    if (void 0 === actualData.includedRowCount) {
                        if (//need filtered row count in data
                        console.error("Error, no includedRowCount in data from source"), callback) return callback("Error, no includedRowCount in data from source");
                        return;
                    }
                    if (void 0 === actualData.rowCount) {
                        if (//need filtered row count in data
                        console.error("Error, no rowCount in data from source"), callback) return callback("Error, no rowCount in data from source");
                        return;
                    }
                    //create empty rows for the rest of the set
                    actualRows.reverse();
                    for (var i = 0; i < start; ++i) actualRows.push([]);
                    actualRows.reverse();
                    for (var i = start + dable.asyncLength; i < actualData.includedRowCount; ++i) actualRows.push([]);
                    //update
                    dable.SetDataAsRows(actualRows), this.RowCount = function() {
                        return actualData.rowCount;
                    }, this.VisibleRowCount = function() {
                        return actualData.includedRowCount;
                    }, callback !== !1 && callback && callback.call && callback.apply && callback();
                }
            }, dableRequest.open("POST", this.async, callback !== !1), dableRequest.setRequestHeader("content-type", "application/json");
            var requestObject = JSON.parse(JSON.stringify(this.asyncData));
            requestObject.start = start, this.asyncStart = start, requestObject.count = this.asyncLength, 
            requestObject.filter = filter, requestObject.sortColumn = null === sortColumn ? -1 : sortColumn, 
            requestObject.ascending = ascending, dableRequest.send(JSON.stringify(requestObject));
        }, Dable.prototype.asyncReload = function(callback) {
            callback || (callback = utils.bind(function(error) {
                if (error) throw error;
                this.UpdateDisplayedRows(), this.UpdateStyle();
            }, this));
            var ascending = !0;
            this.sortOrder.length > 3 && "desc" == this.sortOrder.substr(0, 4).toLowerCase() && (ascending = !1), 
            this.asyncRequest(this.asyncStart, this.currentFilter, this.sortColumn, ascending, callback);
        }, Dable.prototype.searchFunc = function(searchBox) {
            if (searchBox.id != this.id + "_search") return !1;
            if (!searchBox.value || searchBox.value.length < this.minimumSearchLength) this.currentFilter = ""; else {
                var searchText = searchBox.value;
                this.currentFilter = searchText;
            }
            if (this.async) {
                var ascending = !0;
                this.sortOrder.length > 3 && "desc" == this.sortOrder.substr(0, 4).toLowerCase() && (ascending = !1), 
                this.asyncRequest(0, this.currentFilter, this.sortColumn, ascending, utils.bind(function(error) {
                    if (error) throw error;
                    var body = document.getElementById(this.id + "_body");
                    this.UpdateDisplayedRows(body), this.UpdateStyle(document.getElementById(this.id));
                }, this));
            } else {
                var includedRows = [], includedRowObjects = [];
                if (this.currentFilter) {
                    for (var i = 0; i < this.filters.length; ++i) for (var j = 0; j < this.rows.length; ++j) if (!(includedRows.indexOf(this.rows[j]) > -1)) for (var k = 0; k < this.rows[j].length; ++k) if (this.filters[i](this.currentFilter, this.rows[j][k])) {
                        includedRows.push(this.rows[j]), includedRowObjects.push(this.rowObjects[j]);
                        break;
                    }
                } else includedRows = this.rows, includedRowObjects = this.rowObjects;
                this.visibleRows = includedRows, this.visibleRowObjects = includedRowObjects;
                var body = document.getElementById(this.id + "_body");
                this.UpdateDisplayedRows(body), this.UpdateStyle(document.getElementById(this.id));
            }
        }, Dable.prototype.sortFunc = function(columnCell) {
            var tag = columnCell.tagName;
            //prevent sorting from some form elements
            if ("INPUT" != tag && "BUTTON" != tag && "SELECT" != tag && "TEXTAREA" != tag) {
                for (var sortSpan = columnCell.querySelector("." + this.sortClass), columnTag = columnCell.getAttribute("data-tag"), columnIndex = -1, i = 0; i < this.columnData.length; ++i) if (this.columnData[i].Tag.toLowerCase() == columnTag.toLowerCase()) {
                    columnIndex = i;
                    break;
                }
                if (columnIndex == -1) return !1;
                this.sortColumn = columnIndex;
                var ascend = !1;
                this.sortOrder.length > 3 && "desc" == this.sortOrder.substr(0, 4).toLowerCase() && (ascend = !0), 
                ascend ? (this.sortOrder = "asc", sortSpan.innerHTML = "^") : (this.sortOrder = "desc", 
                sortSpan.innerHTML = "v"), this.async ? this.asyncRequest(this.asyncStart, this.currentFilter, columnIndex, ascend, utils.bind(function(error) {
                    if (error) throw error;
                    this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects), this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), 
                    this.UpdateStyle();
                }, this)) : this.columnData[columnIndex].CustomSortFunc ? (this.visibleRowObjects = this.columnData[columnIndex].CustomSortFunc(columnIndex, ascend, this.visibleRowObjects), 
                this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects), this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), 
                this.UpdateStyle()) : (this.visibleRowObjects = this.baseSort(columnIndex, ascend, this.visibleRowObjects), 
                this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects), this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), 
                this.UpdateStyle());
            }
        }, Dable.prototype.baseSort = function(columnIndex, ascending, currentRowObjects) {
            for (var isInt = !0, isDate = !0, newRowObjects = currentRowObjects.slice(0), i = 0; i < currentRowObjects.length; ++i) {
                //simple 2/21/2010 style dates parse cleanly to int, so we can drop out
                //if this won't parse
                "nan" == parseInt(currentRowObjects[i].Row[columnIndex]).toString().toLowerCase() && (isInt = !1);
                //check for dates
                var dateString = currentRowObjects[i].Row[columnIndex].toString(), splitDate = dateString.split("/");
                (3 != splitDate.length || splitDate[0].length < 1 || splitDate[0].length > 2 || splitDate[1].length < 1 || splitDate[1].length > 2 || 2 != splitDate[2].length && 4 != splitDate[2].length) && (isDate = !1);
            }
            return newRowObjects = isDate ? newRowObjects.sort(function(a, b) {
                //default to US Date schema
                var splitDateA = a.Row[columnIndex].split("/"), yearA = splitDateA[2].toString(), monthA = splitDateA[0].toString(), dayA = splitDateA[1].toString();
                2 == yearA.length && (yearA = "20" + yearA), 1 == monthA.length && (monthA = "0" + monthA), 
                1 == dayA.length && (dayA = "0" + dayA);
                var yearMonthDayA = yearA + monthA + dayA, splitDateB = b.Row[columnIndex].split("/"), yearB = splitDateB[2].toString(), monthB = splitDateB[0].toString(), dayB = splitDateB[1].toString();
                2 == yearB.length && (yearB = "20" + yearB), 1 == monthB.length && (monthB = "0" + monthB), 
                1 == dayB.length && (dayB = "0" + dayB);
                var yearMonthDayB = yearB + monthB + dayB;
                return parseInt(yearMonthDayA) - parseInt(yearMonthDayB);
            }) : isInt ? newRowObjects.sort(function(a, b) {
                return parseInt(a.Row[columnIndex]) - parseInt(b.Row[columnIndex]);
            }) : newRowObjects.sort(function(a, b) {
                return a.Row[columnIndex] > b.Row[columnIndex] ? 1 : a.Row[columnIndex] < b.Row[columnIndex] ? -1 : 0;
            }), ascending || (newRowObjects = newRowObjects.reverse()), newRowObjects;
        }, Dable.prototype.filters = [ //PHRASES FILTER
        function(searchText, value) {
            searchText = searchText.toString().toLowerCase(), value = value.toString().toLowerCase();
            for (var match, phrases = [], regex = /\s*".*?"\s*/g; match = regex.exec(searchText); ) {
                var phrase = match[0].replace(/"/g, "").trim();
                phrases.push(phrase), searchText = searchText.replace(match[0], " ");
            }
            for (var i = 0; i < phrases.length; ++i) if (value.indexOf(phrases[i]) > -1) return !0;
            return !1;
        }, //WORDS FILTER, IGNORING PHRASES
        function(searchText, value) {
            searchText = searchText.toString().toLowerCase(), value = value.toString().toLowerCase();
            for (var match, regex = /\s*".*?"\s*/g; match = regex.exec(searchText); ) searchText = searchText.replace(match[0], " ");
            for (var splitText = searchText.split(" "), i = 0; i < splitText.length; ++i) splitText[i] || (//clear out empty strings
            splitText.splice(i, 1), --i);
            for (var i = 0; i < splitText.length; ++i) if (value.indexOf(splitText[i]) > -1) return !0;
            return !1;
        } ], Dable.prototype.SetColumnNames = function(columnNames) {
            if (!columnNames) return !1;
            for (var i = 0; i < columnNames.length; ++i) this.columnData.length <= i ? this.columnData.push({
                Tag: columnNames[i],
                FriendlyName: columnNames[i],
                CustomSortFunc: null,
                CustomRendering: null
            }) : this.columnData[i].Name = columnNames[i];
        }, Dable.prototype.DeleteRow = function(rowNumber) {
            for (var i = 0; i < this.rowObjects.length; ++i) if (this.rowObjects[i].RowNumber == rowNumber) {
                this.rowObjects.splice(i, 1), this.rows = this.CreateRowsFromObjects(this.rowObjects);
                break;
            }
            for (var i = 0; i < this.visibleRowObjects.length; ++i) this.visibleRowObjects[i].RowNumber == rowNumber && (this.visibleRowObjects.splice(i, 1), 
            this.visibleRows = this.CreateRowsFromObjects(this.visibleRowObjects));
            var event = document.createEvent("KeyboardEvent");
            event.initEvent("keyup", !0, !0, window, !1, !1, !1, !1, 38, 38), document.querySelector("#" + this.id + "_search").dispatchEvent(event);
        }, Dable.prototype.AddRow = function(row) {
            this.rows.push(row), this.rowObjects.push({
                Row: row,
                RowNumber: this.rowObjects[this.rowObjects.length - 1].RowNumber + 1
            });
            var event = document.createEvent("KeyboardEvent");
            event.initEvent("keyup", !0, !0, window, !1, !1, !1, !1, 38, 38), document.querySelector("#" + this.id + "_search").dispatchEvent(event);
        }, Dable.prototype.CreateObjectsFromRows = function(rows) {
            for (var rowObjects = [], i = 0; i < rows.length; ++i) rowObjects.push({
                Row: rows[i],
                RowNumber: i
            });
            return rowObjects;
        }, Dable.prototype.CreateRowsFromObjects = function(objects) {
            for (var rows = [], i = 0; i < objects.length; ++i) rows.push(objects[i].Row);
            return rows;
        }, Dable.prototype.SetDataAsColumns = function(columns) {
            if (!columns) return !1;
            for (var tableRows = [], i = 0; i < columns.length; ++i) {
                for (;tableRows.length < columns[i].length; ) tableRows.push([]);
                for (var j = 0; j < columns[i].length; ++j) tableRows[j][i] = columns[i][j];
            }
            this.columns = columns, this.rows = tableRows, this.rowObjects = this.CreateObjectsFromRows(tableRows), 
            this.visibleRows = this.rows.slice(0), this.visibleRowObjects = this.rowObjects.slice(0);
        }, Dable.prototype.SetDataAsRows = function(rows) {
            if (!rows) return !1;
            for (var tableColumns = [], i = 0; i < rows.length; ++i) {
                for (;tableColumns.length < rows[i].length; ) tableColumns.push([]);
                for (var j = 0; j < rows[i].length; ++j) tableColumns[j][i] = rows[i][j];
            }
            this.columns = tableColumns, this.rows = rows, this.rowObjects = this.CreateObjectsFromRows(rows), 
            this.visibleRows = rows.slice(0), this.visibleRowObjects = this.rowObjects.slice(0);
        }, Dable.prototype.UpdateDisplayedRows = function(body) {
            if (!body && (body = document.getElementById(this.id + "_body"), !body)) return !1;
            for (var tempBody = body.cloneNode(!1); tempBody.firstChild; ) tempBody.removeChild(tempBody.firstChild);
            var row = document.createElement("tr"), cell = document.createElement("td"), pageDisplay = this.pageNumber * this.pageSize;
            this.VisibleRowCount() <= pageDisplay && (//if this is too big, go back to page 1
            this.pageNumber = 0, pageDisplay = 0);
            //get the display end id
            var length = pageDisplay + this.pageSize;
            pageDisplay + this.pageSize >= this.VisibleRowCount() && (//if this is too big, only show remaining rows
            length = this.VisibleRowCount());
            for (var i = pageDisplay; i < length; ++i) {
                var tempRow = row.cloneNode(!1);
                i % 2 === 0 ? tempRow.setAttribute("class", this.evenRowClass) : tempRow.setAttribute("class", this.oddRowClass);
                for (var j = 0; j < this.visibleRows[i].length; ++j) {
                    var tempCell = cell.cloneNode(!1), text = this.visibleRows[i][j];
                    null !== this.columnData[j].CustomRendering && (text = this.columnData[j].CustomRendering(text, this.visibleRowObjects[i].RowNumber)), 
                    tempCell.innerHTML = text, tempRow.appendChild(tempCell);
                }
                tempBody.appendChild(tempRow);
            }
            body.parentElement && body.parentElement.replaceChild(tempBody, body), body = tempBody;
            var footer = document.getElementById(this.id + "_footer");
            return this.UpdateFooter(footer), body;
        }, Dable.prototype.UpdateFooter = function(footer) {
            if (!footer) return !1;
            var start = this.pageNumber * this.pageSize + 1, end = start + this.pageSize - 1;
            end > this.VisibleRowCount() && (end = this.VisibleRowCount());
            var showing = footer.querySelector("#" + this.id + "_showing");
            showing && (0 === this.RowCount() ? showing.innerHTML = "There are no entries" : 0 === this.VisibleRowCount() ? showing.innerHTML = "Showing 0 entries" : showing.innerHTML = "Showing " + start + " to " + end + " of " + this.VisibleRowCount() + " entries", 
            this.VisibleRowCount() != this.RowCount() && (showing.innerHTML += " (filtered from " + this.RowCount() + " total entries)"));
            var right = footer.querySelector("#" + this.id + "_page_prev").parentElement;
            return footer.replaceChild(this.BuildPager(), right), footer;
        }, Dable.prototype.UpdateStyle = function(tableDiv, style) {
            if (!tableDiv && (tableDiv = document.getElementById(this.id), !tableDiv)) return !1;
            //clear is a style option to completely avoid any styling so you can
            //roll your own
            if (style || (style = this.style), this.style = style, //initial style cleanup
            this.RemoveStyles(tableDiv), "clear" != style.toLowerCase()) {
                if (//base styles for 'none', the other styles sometimes build on these
                //so we apply them beforehand
                this.ApplyBaseStyles(tableDiv), "none" == style.toLowerCase()) return !0;
                "jqueryui" == style.toLowerCase() ? this.ApplyJqueryUIStyles(tableDiv) : "bootstrap" == style.toLowerCase() && this.ApplyBootstrapStyles(tableDiv);
            }
        }, Dable.prototype.RemoveStyles = function(tableDiv) {
            tableDiv.removeAttribute("class");
            for (var children = tableDiv.children, i = 0; i < children.length; ++i) children[i].removeAttribute("class");
            for (var header = children[0], headerChildren = header.children, i = 0; i < headerChildren.length; ++i) headerChildren[i].removeAttribute("class");
            var table = children[1], thead = table.children[0];
            thead.removeAttribute("class"), thead.children[0].removeAttribute("class");
            for (var theadCells = thead.children[0].children, i = 0; i < theadCells.length; ++i) theadCells[i].removeAttribute("class");
            for (var sorts = tableDiv.querySelectorAll("." + this.sortClass), i = 0; i < sorts.length; ++i) sorts[i].innerHTML = "", 
            sorts[i].setAttribute("class", this.sortClass), i == this.sortColumn && (sorts[i].innerHTML = "&#9650;", 
            "desc" == this.sortOrder.toLowerCase().substr(0, 4) && (sorts[i].innerHTML = "&#9660;"));
            var tbody = table.children[1];
            tbody.removeAttribute("class");
            for (var footer = children[2], footerChildren = footer.children, leftChildren = footerChildren[0].children, i = 0; i < leftChildren.length; ++i) leftChildren[i].removeAttribute("class");
            var right = footer.querySelector("#" + this.id + "_page_prev").parentElement;
            footer.replaceChild(this.BuildPager(), right), //basically, don't remove style from tfoot, in case user added it
            tableDiv.removeAttribute("style"), RemoveStyle(children[0]), children[1].removeAttribute("style"), 
            RemoveStyle(children[2]), RemoveStyle(thead), RemoveStyle(tbody);
        }, Dable.prototype.ApplyBaseStyles = function(tableDiv) {
            this.dableClass && tableDiv.setAttribute("class", this.dableClass);
            var table = tableDiv.querySelector("table");
            table.setAttribute("style", "width: 100%;"), this.tableClass && table.setAttribute("class", this.tableClass);
            for (var oddRows = tableDiv.querySelectorAll("." + this.oddRowClass), i = 0; i < oddRows.length; ++i) oddRows[i].setAttribute("style", "background-color: " + this.oddRowColor);
            for (var evenRows = tableDiv.querySelectorAll("." + this.evenRowClass), i = 0; i < evenRows.length; ++i) evenRows[i].setAttribute("style", "background-color: " + this.evenRowColor);
            for (var cells = tableDiv.querySelectorAll("tbody td"), i = 0; i < cells.length; ++i) cells[i].setAttribute("style", "padding: 5px;");
            for (var headCells = tableDiv.querySelectorAll("th"), i = 0; i < headCells.length; ++i) {
                headCells[i].setAttribute("style", "padding: 5px;");
                var headCellLeft = headCells[i].children[0];
                if (headCellLeft.setAttribute("style", "float: left"), this.columnData[i].CustomSortFunc !== !1) {
                    var headCellRight = headCells[i].children[1];
                    headCellRight.setAttribute("style", "float: right");
                    var headCellClear = headCells[i].children[2];
                    headCellClear.setAttribute("style", "clear: both;"), headCells[i].onmouseover = function() {
                        this.setAttribute("style", "padding: 5px; cursor: pointer");
                    }, headCells[i].onmouseout = function() {
                        this.setAttribute("style", "padding: 5px; cursor: default");
                    };
                } else {
                    var headCellClear = headCells[i].children[1];
                    headCellClear.setAttribute("style", "clear: both;");
                }
            }
            var header = tableDiv.querySelector("#" + this.id + "_header");
            header.setAttribute("style", "padding: 5px;"), this.headerClass && header.setAttribute("class", this.headerClass);
            var headLeft = header.children[0];
            headLeft.setAttribute("style", "float: left;");
            var headRight = header.children[1];
            headRight.setAttribute("style", "float: right;");
            var headClear = header.children[2];
            headClear.setAttribute("style", "clear: both;");
            var footer = tableDiv.querySelector("#" + this.id + "_footer");
            footer.setAttribute("style", "padding: 5px;"), this.footerClass && footer.setAttribute("class", this.footerClass);
            var footLeft = footer.children[0];
            footLeft.setAttribute("style", "float: left;");
            var footClear = footer.children[2];
            footClear.setAttribute("style", "clear: both;");
            var footRight = footer.children[1];
            footRight.setAttribute("style", "float: right; list-style: none;");
            for (var footRightItems = footRight.querySelectorAll("li"), i = 0; i < footRightItems.length; ++i) footRightItems[i].setAttribute("style", "display: inline; margin-right: 5px;");
        }, Dable.prototype.ApplyJqueryUIStyles = function(tableDiv) {
            if (!tableDiv) return !1;
            var header = tableDiv.querySelector("#" + this.id + "_header"), footer = tableDiv.querySelector("#" + this.id + "_footer"), span = document.createElement("span");
            header.setAttribute("class", "fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix");
            for (var headCells = tableDiv.querySelectorAll("th"), i = 0; i < headCells.length; ++i) {
                headCells[i].setAttribute("class", "ui-state-default");
                var sort = headCells[i].querySelector("." + this.sortClass);
                sort && (9660 == sort.innerText.charCodeAt(0) ? sort.setAttribute("class", this.sortClass + " ui-icon ui-icon-triangle-1-s") : 9650 == sort.innerText.charCodeAt(0) && sort.setAttribute("class", this.sortClass + " ui-icon ui-icon-triangle-1-n"), 
                sort.innerHTML = "");
            }
            for (var pagerItems = footer.querySelectorAll("li"), i = 0; i < pagerItems.length; ++i) RemoveStyle(pagerItems[i]);
            footer.setAttribute("class", "fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix");
            for (var pageClass = "fg-button ui-button ui-state-default ui-corner-left " + this.pagerButtonsClass, pageButtons = footer.querySelectorAll("." + this.pagerButtonsClass), i = 0; i < pageButtons.length; ++i) pageButtons[i].setAttribute("class", pageClass);
            var pageLeft = footer.querySelector("#" + this.id + "_page_prev");
            pageLeft.innerHTML = "";
            var pageLeftSpan = span.cloneNode(!1);
            pageLeftSpan.setAttribute("class", "ui-icon ui-icon-circle-arrow-w"), pageLeft.appendChild(pageLeftSpan), 
            pageLeft.getAttribute("disabled") && pageLeft.setAttribute("class", pageClass + " ui-state-disabled");
            var pageRight = footer.querySelector("#" + this.id + "_page_next");
            pageRight.innerHTML = "";
            var pageRightSpan = span.cloneNode(!1);
            if (pageRightSpan.setAttribute("class", "ui-icon ui-icon-circle-arrow-e"), pageRight.appendChild(pageRightSpan), 
            pageRight.getAttribute("disabled") && pageRight.setAttribute("class", pageClass + " ui-state-disabled"), 
            this.pagerIncludeFirstAndLast) {
                var pageFirst = footer.querySelector("#" + this.id + "_page_first"), pageLast = footer.querySelector("#" + this.id + "_page_last");
                pageFirst.innerHTML = "";
                var pageFirstSpan = span.cloneNode(!1);
                pageFirstSpan.setAttribute("class", "ui-icon ui-icon-arrowthickstop-1-w"), pageFirst.appendChild(pageFirstSpan), 
                pageLast.innerHTML = "";
                var pageLastSpan = span.cloneNode(!1);
                pageLastSpan.setAttribute("class", "ui-icon ui-icon-arrowthickstop-1-e"), pageLast.appendChild(pageLastSpan);
            }
        }, Dable.prototype.ApplyBootstrapStyles = function(tableDiv) {
            if (!tableDiv) return !1;
            var span = (document.createElement("div"), document.createElement("span")), header = tableDiv.querySelector("#" + this.id + "_header"), footer = tableDiv.querySelector("#" + this.id + "_footer"), table = tableDiv.querySelector("table");
            table.setAttribute("class", "table table-bordered table-striped"), table.setAttribute("style", "width: 100%; margin-bottom: 0;"), 
            header.setAttribute("class", "panel-heading"), footer.setAttribute("class", "panel-footer"), 
            tableDiv.setAttribute("class", "panel panel-info"), tableDiv.setAttribute("style", "margin-bottom: 0;");
            for (var tableRows = table.querySelectorAll("tbody tr"), i = 0; i < tableRows.length; ++i) //remove manual striping
            tableRows[i].removeAttribute("style");
            for (var headCells = table.querySelectorAll("th"), i = 0; i < headCells.length; ++i) {
                var sort = headCells[i].querySelector("." + this.sortClass);
                sort && (9660 == sort.innerText.charCodeAt(0) ? sort.setAttribute("class", this.sortClass + " glyphicon glyphicon-chevron-down") : 9650 == sort.innerText.charCodeAt(0) && sort.setAttribute("class", this.sortClass + " glyphicon glyphicon-chevron-up"), 
                sort.innerHTML = "");
            }
            for (var pageClass = "btn btn-default " + this.pagerButtonsClass, pageLeft = footer.querySelector("#" + this.id + "_page_prev"), pageRight = footer.querySelector("#" + this.id + "_page_next"), pageParent = pageLeft.parentElement, pagerItems = footer.querySelectorAll("li"), i = 0; i < pagerItems.length; ++i) RemoveStyle(pagerItems[i]);
            pageParent.setAttribute("class", "btn-group"), pageLeft.innerHTML = "";
            var pageLeftSpan = span.cloneNode(!1);
            pageLeftSpan.setAttribute("class", "glyphicon glyphicon-arrow-left"), pageLeft.appendChild(pageLeftSpan), 
            pageRight.innerHTML = "";
            var pageRightSpan = span.cloneNode(!1);
            if (pageRightSpan.setAttribute("class", "glyphicon glyphicon-arrow-right"), pageRight.appendChild(pageRightSpan), 
            this.pagerIncludeFirstAndLast) {
                var pageFirst = footer.querySelector("#" + this.id + "_page_first"), pageLast = footer.querySelector("#" + this.id + "_page_last");
                pageFirst.innerHTML = "";
                var pageFirstSpan = span.cloneNode(!1);
                pageFirstSpan.setAttribute("class", "glyphicon glyphicon-fast-backward"), pageFirst.appendChild(pageFirstSpan), 
                pageLast.innerHTML = "";
                var pageLastSpan = span.cloneNode(!1);
                pageLastSpan.setAttribute("class", "glyphicon glyphicon-fast-forward"), pageLast.appendChild(pageLastSpan);
            }
            for (var pageButtons = footer.querySelectorAll("." + this.pagerButtonsClass), i = 0; i < pageButtons.length; ++i) pageButtons[i].setAttribute("class", pageClass);
        }, Dable.prototype.CheckForTable = function(input) {
            //Check for existing table
            if (input) {
                input.nodeType && "div" == input.nodeName.toLowerCase() ? input.hasAttribute("id") ? this.id = input.getAttribute("id") : (this.id = "Dable1", 
                input.setAttribute("id", "Dable1")) : window.jQuery && input instanceof jQuery && input[0].nodeType ? //jquery object
                input[0].hasAttribute("id") ? this.id = input[0].getAttribute("id") : (this.id = "Dable1", 
                input[0].setAttribute("id", "Dable1")) : this.id = input.toString();
                var tableDiv = document.getElementById(this.id);
                if (tableDiv && this.rows && this.rows.length < 1) {
                    var table = tableDiv.querySelector("table");
                    if (table) {
                        tableDiv.hasAttribute("class") && (this.dableClass = tableDiv.getAttribute("class"));
                        var newTable = this.GenerateTableFromHtml(table);
                        //Make it a Dable!
                        return newTable;
                    }
                }
                return this.id;
            }
            return !1;
        }, Dable.prototype.GenerateTableFromHtml = function(tableNode) {
            if (!tableNode) return console.log("Dable Error: No HTML table to generate dable from"), 
            !1;
            tableNode.hasAttribute("class") && (this.tableClass = tableNode.getAttribute("class"));
            var thead = tableNode.querySelector("thead");
            if (!thead) return console.log("Dable Error: No thead element in table"), !1;
            var headers = thead.querySelectorAll("tr th"), tfoot = tableNode.querySelector("tfoot");
            tfoot && (this.tfoothtml = tfoot.innerHTML);
            for (var colNames = [], i = 0; i < headers.length; ++i) //add our column names
            colNames.push(headers[i].innerHTML);
            this.SetColumnNames(colNames);
            var rowsHtml = tableNode.querySelector("tbody").rows, allRows = [];
            rowsHtml.length > 1 && rowsHtml[0].hasAttribute("class") && rowsHtml[1].hasAttribute("class") && (this.evenRowClass = rowsHtml[0].getAttribute("class"), 
            this.oddRowClass = rowsHtml[1].getAttribute("class"));
            for (var i = 0; i < rowsHtml.length; ++i) {
                allRows.push([]);
                for (var rowCells = rowsHtml[i].children, j = 0; j < rowCells.length; ++j) allRows[i].push(rowCells[j].innerHTML);
            }
            this.SetDataAsRows(allRows);
            var parentDiv = tableNode.parentElement;
            return parentDiv.innerHTML = "", parentDiv.id;
        }, Dable.prototype.Exists = function(tableDiv) {
            var result = !1, checkId = "";
            tableDiv ? tableDiv && tableDiv.nodeType && "div" == tableDiv.nodeName.toLowerCase() ? checkId = tableDiv.id : tableDiv && window.jQuery && tableDiv instanceof jQuery && tableDiv[0].nodeType ? checkId = tableDiv[0].id : tableDiv && (checkId = tableDiv) : checkId = this.id, 
            checkId += "_header";
            var headerElement = document.getElementById(checkId);
            return headerElement && (result = !0), result;
        }, Dable.prototype.BuildAll = function(tableInput) {
            var tableId = this.CheckForTable(tableInput);
            if (!tableId) return !1;
            var tableDiv = document.getElementById(tableId);
            if (!tableDiv) return !1;
            if (this.async) this.asyncRequest(0, "", -1, !0, utils.bind(function(error) {
                if (error) throw error;
                tableDiv.innerHTML = "";
                var header = this.BuildHeader(tableDiv), table = this.BuildTable(tableDiv), footer = this.BuildFooter(tableDiv);
                tableDiv.appendChild(header), tableDiv.appendChild(table), tableDiv.appendChild(footer), 
                this.UpdateStyle(tableDiv);
            }, this)); else {
                tableDiv.innerHTML = "";
                var header = this.BuildHeader(tableDiv), table = this.BuildTable(tableDiv), footer = this.BuildFooter(tableDiv);
                tableDiv.appendChild(header), tableDiv.appendChild(table), tableDiv.appendChild(footer), 
                this.UpdateStyle(tableDiv);
            }
        }, Dable.prototype.BuildHeader = function(tableDiv) {
            if (!tableDiv) return !1;
            var div = document.createElement("div"), span = document.createElement("span"), select = document.createElement("select"), option = document.createElement("option"), input = document.createElement("input"), left = div.cloneNode(!1), show = span.cloneNode(!1);
            show.innerHTML = "Show ", left.appendChild(show);
            for (var entryCount = select.cloneNode(!1), i = 0; i < this.pageSizes.length; ++i) {
                var tempOption = option.cloneNode(!1);
                tempOption.innerHTML = this.pageSizes[i], tempOption.setAttribute("value", this.pageSizes[i]), 
                entryCount.appendChild(tempOption);
            }
            var dable = this;
            entryCount.onchange = function() {
                var entCnt = this, value = entCnt.value;
                dable.pageSize = parseInt(value), dable.UpdateDisplayedRows(document.getElementById(dable.id + "_body")), 
                dable.UpdateStyle(tableDiv);
            };
            for (var options = entryCount.querySelectorAll("option"), i = 0; i < options.length; ++i) if (options[i].value == dable.pageSize) {
                options[i].selected = !0;
                break;
            }
            left.appendChild(entryCount);
            var right = div.cloneNode(!1), search = span.cloneNode(!1);
            search.innerHTML = "Search ", right.appendChild(search);
            var inputSearch = input.cloneNode(!1);
            inputSearch.setAttribute("id", this.id + "_search"), inputSearch.onkeyup = utils.doSearch(this), 
            right.appendChild(inputSearch);
            var clear = div.cloneNode(!1), head = div.cloneNode(!1);
            return head.id = this.id + "_header", head.appendChild(left), head.appendChild(right), 
            head.appendChild(clear), head;
        }, Dable.prototype.BuildTable = function(tableDiv) {
            if (!tableDiv) return !1;
            for (var table = document.createElement("table"), head = document.createElement("thead"), headCell = document.createElement("th"), body = document.createElement("tbody"), row = document.createElement("tr"), span = document.createElement("span"), headRow = row.cloneNode(!1), i = 0; i < this.columnData.length; ++i) {
                var tempCell = headCell.cloneNode(!1), nameSpan = span.cloneNode(!1);
                if (nameSpan.innerHTML = this.columnData[i].FriendlyName + " ", tempCell.appendChild(nameSpan), 
                this.columnData[i].CustomSortFunc !== !1) {
                    var sortSpan = span.cloneNode(!1);
                    sortSpan.setAttribute("class", this.sortClass), sortSpan.innerHTML = "v", tempCell.appendChild(sortSpan), 
                    tempCell.onclick = utils.doSort(this);
                }
                var clear = span.cloneNode(!1);
                tempCell.appendChild(clear), tempCell.setAttribute("data-tag", this.columnData[i].Tag), 
                headRow.appendChild(tempCell);
            }
            if (head.appendChild(headRow), table.appendChild(head), this.visibleRows = this.rows.slice(0), 
            this.visibleRowObjects = this.rowObjects.slice(0), body = this.UpdateDisplayedRows(body), 
            body.id = this.id + "_body", table.appendChild(body), this.tfoothtml) {
                var foot = document.createElement("tfoot");
                foot.innerHTML = this.tfoothtml, table.appendChild(foot);
            }
            return table;
        }, Dable.prototype.BuildFooter = function(tableDiv) {
            if (!tableDiv) return !1;
            var div = document.createElement("div"), span = document.createElement("span"), left = (document.createElement("button"), 
            div.cloneNode(!1)), showing = span.cloneNode(!1);
            showing.id = this.id + "_showing", left.appendChild(showing);
            var right = this.BuildPager(footer), clear = div.cloneNode(!1), footer = div.cloneNode(!1);
            return footer.id = this.id + "_footer", footer.innerHTML = "", footer.appendChild(left), 
            footer.appendChild(right), footer.appendChild(clear), this.UpdateFooter(footer);
        }, Dable.prototype.BuildPager = function() {
            var ul = document.createElement("ul"), li = document.createElement("li"), anchor = document.createElement("a"), right = ul.cloneNode(!1), dable = this;
            if (this.pagerIncludeFirstAndLast) {
                var pageFirst = li.cloneNode(!1), pageFirstAnchor = anchor.cloneNode(!1);
                pageFirstAnchor.innerHTML = "First", pageFirst.setAttribute("class", this.pagerButtonsClass), 
                pageFirst.id = this.id + "_page_first", pageFirst.onclick = this.FirstPage, this.pageNumber <= 0 && (pageFirst.setAttribute("disabled", "disabled"), 
                pageFirst.onclick = utils.noop), pageFirst.appendChild(pageFirstAnchor), right.appendChild(pageFirst);
            }
            var pageLeft = li.cloneNode(!1), pageLeftAnchor = anchor.cloneNode(!1);
            if (pageLeftAnchor.innerHTML = "Prev", pageLeft.setAttribute("class", this.pagerButtonsClass), 
            pageLeft.id = this.id + "_page_prev", pageLeft.onclick = this.PreviousPage, this.pageNumber <= 0 && (pageLeft.setAttribute("disabled", "disabled"), 
            pageLeft.onclick = utils.noop), pageLeft.appendChild(pageLeftAnchor), right.appendChild(pageLeft), 
            this.pagerSize > 0) {
                var start = this.pageNumber - parseInt(this.pagerSize / 2), length = start + this.pagerSize;
                this.pageNumber <= this.pagerSize / 2 ? (// display from beginning
                length = this.pagerSize, start = 0, length > this.NumberOfPages() && (length = this.NumberOfPages())) : this.NumberOfPages() - this.pageNumber <= this.pagerSize / 2 && (//display the last five pages
                length = this.NumberOfPages(), start = this.NumberOfPages() - this.pagerSize);
                for (var i = start; i < length; ++i) {
                    var liNode = li.cloneNode(!1), liNodeAnchor = anchor.cloneNode(!1);
                    liNodeAnchor.innerHTML = (i + 1).toString();
                    liNode.onclick = function(j) {
                        return function() {
                            dable.GoToPage(j);
                        };
                    }(i), liNode.setAttribute("class", this.pagerButtonsClass), i == this.pageNumber && (liNode.setAttribute("disabled", "disabled"), 
                    liNode.onclick = utils.noop), liNode.appendChild(liNodeAnchor), right.appendChild(liNode);
                }
            }
            var pageRight = li.cloneNode(!1), pageRightAnchor = anchor.cloneNode(!1);
            if (pageRightAnchor.innerHTML = "Next", pageRight.setAttribute("class", this.pagerButtonsClass), 
            pageRight.id = this.id + "_page_next", pageRight.onclick = utils.bind(this.NextPage, this), 
            this.NumberOfPages() - 1 == this.pageNumber && (pageRight.setAttribute("disabled", "disabled"), 
            pageRight.onclick = utils.noop), pageRight.appendChild(pageRightAnchor), right.appendChild(pageRight), 
            this.pagerIncludeFirstAndLast) {
                var pageLast = li.cloneNode(!1), pageLastAnchor = anchor.cloneNode(!1);
                pageLastAnchor.innerHTML = "Last", pageLast.setAttribute("class", this.pagerButtonsClass), 
                pageLast.id = this.id + "_page_last", pageLast.onclick = utils.bind(this.LastPage, this), 
                this.NumberOfPages() - 1 == this.pageNumber && (pageLast.setAttribute("disabled", "disabled"), 
                pageLast.onclick = utils.noop), pageLast.appendChild(pageLastAnchor), right.appendChild(pageLast);
            }
            return right;
        }, Dable.prototype.FirstPage = function() {
            this.pageNumber = 0, this.GoToPage(this.pageNumber);
        }, Dable.prototype.PreviousPage = function() {
            this.pageNumber -= 1, this.GoToPage(this.pageNumber);
        }, Dable.prototype.GoToPage = function(page) {
            if (this.pageNumber = page, this.async && (this.asyncStart > this.pageNumber * this.pageSize || this.pageNumber * this.pageSize >= this.asyncStart + this.asyncLength)) {
                var newStart = this.pageNumber * this.pageSize, ascending = !0;
                this.sortOrder.length > 3 && "desc" == this.sortOrder.substr(0, 4).toLowerCase() && (ascending = !1), 
                this.asyncRequest(newStart, this.currentFilter, this.sortColumn, ascending, utils.bind(function(error) {
                    if (error) throw error;
                    this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), this.UpdateStyle();
                }, this));
            } else this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), this.UpdateStyle();
        }, Dable.prototype.NextPage = function() {
            this.pageNumber += 1, this.GoToPage(this.pageNumber);
        }, Dable.prototype.LastPage = function() {
            //page number is 0 based
            if (this.pageNumber = this.NumberOfPages() - 1, this.async && (this.asyncStart > this.pageNumber * this.pageSize || this.pageNumber * this.pageSize > this.asyncStart + this.asyncLength)) {
                var newStart = 0, pages = 1e3 / this.pageSize - 1;
                //-1 for the page number and -1 to include current page
                this.pageNumber - pages > -1 && (newStart = (this.pageNumber - pages) * this.pageSize);
                var ascending = !0;
                this.sortOrder.length > 3 && "desc" == this.sortOrder.substr(0, 4).toLowerCase() && (ascending = !1), 
                this.asyncRequest(newStart, this.currentFilter, this.sortColumn, ascending, utils.bind(function(error) {
                    if (error) throw error;
                    this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), this.UpdateStyle();
                }, this));
            } else this.UpdateDisplayedRows(document.getElementById(this.id + "_body")), this.UpdateStyle();
        }, module.exports = Dable;
    }(function(root) {
        var defineAMD = function(m) {
            "function" == typeof define && define.amd && define([], function() {
                return m;
            });
        };
        return Object.defineProperty({}, "exports", {
            set: function(i) {
                root.Dable = i, defineAMD(i);
            },
            get: function() {
                return root.Dable;
            }
        });
    }(this));
}).call(this);