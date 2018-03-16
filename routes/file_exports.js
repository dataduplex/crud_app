var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var file_exports    = require('../models/file_exports');
var table           = 'file_exports';
var sql_table       = file_exports.meta_def.schema+'.'+table;
var skuExportStatusDef  = require('../models/sku_export_status');
var exportLib       = require('../downstream/export_sku_arterra2');

var HandlePost = function(req, res) {
    // 1 check if all skus were approved
    // 2 if yes, insert into sku_export_status, for staging
    // 3 then insert the file
    var table_def = Object.assign({}, file_exports.definition);
    
    //console.log('req.body');
    //console.log(req.body);
    utils.copy_keys(req.body,table_def);        

    table_def = db_api.autoFillFields(table_def, req.decoded, 'insert');
    var ins_clause = utils.getInsertClause(table_def);
    var val_clause = utils.getValueClause(table_def);
    var stmt = 'insert into '+sql_table+' ' + '(' + ins_clause + ') values(' + val_clause + ')';

    var outputFileName = 'SKU_EXPORT_'        + req.body.DOWNSTREAM_APP;
    outputFileName = outputFileName +   '_'   + req.body.DOWNSTREAM_ENV;
    outputFileName = outputFileName +   '_'   + req.body.REL_VERSION;
    outputFileName = outputFileName + '.json';

    //var file_name =  'SKU_EXPORT_' + req.body.REL_VERSION + '.json';
    table_def['FILE_NAME'] = outputFileName;

    var params_file_exp = {
        'bind_obj'  : table_def,
        'table'     : table,
        'res'       : res,
        'stmt'      : stmt,
        'commit'    : true,
        'REL_VERSION'       : req.body.REL_VERSION,
        'DOWNSTREAM_APP'    : req.body.DOWNSTREAM_APP,
        'DOWNSTREAM_ENV'    : req.body.DOWNSTREAM_ENV,
        'conn'              : req['conn']
    };

    var stmt2 = "select p.*, pd.MODEL_NUMBER, (select 1 from sku_app.approvals a where a.SKU=p.SKU and a.status <> 'Accepted' and rownum=1) status";
    stmt2 = stmt2 + ", (select count(*) from sku_app.SKU_EXPORT_STATUS s where s.SKU=p.SKU and s.downstream_app=:DOWNSTREAM_APP and ";
    stmt2 = stmt2 + "s.downstream_env=:DOWNSTREAM_ENV and s.STATUS in ('SENT','DONE')) export_count";
    stmt2 = stmt2 + " from SKU_APP.PRODUCT_DEFINITION_EXT p, PRODUCTREF.product_definition pd where p.REL_VERSION=:REL_VERSION";
    stmt2 = stmt2 + " and pd.SKU=p.SKU";

    var params = { 
        'stmt'      : stmt2,
        'table'     : 'product_definition',
        'bind_obj'  : { 'REL_VERSION' : req.body.REL_VERSION, 
                        'DOWNSTREAM_APP' : req.body.DOWNSTREAM_APP, 
                        'DOWNSTREAM_ENV' : req.body.DOWNSTREAM_ENV },
        'conn'      : req['conn']
    };

    db_api.executeSelect(params,function (err, params) { 
        if (err) {
            //results[table] = {'status' : 'FAILURE', 'error' : err };  
            // TODO: Update to the database
            console.log('[ERROR] Error occurred');
            console.log(err);
            db_api.releaseConnection(req['conn']);
            res.send(401, 'Some error occurred');
            return;
        }

        var err_msg = '';
        if ( params['output'].length == 0 ) {
            err_msg = 'No matching SKUs found for release: '+rel_version;
        } else  {
            for (var i=0; i<params['output'].length; i++) {
                if (params['output'][i]['STATUS'] == '1') {
                    err_msg = 'SKU: '+params['output'][i]['SKU']+' not approved by all teams';
                    break;  
                }
            }
        }

        var insert = false;
        var update = false;
        for (var i=0; i<params['output'].length; i++) {
                if (params['output'][i]['EXPORT_COUNT']==0) {
                    params['output'][i]['ACTION'] = 'insert';
                    insert = true;
                } else {
                    params['output'][i]['ACTION'] = 'update';
                    update = true;
                }
                params['output'][i]['ACTION'] = 'insert';
        }

        if (insert === true && update === true) {
            console.log('[ERROR] Cannot mix and match insert and updates');
            db_api.releaseConnection(req['conn']);
            res.send(401, 'Some error occurred');
            /*if ('conn' in req) {
                req['conn'].close(function(closeErr){
                    console.log('[ERROR] Error closing connection');
                    console.log(closeErr);
                    return;
                });
            }*/
            return;
        }

        console.log('Output');
        console.log(params['output']);

        if (err_msg.length>0) {
            console.log('[ERROR] Error occurred');
            console.log(err_msg);
            
            if ('conn' in req) {
                //console.log('[INFO] Closing DB connection');
                db_api.releaseConnection(req['conn']);
            }
            res.send(401, 'Some error occurred');
            return;         
        } 

        //ind, rows,res,rel_ver
        if (insert === true) {
            console.log('Calling insert operation on SKU_EXPORT_STATUS');
            insertStatus(0,params['output'],params_file_exp);
            return;
        } 


        db_api.getConnectionFromPool(params_file_exp, function() {
            
        });


        if (update === true) {
            console.log('Calling update operation on SKU_EXPORT_STATUS');
            updateStatus(0,params['output'],params_file_exp);
            return;
        }

    }); 
  
};

