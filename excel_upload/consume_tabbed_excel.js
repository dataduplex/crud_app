const   util        = require('util');

if(typeof require !== 'undefined') XLSX = require('xlsx');

var consumeExcel = function (file) {
	//var workbook = XLSX.readFile('/Users/jeluma200/pc/SKU_import_format3.xlsx');
	var all_tables_rows = { };
	var workbook = XLSX.readFile(file);
	var sheet_name_list = workbook.SheetNames;
	sheet_name_list.forEach(function(y) { /* iterate through sheets */  		
  		var worksheet = workbook.Sheets[y];
      //console.log(util.inspect(worksheet, false, null));
  		var j = XLSX.utils.sheet_to_json(worksheet);
  		var table_name = y.toUpperCase();

      var rows = [];
      for (var i=0; i<j.length; i++) {
        //console.log(util.inspect(j[i], false, null));
        rows.push(convertKeysToUpper(j[i]));
      }
  		all_tables_rows[table_name] = rows;
	});
  //console.log(util.inspect(all_tables_rows, false, null));
	return all_tables_rows;
}


function convertKeysToUpper(obj) {
  var key, keys = Object.keys(obj);
  var n = keys.length;
  var newobj={}
  while (n--) {
    key = keys[n];
    newobj[key.toUpperCase()] = obj[key];
  }

  return newobj; 
}
/*var key, keys = Object.keys(obj);
var n = keys.length;
var newobj={}
while (n--) {
  key = keys[n];
  newobj[key.toLowerCase()] = obj[key];
}
*/

exports.consumeExcel = consumeExcel;

/*
  console.log(j);
  for (z in worksheet) {
    /* all keys that do not begin with "!" correspond to cell addresses */
    //if(z[0] === '!') continue;
    //console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
  //}

