<?php
$post = file_get_contents('php://input');
$data = json_decode($post);

$start = $data->start;
$count = $data->count;
$filter = $data->filter;
$sortColumn = $data->sortColumn;
$ascending = $data->ascending;

$filters = explode(' ', $filter);

//get the data
$table = yaml_parse(require('data.yml'));

$results = $table;

//filter the data
if ($filter !== '') {
	foreach ($table as $row) {
		foreach ($row as $field) {
			$found = false;
			foreach ($filters as $search) {
				if (strpos($field, $search) !== false) {
					array_push($results, $row);
					$found = true;
					break;
				}
			}
			if ($found) {
				break;
			}
		}
	}
}

//sort the data
function cmp($a, $b) {
	$aValue = $a[$sortColumn];
	$bValue = $b[$sortColumn];
    if ($aValue == $bValue) {
        return 0;
    }
    return ($aValue < $bValue) ? -1 : 1;
}

if($sortColumn !== -1) {
	uasort($results, 'cmp');
	if ($ascending) {
		array_reverse($results);
	}
}


//set the return values
$returnValue = (object) array(
	'rows' => $results,
	'includedRowCount' => count($results),
	'rowCount' => count($table));

echo json_encode($returnValue);