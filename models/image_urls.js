/**
 * Created by jeluma200 on 7/20/16.
 */

var definition = { 
    'SKU' : null,
    'URL_TYPE' : null,
    'IMAGE_URL' : null,
    'IMAGE_ALT_TEXT' : null
};

var defaults = { };

var meta_def = { schema:'PRODUCTREF',
					ctrlFields : {  } 
				};

//var schema='PRODUCTREF';

var primary_keys = ['SKU','URL_TYPE'];
var table_name = "image_urls";

var sql_table = meta_def.schema+'.'+table_name;
var ins_clause = Object.keys(definition).join(',');
var val_clause = '';
Object.keys(definition).forEach(function(key,index) {
    val_clause = val_clause + ':' + key + ',';
});
val_clause = val_clause.substring(0, val_clause.length - 1);
var ins_stmt = 'insert into ' + sql_table + ' (' + ins_clause + ') values(' + val_clause + ')';

exports.definition = definition;
exports.primary_keys = primary_keys;
exports.table_name = table_name;
exports.ins_stmt = ins_stmt;
exports.defaults = defaults;
exports.meta_def = meta_def;

