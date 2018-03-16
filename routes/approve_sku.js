var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var approvals       = require('../models/approvals');
var table           = 'approvals';
var sql_table       = approvals.meta_def.schema+'.'+table;

/*var HandlePost = function(req, res) {

    var table_def = Object.assign({}, product_detail.definition);
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
};**/
/*var HandleGetByID = function(req, res) {
        var params = { 
            'id_lookup' : true,
            'stmt' : 'select * from '+table+' where ID=:ID',
            'table' : table,
            'res' : res,
            'bind_obj' : { 'ID' : req.params.id}
        };
        db_api.executeSelect(params,utils.responseHandler);
};*/

var HandlePutByID = function(req, res) {
        //var table_def = Object.assign({}, approvals.definition);
        //utils.copy_keys(req.body,table_def);
        //var upd_clause = utils.getUpdateClause(table_def);
        var stmt = 'update '+sql_table+' set STATUS=:STATUS, UPDATE_USER=:UPDATE_USER where SKU=:SKU and TEAM=:TEAM';

        var params = {
            'bind_obj' : { 'STATUS' : req.body.STATUS, 
                            'SKU'   : req.body.SKU,
                            'TEAM'  : req.decoded.role,
                            'UPDATE_USER' : req.decoded.username,
                        },
            'table' : table,
            'res' : res,
            'stmt' : stmt,
            'commit' : true,
            'conn'   : req['conn']
        };
        db_api.executeUpdate(params,utils.responseHandler);  
};  


module.exports = {
    'HandlePutByID'     : HandlePutByID
};
