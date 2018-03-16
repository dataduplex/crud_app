/**
 * Created by jeluma200 on 7/20/16.
 */

var definition = {
            'SKU': null,
            'TEAM': null,
            'STATUS': null,
            'UPDATE_USER': null,
            'UPDATE_TIME': null
};

var defaults = { };

var meta_def = { 

	schema : 'SKU_APP',

	ctrlFields : { 
		'UPDATE_USER' 	: null,
		'UPDATE_TIME' 	: null
	}
 };

var primary_keys = ['SKU','TEAM'];
var table_name = "approvals";
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