var HandleGet = function(req, res) {
    var params = { 
            'stmt'  : 'select * from '+sql_table,
            'table' : table,
            'res'   : res,
            'bind_obj'  : {},
            'req'       : req,
            'conn'      : req['conn']

    };
    db_api.executeSelect(params,utils.responseHandler);        
};


// if status = submit, call the export module
// if status = cancel, delete any related rows from sku_export_status and delete the row from file_exports
var HandlePutByID = function(req, res) {
        var table_def = Object.assign({}, file_exports.definition);
        utils.copy_keys(req.body,table_def);
        table_def = db_api.autoFillFields(table_def, req.decoded, 'update');
        //var upd_clause = utils.getUpdateClause(table_def);

        var params = {
            'conn' : req['conn']        
        };
        console.log('req.body.STATUS');
        console.log(req.body.STATUS);
        console.log(req.body);
        // user wants to perform an export
        if ( req.body.STATUS == 'SUBMIT' ) {

            params['stmt'] = 'select SKU from SKU_APP.product_definition_ext e where REL_VERSION=:REL_VERSION '+
                             ' and exists (select 1 from sku_app.sku_export_status s where s.sku=e.sku and s.status=:STATUS)';
            params['bind_obj'] = { 'REL_VERSION' : req.body.REL_VERSION, 'STATUS' : 'STAGING' }; 

            db_api.executeSelect(params, function (err, params) {

                if (err) {
                    console.log(err);
                    db_api.releaseConnection(req['conn']);
                    res.send(401, 'Some error occurred');
                    //closeConnection(params);
                    return;
                }

                if (params['output'].length == 0) {
                    console.log('[ERROR] Cannot find any SKUs with release version '+req.body.REL_VERSION);
                    db_api.releaseConnection(req['conn']);
                    res.send(401, 'Some error occurred');
                    //closeConnection(params);
                    return;
                }

                var skuArr = params['output'];
                stmt = 'update '+sql_table+' set status=:STATUS where ID = :ID';        
                var file_exp_params = {
                    'bind_obj'  : { 'STATUS' : req.body.STATUS, 'ID' : req.params.id },
                    'table'     : table,
                    'res'       : res,
                    'stmt'      : stmt,
                    'commit'    : true,
                    'REL_VERSION'       : req.body.REL_VERSION,
                    'DOWNSTREAM_APP'    : req.body.DOWNSTREAM_APP,
                    'DOWNSTREAM_ENV'    : req.body.DOWNSTREAM_ENV,
                    'conn'  : params['conn']
                };


                db_api.executeUpdate(file_exp_params,function (err, params) { 

                    var res = params['res'];
                    if (err) {
                        console.log("ERROR: Error occorred");
                        console.log(err);
                        console.log(params);
                        res.send(401, 'Some error occurred');
                        //closeConnection(params);
                        db_api.releaseConnection(req['conn']);
                        return;
                    }


                    var export_params = {
                        'REL_VERSION'    : req.body.REL_VERSION,
                        'DOWNSTREAM_APP' :  req.body.DOWNSTREAM_APP,
                        'DOWNSTREAM_ENV' :  req.body.DOWNSTREAM_ENV,
                        'CHANNEL'        : 'WEB',
                        'DB_CONN'        :  params['conn'],
                        'DB_CONN_POOL'   :  req['DB_CONN_POOL']
                    };
                    
                    // Hoorray!!
                    exportLib.performExport(skuArr, export_params, req.decoded);
                    db_api.releaseConnection(req['conn']);
                    res.status(200).json({'STATUS' : 'SUCCESS'});
                });     
                
            });


        } else { // user wants to cancel, delete all rows from sku_export_status and file_exports table that are 
                 // related to this file
                 params['stmt'] = 'delete from sku_app.sku_export_status where rel_version=:REL_VERSION and status=:STATUS';
                 params['bind_obj'] = { 'REL_VERSION' : req.body.REL_VERSION, 'STATUS' : 'STAGING' };
                 params['commit'] = false;

                 db_api.executeDelete(params,function (err, params) {
                    if (err) {
                        console.log(err);
                        db_api.releaseConnection(req['conn']);
                        res.send(401, 'Some error occurred');
                        return;
                    }

                    params['stmt'] = 'delete from sku_app.file_exports where file_name=:FILE_NAME';
                    params['bind_obj'] = { 'FILE_NAME' : req.body.FILE_NAME };
                    params['commit'] = true;
                    
                    db_api.executeDelete(params,function (err, params) {
                        if (err) {
                            console.log(err);
                            db_api.releaseConnection(req['conn']);
                            res.send(401, 'Some error occurred');
                            return;
                        }
                        db_api.releaseConnection(req['conn']);
                        res.status(200).json({'STATUS' : 'SUCCESS'});    
                    });
                 });
        }
};  


