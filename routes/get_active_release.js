var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var model           = require('../models/release_versions');
var table           = 'release_versions';
var sql_table       = model.meta_def.schema+'.'+table;

var HandleGet = function(req, res) {

        var stmt = 'select rel_version from '+sql_table+' where status=:STATUS';

        var params = {
            'bind_obj' : { 'STATUS' : 'ACTIVE' },
            'table' : table,
            'res' : res,
            'stmt' : stmt,
            'id_lookup' : true,
            'conn'      : req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);  
};  


module.exports = {
    'HandleGet'     : HandleGet
};
