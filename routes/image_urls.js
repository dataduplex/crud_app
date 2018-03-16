var table           = 'image_urls';
var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var model      = require('../models/'+table);
var sql_table       = model.meta_def.schema+'.'+table;

var HandlePost = function(req, res) {

    var table_def = Object.assign({}, model.definition);
    
    utils.copy_keys(req.body,table_def);
    table_def = db_api.autoFillFields(table_def, req.decoded, 'insert');    
    var ins_clause = utils.getInsertClause(table_def);
    var val_clause = utils.getValueClause(table_def);
    var stmt = 'insert into '+sql_table+' ' + '(' + ins_clause + ') values(' + val_clause + ')';

    
    //delete image_urls_def['']
    var params = {
            'bind_obj'  : table_def,
            'table'     : table,
            'res'       : res,
            'stmt'      : stmt,
            'commit'    : true,
            'conn'      : req['conn']
    };
    db_api.executeInsert(params,utils.responseHandler);        
};

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
            'pk'    : model.primary_keys,
            'bind_obj' : {},
            'req'   : req,
            'conn'  : req['conn']
    };
    db_api.executeSelect(params,utils.responseHandler);        
};


var HandleGetByID = function(req, res) {


    var pkValues = req.params.id.split('__');
    var bindObj = {};

    for (var i=0; i<model.primary_keys.length; i++) {
        bindObj[model.primary_keys[i]] = pkValues[i];
    }

        var params = { 
            'id_lookup' : true,
            'stmt' : 'select * from '+sql_table+' where '+utils.getConditionClauseByPK(model.primary_keys),
            'table' : table,
            'res' : res,
            'pk'    : model.primary_keys,
            'bind_obj' : bindObj,
            'conn'      : req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);
};

var HandlePutByID = function(req, res) {


    /*var pkValues = req.params.id.split('__');
    var bindObj = {};

    for (var i=0; i<model.primary_keys.length; i++) {
        bindObj[model.primary_keys[i]] = pkValues[i];
    }*/

    var table_def = Object.assign({}, model.definition);
    utils.copy_keys(req.body,table_def);
    table_def = db_api.autoFillFields(table_def, req.decoded, 'update');
    var upd_clause = utils.getUpdateClause(table_def);
    //var stmt = 'update '+sql_table+' set ' + upd_clause + ' where ID = :ID';
    var stmt = 'update '+sql_table+' set ' + upd_clause + ' where '+utils.getConditionClauseByPK(model.primary_keys);
    // TODO: Below looks incorrect
    //image_urls_def['ID'] = req.body['ID'];
        
        var params = {
            'bind_obj' : table_def,
            'table' : table,
            'res' : res,
            'stmt' : stmt,
            'commit' : true,
            'conn'      : req['conn']
        };
        db_api.executeUpdate(params,utils.responseHandler);  
};  

var HandleDeleteByID = function(req, res) {

    var pkValues = req.params.id.split('__');
    var bindObj = {};

    for (var i=0; i<model.primary_keys.length; i++) {
        bindObj[model.primary_keys[i]] = pkValues[i];
    }

        var params = { 
            'stmt'  : 'delete from '+sql_table+ ' where '+utils.getConditionClauseByPK(model.primary_keys),
            'table' : table,
            'res'   : res,
            'bind_obj'  : bindObj,
            'commit'    : true,
            'conn'      : req['conn']
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