var HandleGetByID = function(req, res) {
        var params = { 
            'id_lookup' : true,
            'stmt' : 'select * from '+sql_table+' where ID=:ID',
            'table' : table,
            'res' : res,
            'bind_obj' : { 'ID' : req.params.id},
            'conn'  : req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);
};


function insertStatus (ind, rows, params_fexp) {
        var tableDef  = skuExportStatusDef.definition;

        var bind_obj = {    'SKU'            : rows[ind]['SKU'],
                            'DOWNSTREAM_APP' : params_fexp['DOWNSTREAM_APP'],
                            'DOWNSTREAM_ENV' : params_fexp['DOWNSTREAM_ENV'],
                            'REL_VERSION'    : params_fexp['REL_VERSION'],
                            'STATUS'         : 'STAGING',
                            'ERROR_MSG'      : '',
                            'MODEL_NUMBER'   : rows[ind]['MODEL_NUMBER'],
                            'ACTION'         : 'insert',
                            'CREATE_TIME'    : new Date()
                    };      
        
        //console.log('bind_obj');
        //console.log(bind_obj);      
        stmt = 'insert into sku_app.sku_export_status (' +  utils.getInsertClause(tableDef) + ') values ';
        stmt = stmt + '(' + utils.getValueClause(tableDef) + ')';

        var params = { };
        params = {
            'bind_obj'  : bind_obj,
            'table'     : 'sku_export_status',
            'stmt'      : stmt,
            'commit'    : false,
            'res'       : params_fexp['res'],
            'conn'               : params_fexp['conn'] 
        };
                    
        db_api.executeInsert(params, function(err,params) {
            if (err) {
                console.log('Error occurred');
                console.log(err);
                //express deprecated res.send(status, body): Use res.status(status).send(body) instead routes/file_exports.js:261:31
                var res = params['res'];
                res.status(401).json({'STATUS' : 'FAILURE'});
                db_api.releaseConnection(params['conn']);
                return;
                //params['res'].send(401, 'Some error occurred');
            } 
            ind++;
            if (ind < rows.length) {
                insertStatus(ind,rows,params_fexp);
            } else {
                db_api.executeInsert(params_fexp, function (err, params) { 
                    db_api.releaseConnection(params['conn']);
                    var res = params['res'];
                    if (err) {
                        console.log("ERROR: Error occorred");
                        console.log(err);
                        console.log(params);
                        res.send(401, 'Some error occurred');
                        return;
                    }
                    // Call downstream API here
                    //exportLib.performExport(params, req.decoded);
                    res.status(200).json({'STATUS' : 'SUCCESS'});
                });      
                return;
            }

        });
}

