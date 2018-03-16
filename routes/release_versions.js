var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var release_versions  = require('../models/release_versions');
var table           = 'release_versions';
//var table           = 'product_detail';
var sql_table           = release_versions.meta_def.schema+'.'+table;

//TODO: express deprecated res.send(status, body): Use res.status(status).send(body) instead library/common_utils.js:31:13

var HandlePost = function(req, res) {

    var table_def = Object.assign({}, release_versions.definition);    
    utils.copy_keys(req.body,table_def);        
    table_def = db_api.autoFillFields(table_def, req.decoded, 'insert');
    var ins_clause = utils.getInsertClause(table_def);
    var val_clause = utils.getValueClause(table_def);
    var stmt_ins = 'insert into '+sql_table+' ' + '(' + ins_clause + ') values(' + val_clause + ')';

    if (req.body.STATUS == 'ACTIVE') {

        db_api.executeSelect({ 
            'stmt' : 'select count(*) ACTIVE_COUNT from '+sql_table+' where status=:STATUS',
            'bind_obj' : { 'STATUS' : req.body.STATUS},
            'id_lookup' : true,
            'conn'      :   req['conn']
        }, function (err, params) {
            
            if (err) {
                //res.status(401).json({'STATUS' : 'FAILURE', 'ERROR_MSG': 'More than one ACTIVE status not allowed'});
                console.log('ERROR occurred');
                console.log(err);
                db_api.releaseConnection(req['conn']);
                res.status(401).json({'STATUS' : 'FAILURE'});
                return;
            }

            if ( params['output']['ACTIVE_COUNT'] > 0 ) {
                db_api.releaseConnection(req['conn']);
                res.status(401).json({'STATUS' : 'FAILURE', 'ERROR_MSG': 'More than one ACTIVE status not allowed'});
                return;
            } else {

                var params = {
                    'bind_obj' : table_def,
                    'table' : table,
                    'res' : res,
                    'stmt' : stmt_ins,
                    'commit' : true,
                    'conn'      :   req['conn']
                };
                db_api.executeInsert(params,utils.responseHandler);        
            }

        });

    } else {
        var params = {
            'bind_obj'  : table_def,
            'table'     : table,
            'res'       : res,
            'stmt'      : stmt_ins,
            'commit'    : true,
            'conn'      :   req['conn']
        };
        db_api.executeInsert(params,utils.responseHandler);  
    }
      
};

var HandleGet = function(req, res) {
    var params = { 
            'stmt'      : 'select * from '+sql_table,
            'table'     : table,
            'res'       : res,
            'bind_obj'  : {},
            'req'       : req,
            'conn'      :   req['conn']
    };
    db_api.executeSelect(params,utils.responseHandler);        
};


var HandleGetByID = function(req, res) {
        var params = { 
            'id_lookup' : true,
            'stmt'      : 'select * from '+sql_table+' where REL_VERSION=:REL_VERSION',
            'table'     : table,
            'res'       : res,
            'bind_obj'  : { 'REL_VERSION' : req.params.rel_version},
            'conn'      :   req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);
};

var HandlePutByID = function(req, res) {
    var table_def = Object.assign({}, release_versions.definition);
    utils.copy_keys(req.body,table_def);
    table_def = db_api.autoFillFields(table_def, req.decoded, 'update');
    var upd_clause = utils.getUpdateClause(table_def);
    var stmt_upd = 'update '+sql_table+' set ' + upd_clause + ' where REL_VERSION=:REL_VERSION';


    if (req.body.STATUS == 'ACTIVE') {

        db_api.executeSelect({ 
            'stmt' : 'select count(*) ACTIVE_COUNT from '+sql_table+' where status=:STATUS',
            'bind_obj' : { 'STATUS' : req.body.STATUS},
            'id_lookup' : true,
            'conn'      :   req['conn']
        }, function (err, params) {
            
            if (err) {
                //res.status(401).json({'STATUS' : 'FAILURE', 'ERROR_MSG': 'More than one ACTIVE status not allowed'});
                console.log('ERROR occurred');
                console.log(err);
                db_api.releaseConnection(req['conn']);
                res.status(401).json({'STATUS' : 'FAILURE'});
                return;
            }

            if ( params['output']['ACTIVE_COUNT'] > 0 ) {
                db_api.releaseConnection(req['conn']);
                res.status(401).json({'STATUS' : 'FAILURE', 'ERROR_MSG': 'More than one ACTIVE status not allowed'});
                return;
            } else {

                var params = {
                    'bind_obj' : table_def,
                    'table' : table,
                    'res' : res,
                    'stmt' : stmt_upd,
                    'commit' : true,
                    'conn'      :   req['conn']
                };
                db_api.executeUpdate(params,utils.responseHandler);  

            }   
       });     
    } else {
        var params = {
            'bind_obj' : table_def,
            'table' : table,
            'res' : res,
            'stmt' : stmt_upd,
            'commit' : true,
            'conn'      :   req['conn']
        };
        db_api.executeUpdate(params,utils.responseHandler);  
    }    
        
};  

var HandleDeleteByID = function(req, res) {
    var params = { 
        'stmt' : 'delete from '+sql_table+' where REL_VERSION=:REL_VERSION',
        'table' : table,
        'res' : res,
        'bind_obj' : { 'REL_VERSION' : req.params.rel_version},
        'commit' : true,
        'conn'      :   req['conn']
    };
    db_api.executeDelete(params,utils.responseHandler);
};    

module.exports = {
    'HandlePost'        : HandlePost,
    'HandleGet'         : HandleGet,
    'HandleGetByID'     : HandleGetByID,
    'HandlePutByID'     : HandlePutByID,
    'HandleDeleteByID'  : HandleDeleteByID  
};
