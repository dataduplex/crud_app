var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var imports         = require('../models/imports');
var table           = 'imports';
var sql_table       = imports.meta_def.schema+'.'+table;

var HandleGet = function(req, res) {

    var filter_obj = null;
    var where_clause = '';
    if (req.query._filters) {
        where_clause = ' where ';
        filter_obj = JSON.parse(req.query._filters);
        //console.log(filter_obj['SKU']);
        Object.keys(filter_obj).forEach(function(key,index) {
            where_clause = where_clause + key + " like '" + filter_obj[key] + "%' and ";
        });

        where_clause = where_clause.substring(0, where_clause.length - 5);
    }

    var params = { 
            'stmt' : 'select * from '+sql_table+where_clause,
            'table' : 'imports',
            'res' : res,
            'bind_obj' : {},
            'req' : req,
            'conn'      : req['conn']
    };
    db_api.executeSelect(params,utils.responseHandler);        
};


var HandleGetByID = function(req, res) {
        var params = { 
            'id_lookup' : true,
            'stmt' : 'select * from '+sql_table+' where ID=:ID',
            'table' : 'imports',
            'res' : res,
            'bind_obj' : { 'ID' : req.params.id,
            'conn'      : req['conn']
            }
        };
        db_api.executeSelect(params,utils.responseHandler);

        /*'bind_obj' : { 'FILE_NAME' : req.params.file_name,
                           'PRODUCT_CODE' : req.params.product_code,
                           'TABLE_NAME' : req.params.table_name*/
};


module.exports = {
    'HandleGet'         : HandleGet,
    'HandleGetByID'     : HandleGetByID
};
