// import './console-polyfill';
import addRow from './addRow';
import applyBaseStyles from './applyBaseStyles';
import applyBootstrapStyles from './applyBootstrapStyles';
import applyJqueryUIStyles from './applyJqueryUIStyles';
import asyncReload from './asyncReload';
import asyncRequest from './asyncRequest';
import baseSort from './baseSort';
import buildAll from './buildAll';
import buildFooter from './buildFooter';
import buildHeader from './buildHeader';
import buildPager from './buildPager';
import buildTable from './buildTable';
import checkForTable from './checkForTable';
import defaults from './defaults';
import deleteRow from './deleteRow';
import exists from './exists';
import filters from './filters';
import generateTableFromHtml from './generateTableFromHtml';
import goToPage from './goToPage';
import lastPage from './lastPage';
import {mixin} from './utils';
import removeStyles from './removeStyles';
import searchFunc from './searchFunc';
import setColumnNames from './setColumnNames';
import setDataAsColumns from './setDataAsColumns';
import setDataAsRows from './setDataAsRows';
import sortFunc from './sortFunc';
import updateDisplayedRows from './updateDisplayedRows';
import updateFooter from './updateFooter';
import updateStyle from './updateStyle';

//IE 8 Console.log fix
if (typeof console === 'undefined' || typeof console.error === 'undefined') {
  // eslint-disable-next-line
  console = {error: function() {}}; // jshint ignore:line
}

export default function Dable(tableOrId) {
  mixin(this, Dable.defaults);
  this.BuildAll(tableOrId);
}

Dable.defaults = defaults;

Dable.prototype.RowCount = function() {
  return this.rows.length;
};

Dable.prototype.VisibleRowCount = function() {
  return this.visibleRows.length;
};

Dable.prototype.NumberOfPages = function() {
  var n = this.VisibleRowCount() / this.pageSize;
  return Math.ceil(n);
};

Dable.prototype.GetPageForRow = function(row) {
  return Math.ceil(row / this.pageSize);
};

Dable.prototype.asyncRequest = asyncRequest;

Dable.prototype.asyncReload = asyncReload;

Dable.prototype.searchFunc = searchFunc;

Dable.prototype.sortFunc = sortFunc;

Dable.prototype.baseSort = baseSort;

Dable.prototype.filters = filters;

Dable.prototype.SetColumnNames = setColumnNames;

Dable.prototype.DeleteRow = deleteRow;

Dable.prototype.AddRow = addRow;

Dable.prototype.CreateObjectsFromRows = function(rows) {
  var rowObjects = [];
  for (var i = 0; i < rows.length; ++i) {
    rowObjects.push({Row: rows[i], RowNumber: i});
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

Dable.prototype.SetDataAsColumns = setDataAsColumns;

Dable.prototype.SetDataAsRows = setDataAsRows;

Dable.prototype.UpdateDisplayedRows = updateDisplayedRows;

Dable.prototype.UpdateFooter = updateFooter;

Dable.prototype.UpdateStyle = updateStyle;

Dable.prototype.RemoveStyles = removeStyles;

Dable.prototype.ApplyBaseStyles = applyBaseStyles;

Dable.prototype.ApplyJqueryUIStyles = applyJqueryUIStyles;

Dable.prototype.ApplyBootstrapStyles = applyBootstrapStyles;

Dable.prototype.CheckForTable = checkForTable;

Dable.prototype.GenerateTableFromHtml = generateTableFromHtml;

Dable.prototype.Exists = exists;

Dable.prototype.BuildAll = buildAll;

Dable.prototype.BuildHeader = buildHeader;

Dable.prototype.BuildTable = buildTable;

Dable.prototype.BuildFooter = buildFooter;

Dable.prototype.BuildPager = buildPager;

Dable.prototype.GoToPage = goToPage;

Dable.prototype.FirstPage = function() {
  this.pageNumber = 0;
  this.GoToPage(this.pageNumber);
};

Dable.prototype.PreviousPage = function() {
  this.pageNumber -= 1;
  this.GoToPage(this.pageNumber);
};

Dable.prototype.NextPage = function() {
  this.pageNumber += 1;
  this.GoToPage(this.pageNumber);
};

Dable.prototype.LastPage = lastPage;
