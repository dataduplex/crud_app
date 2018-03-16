/**
 * Created by jeluma200 on 7/20/16.
 */

var definition = {
    'FILE_NAME' : null,
    'FILE_TYPE' : null,
    'STATUS' : null,
    'TOTAL_PARSED' : null,
    'TOTAL_UPLOADED' : null,
    'TOTAL_FAILED' : null,
    'USER_ID' : null,
    'ERROR_MESSAGE': null,
    'UPLOAD_DATE': null,
    'ACTION': null
    //'UPDATE_TYPE': null
};

var defaults = {
    'STATUS' : 'IN_PROGRESS',
    ctrlFields : { 'UPLOAD_DATE': null }
};

var meta_def = { schema:'SKU_APP' };

var primary_keys = ['FILE_NAME'];
var table_name = "file_upload";
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
