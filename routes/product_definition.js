var table               = 'product_definition';
var utils               = require('../library/common_utils');
var db_api              = require('../library/db_api');
var product_definition  = require('../models/'+table);
var approve_sku         = require('./approve_sku');
var sql_table           = product_definition.meta_def.schema+'.'+table;

var HandlePost = function(req, res) {

    var table_def = Object.assign({}, product_definition.definition);
    utils.copy_keys(req.body,table_def);
    table_def = db_api.autoFillFields(table_def, req.decoded, 'insert');
    var ins_clause = utils.getInsertClause(table_def);
    var val_clause = utils.getValueClause(table_def);
    var stmt = 'insert into '+sql_table+' ' + '(' + ins_clause + ') values(' + val_clause + ')';

        params = {
            'bind_obj'  : { 'SKU' : table_def['SKU'], 'REL_VERSION' : req.body['REL_VERSION']  },
            'table'     : 'product_definition_ext',
            'res'       : res,
            'stmt'      : 'insert into sku_app.product_definition_ext (SKU, REL_VERSION) values (:SKU, :REL_VERSION)',
            'commit'    : false,
            'role'      : req.decoded.role,
            'conn'      : req['conn']        
        };

        db_api.executeInsert(params, function (err, params) {
            if (err) {
                utils.responseHandler(err,params);
                return;                
            }
            //delete table_def['REL_VERSION'];
            var newParams = {
                'bind_obj' : table_def,
                'table' : table,
                'res' : res,
                'stmt' : stmt,
                'commit' : true,
                'role' : req.decoded.role,
                'conn'  : params['conn']
            };

            db_api.executeInsert(newParams,utils.responseHandler);

        });
    

            
};

    //console.log('req');
    //console.log(req);
    /*
    query: 
   { _filters: '{"SKU":"SMG"}',
     _page: '1',
     _perPage: '30',
     _sortDir: 'DESC',
     _sortField: 'id' }
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

    var subQuery = 'select status from sku_app.approvals ap where ap.SKU=a.SKU and ap.team=:TEAM';
    var subQuery2 = 'select rel_version from sku_app.product_definition_ext e where e.SKU=a.SKU';
    var params = { 
            'stmt'  : 'select a.*, ('+subQuery+') STATUS, ('+ subQuery2 +') REL_VERSION from '+sql_table+' a'+where_clause,
            'table' : table,
            'res'   : res,
            'bind_obj'  : { 'TEAM' : req.decoded.role},
            'role'      : req.decoded.role,
            'req'       : req,
            'conn'      : req['conn']
    };
    //console.log(params);
    db_api.executeSelect(params,utils.responseHandler);        
};


var HandleGetByID = function(req, res) {
        var subQuery = 'select status from sku_app.approvals ap where ap.SKU=a.SKU and ap.team=:TEAM';
        var subQuery2 = 'select rel_version from sku_app.product_definition_ext e where e.SKU=a.SKU';
        var params = { 
            'id_lookup' : true,
            'stmt'      : 'select a.*, ('+subQuery+') STATUS, ('+ subQuery2 +') REL_VERSION from '+sql_table+' a where a.SKU=:SKU',
            'table'     : table,
            'res'       : res,
            'bind_obj'  : { 'SKU' : req.params.sku, 'TEAM' : req.decoded.role},
            'role'      : req.decoded.role,
            'conn'      : req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);
};

var HandlePutByID = function(req, res) {
        var table_def = Object.assign({}, product_definition.definition);
        utils.copy_keys(req.body,table_def);
        table_def = db_api.autoFillFields(table_def, req.decoded, 'update');
        var upd_clause = utils.getUpdateClause(table_def);
        var stmt = 'update '+sql_table+' set ' + upd_clause + ' where SKU = :SKU';
        
        var params = {
            'bind_obj'  : { 'SKU' : table_def['SKU'], 'REL_VERSION' : req.body['REL_VERSION']  },
            'table'     : 'product_definition_ext',
            'res'       : res,
            'stmt'      : 'update sku_app.product_definition_ext set REL_VERSION=:REL_VERSION where SKU=:SKU',
            'commit'    : false,
            'role'      : req.decoded.role,
            'conn'      : req['conn']
        };


        db_api.executeUpdate(params, function (err, params) {
            if (err) {
                console.log("ERROR: Error occorred");
                console.log(err);
                console.log(params);
                db_api.releaseConnection(req['conn']);
                res.send(401, 'Some error occurred');
                return;                
            }

            var newParams = {
                'bind_obj' : table_def,
                'table' : table,
                'res' : res,
                'stmt' : stmt,
                'commit' : true,
                'role' : req.decoded.role,
                'conn'  : params['conn']
            };

            db_api.executeUpdate(newParams, function (err, params) {
                //var res = params['res'];
                if (err) {
                    //res.send(err);
                    //res.send({});
                    console.log("ERROR: Error occorred");
                    console.log(err);
                    console.log(params);
                    db_api.releaseConnection(req['conn']);
                    res.send(401, 'Some error occurred');
                    return;
                }
                approve_sku.HandlePutByID(req, res);  
                //res.status(200).json(params['output']);
            });

        });        
  
        //require('./routes/approve_sku').HandlePutByID(req, res);
};  


var responseHandler = function (err, params) {
    var res = params['res'];
    if (err) {
        //res.send(err);
        //res.send({});
        console.log("ERROR: Error occorred");
        console.log(err);
        console.log(params);
        db_api.releaseConnection(params['conn']);
        res.send(401, 'Some error occurred');
        return;
    }

    db_api.releaseConnection(params['conn']);
    res.status(200).json(params['output']);
};



var HandleDeleteByID = function(req, res) {


    var params = { 
        'stmt'  : 'delete from sku_app.product_definition_ext where SKU=:SKU',
        'table' : 'product_definition_ext',
        'res'   : res,
        'bind_obj'  : { 'SKU' : req.params.sku},
        'commit'    : false,
        'role'      : req.decoded.role,
        'conn' : req['conn']
    };

    db_api.executeDelete(params,function (err, params) {
        if (err) {
            utils.responseHandler(err,params);
            return;
        }

        params = { 
            'stmt'  : 'delete from sku_app.approvals where SKU=:SKU',
            'table' : 'approvals',
            'res'   : res,
            'bind_obj'  : { 'SKU' : req.params.sku},
            'commit'    : false,
            'role'      : req.decoded.role,
            'conn'      :   req['conn']
        };

        db_api.executeDelete(params,function(err,params) {
             if (err) {
                utils.responseHandler(err,params);
                return;
            }

            params = { 
                'stmt'  : 'delete from '+sql_table+' where SKU=:SKU',
                'table' : table,
                'res'   : res,
                'bind_obj'  : { 'SKU' : req.params.sku},
                'commit'    : true,
                'role'      : req.decoded.role,
                'conn'      : req['conn']
            };
            db_api.executeDelete(params,utils.responseHandler);

        });

    });

        
};    

module.exports = {
    'HandlePost'        : HandlePost,
    'HandleGet'         : HandleGet,
    'HandleGetByID'     : HandleGetByID,
    'HandlePutByID'     : HandlePutByID,
    'HandleDeleteByID'  : HandleDeleteByID  
};
