var utils               =       require('../library/common_utils');
var db_api              =       require('../library/db_api');
var sku_export_status   =       require('../models/sku_export_status');
var table               =       'sku_export_status';
var sql_table           =       sku_export_status.meta_def.schema+'.'+table;

/*var HandlePost = function(req, res) {

    var table_def = Object.assign({}, sku_export_status.definition);
    utils.copy_keys(req.body,table_def);        
    var ins_clause = utils.getInsertClause(table_def);
    var val_clause = utils.getValueClause(table_def);
    var stmt = 'insert into '+table+' ' + '(' + ins_clause + ') values(' + val_clause + ')';

    var params = {
            'bind_obj' : table_def,
            'table' : table,
            'res' : res,
            'stmt' : stmt,
            'commit' : true
    };
    db_api.executeInsert(params,utils.responseHandler);        
};
*/

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
            'stmt'  : 'select * from '+sql_table+where_clause,
            'table' : table,
            'res'   : res,
            'bind_obj' : {},
            'req'   : req,
            'conn'  : req['conn']
    };
    db_api.executeSelect(params,utils.responseHandler);        
};


var HandleGetByID = function(req, res) {
        var params = { 
            'id_lookup' : true,
            'stmt'      : 'select * from '+sql_table+' where ID=:ID',
            'table'     : table,
            'res'       : res,
            'bind_obj'  : { 'ID' : req.params.id},
            'conn'      : req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);
};

/*var HandlePutByID = function(req, res) {
        var table_def = Object.assign({}, sku_export_status.definition);
        utils.copy_keys(req.body,table_def);
        var upd_clause = utils.getUpdateClause(table_def);
        var stmt = 'update '+table+' set ' + upd_clause + ' where ID = :ID';

        var params = {
            'bind_obj' : table_def,
            'table' : table,
            'res' : res,
            'stmt' : stmt,
            'commit' : true
        };
        db_api.executeUpdate(params,utils.responseHandler);  
};  */

/*var HandleDeleteByID = function(req, res) {
        var params = { 
            'stmt' : 'delete from '+table+' where SKU=:SKU',
            'table' : table,
            'res' : res,
            'bind_obj' : { 'SKU' : req.params.sku},
            'commit' : true
        };
        db_api.executeDelete(params,utils.responseHandler);
};   */ 

module.exports = {
    'HandleGet'         : HandleGet,
    'HandleGetByID'     : HandleGetByID
};
