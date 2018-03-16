/**
 * Created by jeluma200 on 7/20/16.
 */

var definition = {
    'FILE_NAME': null,
    'DOWNSTREAM_APP': null,
    'DOWNSTREAM_ENV': null,
    'REL_VERSION': null,
    'STATUS': null,
    'TOTAL_SKUS': null,
    'TOTAL_SUCCESS': null,
    'TOTAL_FAILURES': null
};

var defaults = { };
var meta_def = { 
	schema:'SKU_APP',
	ctrlFields : { }
 };

var primary_keys    = ['FILE_NAME','DOWNSTREAM_APP','DOWNSTREAM_ENV'];
var table_name      = "file_exports";
var sql_table = meta_def.schema+'.'+table_name;

var ins_clause      = Object.keys(definition).join(',');
var val_clause      = '';
Object.keys(definition).forEach(function(key,index) {
    val_clause      = val_clause + ':' + key + ',';
});
val_clause          = val_clause.substring(0, val_clause.length - 1);
var ins_stmt        = 'insert into ' + sql_table + ' (' + ins_clause + ') values(' + val_clause + ')';

exports.definition      = definition;
exports.primary_keys    = primary_keys;
exports.table_name      = table_name;
exports.ins_stmt        = ins_stmt;
exports.defaults        = defaults;
exports.meta_def = meta_def;
