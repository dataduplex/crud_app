var utils           = require('../library/common_utils');
var db_api          = require('../library/db_api');
var file_upload     = require('../models/file_upload');
var table           = file_upload.table_name; //'file_upload';
var sql_table       = file_upload.meta_def.schema+'.'+table;
//var upload_dir      = '/Users/jeluma200/modesto-pc-rest/upload'; 
//var excel_lib       = require('../HandleExcelFile');
var excel_lib       = require('../excel_upload/HandleTabbedExcel');

var HandlePost = function(req, res) {

    var table_def = Object.assign({}, file_upload.definition);
    
    utils.copy_keys(req.body,table_def);
    utils.copy_keys(file_upload.defaults,table_def);
    table_def = db_api.autoFillFields(table_def, req.decoded, 'insert');
    //console.log('req.body');
    //console.log(req.body);
    table_def['FILE_NAME'] = req.body.FILE_PATH;
    //file_upload_defFILE_PATH
    //res.status(200).json({'success' : 'true'});
            
    /*var ins_clause = Object.keys(file_upload_def).join(',');
    var val_clause = '';
    Object.keys(file_upload_def).forEach(function(key,index) {
        val_clause = val_clause + ':' + key + ',';
    });
    val_clause = val_clause.substring(0, val_clause.length - 1);
    var stmt = 'insert into file_upload ' + '(' + ins_clause + ') values(' + val_clause + ')';*/

    var params = {
            'bind_obj' : table_def,
            'table' : table,
            'res' : res,
            'stmt' : file_upload.ins_stmt,
            'commit' : true,
            'app_root_dir' : req.app_root_dir,
            'conn'      : req['conn']
    };

    params['FILE_PATH'] = req.app_root_dir+'/upload/'+table_def['FILE_NAME'];
    params['app_root_dir'] =  __dirname;
    params['ACTION'] = req.body['ACTION'].toLowerCase();
    //params['DB_CONN'] = req['conn'];
    //params['DB_CONN_POOL'] = req['DB_CONN_POOL'];
    /*if ('UPDATE_TYPE' in req.body) {
        params['mode'] = req.body['UPDATE_TYPE'].toLowerCase();
    }*/
    excel_lib.Main(params,req.decoded);
    db_api.releaseConnection(req['conn']);
    res.status(200).json({'STATUS' : 'SUCCESS'});

    //
    /*db_api.executeInsert(params, function (err, params) {
        //uploadExcelMain(params['excelFile']);
        //console.log('FILE_NAME');
        //console.log(table_def['FILE_NAME']);
        
        //params['excelFile'] = req.app_root_dir+'/upload/'+table_def['FILE_NAME'];
        //params['excelFile'] = req.app_root_dir+'/upload/'+table_def['FILE_NAME'];

        var res = params['res'];
        if (err) {
                //res.send(err);
                //res.send({});
            console.log("ERROR: Error occorred");
            console.log(err);
            res.send(401, 'Some error occurred');
            return;
        }

        res.status(200).json(params['output']);
    }); */

    
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
            'stmt' : 'select * from '+sql_table+where_clause+' order by upload_date desc',
            'table' : table,
            'res' : res,
            'bind_obj' : {},
            'req'       : req,
            'conn'      : req['conn']
    };
    db_api.executeSelect(params,utils.responseHandler);        
};


var HandleGetByID = function(req, res) {
        var params = { 
            'id_lookup' : true,
            'stmt' : 'select * from '+sql_table+' where FILE_NAME=:FILE_NAME',
            'table' : table,
            'res' : res,
            'bind_obj' : { 'FILE_NAME' : req.params.file_name},
            'conn'      : req['conn']
        };
        db_api.executeSelect(params,utils.responseHandler);
};


module.exports = {
    'HandlePost'        : HandlePost,
    'HandleGet'         : HandleGet,
    'HandleGetByID'     : HandleGetByID
};
