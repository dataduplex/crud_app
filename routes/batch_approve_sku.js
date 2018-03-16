var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var approvals       = require('../models/approvals');
var table           = 'approvals';
var sql_table       = approvals.meta_def.schema+'.'+table;

var HandlePutByID = function(req, res) {
        //var table_def = Object.assign({}, approvals.definition);
        //utils.copy_keys(req.body,table_def);
        //var upd_clause = utils.getUpdateClause(table_def);
        //var stmt = 'update '+sql_table+' set STATUS=:STATUS, UPDATE_USER=:UPDATE_USER where SKU=:SKU and TEAM=:TEAM';

        var sku_list    = req.body.SKU_LIST; 
        //var status      = req.body.STATUS;
        //var team        = req.decoded.role;

        var sku_list_sql = sku_list.map(function(sku){
            return "'" + sku + "'";
        }).join(","); 

        var stmt = 'update '+sql_table+' set STATUS=:STATUS, UPDATE_USER=:UPDATE_USER where SKU in ('+ sku_list_sql +') and TEAM=:TEAM';

        var params = {
            'bind_obj' : { 'STATUS' : req.body.STATUS, 
                            'TEAM'  : req.decoded.role,
                            'UPDATE_USER' : req.decoded.username,
                        },
            'table' : table,
            'res'   : res,
            'stmt'  : stmt,
            'commit' : true,
            'conn'   : req['conn']
        };
        db_api.executeUpdate(params,utils.responseHandler);  
};  


module.exports = {
    'HandlePutByID'     : HandlePutByID
};
