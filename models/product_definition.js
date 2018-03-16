/**
 * Created by jeluma200 on 7/20/16.
 */

var definition = { 
    'SKU': null,
    'SYS_CREATE_DATE': null,
    'OPERATOR_ID': null,
    'USER_ID': null,
    'MANF_CODE': null,
    'CIFA_ID': null,
    'UPC': null,
    'INTL_UPC': null,
    'PART_NUMBER': null,
    'CONFIG_CODE': null,
    'MODEL_NUMBER': null,
    'EQUIP_TYPE': null,
    'EQUIP_SUB_TYPE': null,
    'EQUIP_SUB_CAT': null,
    'SERIAL_TYPE': null,
    'EQUIP_ID': null,
    'SIM_TYPE': null,
    'SIM_FORM': null,
    'PACKAGE_TYPE': null,
    'PRE_INSERTED_SIM':null,
    'SKU_TYPE':null,
    'CIFA_ITEM_CATEGORY':null,
    'PRODUCT_OWNER_ID':null
};

/*var meta_def = {
    'child' :  [ 
        ['PRODUCT_DETAIL', 'SKU']
    ]
};
*/
//        ['CHANNEL_ASSIGNMENT', 'SKU'],
//        ['MODEL_FEATURE', 'SKU'],

var meta_def = {
    'child' :  [ 
        ['PRODUCT_DETAIL', 'SKU'],
        ['IMAGE_URLS', 'SKU'],
        ['PRODUCT_CPBLY', 'SKU']
    ],
    schema:'PRODUCTREF',
    ctrlFields : { 
        'SYS_CREATE_DATE': null,
        'OPERATOR_ID': null,
        'USER_ID': null
    }
};


var defaults = {
    'OPERATOR_ID' : 'SKU_APP' 
};

var primary_keys = ['SKU'];
var table_name = "product_definition";

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
exports.meta_def = meta_def;
exports.defaults = defaults;


/*
var product_definition_meta = {
    required : {
        "SKU" : 1,
        "OPERATOR_ID" : 0,
        "USER_ID" : 1,
        "MANF_CODE" : 1,
        "UPC" : 0,
        "INTERNATIONAL_UPC" : 0,
        "PART_NUMBER" : 0,
        "CONFIG_CODE" : 0,
        "MODEL_NUMBER" : 0,
        "EQUIPMENT_TYPE" : 1,
        "EQUIPMENT_SUB_TYPE" : 0,
        "EQUIPMENT_SUB_CAT" : 0,
        "SERIAL_TYPE" : 0,
        "EQUIPMENT_ID" : 0,
        "SIM_TYPE" : 0,
        "SIM_FORM" : 0,
        "PACKAGE_TYPE" : 0,
        "PRE_INSERTED_SIM" : 0    
    },
    defaults : {

    }
};

var primary_keys = ['SKU'];
var table_name = "product_definition";

var get_meta = function () {


};

exports.product_definition = product_definition;
exports.primary_keys = primary_keys;
exports.table_name = table_name;

*/