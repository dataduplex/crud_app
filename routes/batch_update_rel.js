var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var model           = require('../models/product_definition_ext');
var table           = 'product_definition_ext';
var sql_table       = model.meta_def.schema+'.'+table;

var HandlePutByID = function(req, res) {

        var sku_list    = req.body.SKU_LIST; 

        var sku_list_sql = sku_list.map(function(sku){
            return "'" + sku + "'";
        }).join(","); 

        var stmt = 'update '+sql_table+' set REL_VERSION=:REL_VERSION where SKU in ('+ sku_list_sql +')';

        var params = {
            'bind_obj' : { 'REL_VERSION' : req.body.REL_VERSION
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
