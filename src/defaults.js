export default {
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
