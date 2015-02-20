var http = require("http"),
	yaml = require('js-yaml'),
	fs   = require('fs');


http.createServer(function(request,response) {
     if (request.method == 'POST' && request.url == '/async') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var data = JSON.parse(body);

            var start = data.start;
            var count = data.count;
            var filter = data.filter;
            var sortColumn = data.sortColumn;
            var ascending = data.ascending;

            //get data
            var text = fs.readFileSync('data.yml', 'utf8');
            var table = yaml.safeLoad(text);

            //filter data
            var result = table;
            if (filter) {
                result = [];
                var filters = filter.split(' ');
                for (var t = 0;t < table.length; ++t) {
                    var row = table[t];
                    for (var r = 0; r < row,length; ++r) {
                        var field = row[r];
                        var found = false;
                        for (var f = 0; f < filters.length; ++f) {
                            if (field.indexOf(filters[f]) > -1) {
                                result.push(row);
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                }
            }

            //sort data
            if (sortColumn > -1) {
                result.sort(function(a, b){
                    var aValue = a[sortColumn];
                    var bValue = b[sortColumn];
                    if (aValue < bValue) {
                        return -1;
                    }
                    if (aValue > bValue) {
                        return 1;
                    }
                    return 0;
                });
                if (!ascending) {
                    result.reverse();
                }
            }

            response.writeHeader(200, {"Content-Type": "text/javascript"});
            response.write(JSON.stringify({ rows: result, rowCount: table.length, includedRowCount: result.length }));
            response.end();
        });
    }
    else if (request.url == '/js/Dable.js') {
        var text = fs.readFileSync('../../js/Dable.js', 'utf8');
        response.writeHeader(200, { 'Content-Type': 'text/javascript' });
        response.write(text);
        response.end();
    }
    else {
        var text = fs.readFileSync('Node.html', 'utf8');
        response.writeHeader(200, { 'Content-Type': 'text/html' });
        response.write(text);
        response.end();
    }
}).listen(8080);

console.log('Listening...');