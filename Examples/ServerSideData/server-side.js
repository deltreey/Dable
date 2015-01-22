var http = require("http"),
	yaml = require('js-yaml'),
	fs   = require('fs');


http.createServer(function(request,response) {
 	var start = request.data.start;
 	var count = request.data.count;
 	var filter = request.data.filter;
 	var sortColumn = request.data.sortColumn;
	var ascending = request.data.ascending;

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
    response.write(JSON.stringify(result));
    response.end();
}).listen(8080);

console.log('Listening...');