function updateStatus (ind, rows, params_fexp) {
        var tableDef  = skuExportStatusDef.definition;

        var bind_obj = {    'SKU'            : rows[ind]['SKU'],
                            'DOWNSTREAM_APP' : params_fexp['DOWNSTREAM_APP'],
                            'DOWNSTREAM_ENV' : params_fexp['DOWNSTREAM_ENV'],
                            'REL_VERSION'    : params_fexp['REL_VERSION'],
                            'STATUS'         : 'STAGING',
                            'ERROR_MSG'      : '',
                            'MODEL_NUMBER'   : rows[ind]['MODEL_NUMBER'],
                            'ACTION'         : 'update'
                    };      

        var upd_clause = '';
        Object.keys(tableDef).forEach(function(key,index) {
            if (key != 'CREATE_TIME') {
                upd_clause = upd_clause + key + '=:' + key + ',';    
            }
        });

        if ('CREATE_TIME' in bind_obj) {
            delete bind_obj['CREATE_TIME'];
        }
        
        if ('ID' in bind_obj) {
            delete bind_obj['ID'];
        }

        upd_clause = upd_clause.substring(0, upd_clause.length - 1);
        stmt = 'update sku_app.sku_export_status set ' + upd_clause + ' where SKU = :SKU and DOWNSTREAM_APP = :DOWNSTREAM_APP and DOWNSTREAM_ENV = :DOWNSTREAM_ENV';
        

        var params = { };
        params = {
            'bind_obj'  : bind_obj,
            'table'     : 'sku_export_status',
            'stmt'      : stmt,
            'commit'    : false,
            'res'       : params_fexp['res'],
            'conn'      : params_fexp['conn'] 
        };
                    
        db_api.executeUpdate(params, function(err,params) {
            if (err) {
                console.log('Error occurred');
                console.log(err);
                //express deprecated res.send(status, body): Use res.status(status).send(body) instead routes/file_exports.js:261:31
                var res = params['res'];
                db_api.releaseConnection(params['conn']);
                res.status(401).json({'STATUS' : 'FAILURE'});
                return;
                //params['res'].send(401, 'Some error occurred');
            } 
            ind++;
            if (ind < rows.length) {
                updateStatus(ind,rows,params_fexp);
            } else {
                db_api.executeUpdate(params_fexp, function (err, params) { 
                    db_api.releaseConnection(params['conn']);
                    var res = params['res'];
                    if (err) {
                        console.log("ERROR: Error occorred");
                        console.log(err);
                        console.log(params);
                        res.send(401, 'Some error occurred');
                        return;
                    }
                    // Call downstream API here
                    //exportLib.performExport(params, req.decoded);
                    res.status(200).json({'STATUS' : 'SUCCESS'});
                });      
                return;
            }

        });
}

module.exports = {
    'HandlePost'        : HandlePost,
    'HandleGet'         : HandleGet,
    'HandlePutByID'     : HandlePutByID,
    'HandleGetByID'     : HandleGetByID
};
