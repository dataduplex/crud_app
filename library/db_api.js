/**
 * Created by jeluma200 on 7/21/16.
 */
var oracledb = require('oracledb');
var dbConfig = require('../restricted/dbconfig.js');
var async       = require('async');
var globals     = require('./globals');
var moment      = require('moment-timezone');
var conn_details = {
     user          : dbConfig.user,
     password      : dbConfig.password,
     connectString : dbConfig.connectString,
     prodSchema    : dbConfig.prodSchema,
     appSchema     : dbConfig.appSchema
};

//var connGlobal = null;
//var prodSchema = null;
//var appSchema = null;
//var connPool = null;

var createPool = function (params, cb) {
    oracledb.createPool(
        {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString,   
            poolMax       : 15
        },
        function(error, pool){
            if (error) {
                //conn_error = error;
                //params['error_obj'] = error;
                cb(error, params);
                return;
            }
            //connPool = pool;
            params['DB_CONN_POOL']             = pool;
            globals.globalVars['DB_CONN_POOL'] = pool;
            cb(null, params);  
        }    
    );

};


var getConnectionFromPool = function(params, cb) {
    var pool = globals.globalVars['DB_CONN_POOL'];
    pool.getConnection( function(err, conn) {
        if (err) {
            console.log("[ERROR] getConnectionFromPool Error occurred");
            console.log(err);

        } else {
            globals.globalVars['SEQ'] = globals.globalVars['SEQ'] + 1;
            conn['connID'] = globals.globalVars['SEQ'];
            globals.globalVars['CONN_COUNT']++;
            console.log("[DEBUG] getConnectionFromPool Got a Database connection. Conn Count: "+globals.globalVars['CONN_COUNT']);
            console.log("[DEBUG] getConnectionFromPool Connection ID: "+conn['connID']);
            params['DB_CONN'] = conn;
        }
        cb(err,params);
    });   
};


var releaseConnection = function(conn) {
    conn.close(function(err) {
        if (err) { 
            console.log("[ERROR] Error releasing connection");
            console.log(err.message); 
            return;
        }
        globals.globalVars['CONN_COUNT']--;
        console.log('[DEBUG] releaseConnection. Connection ID: '+conn['connID']);
        console.log('[DEBUG] DB connection closed. Conn Count: '+globals.globalVars['CONN_COUNT']);
    });
};


var doConnect =  function (params, cb) {
    params['error_obj'] = null;
    oracledb.getConnection(
        conn_details,
        function(error, connection){
            if (error) {
                //conn_error = error;
                //params['error_obj'] = error;
                cb(error, params);
                return;
            }
            params['DB_CONN'] = connection;
            //cb(app, router, port);  
            cb(null, params);  
    });
};



function getPKByTable (table) {
    var model = require('./models/'+table);
    return model.primary_keys;
}

function addIDColumn ( ) {

}

function getConnection(myParams) {
    if ( 'conn' in myParams ) {
        console.log('[DEBUG] Using connection from params');
        return myParams['conn'];
    } else {
        return null;
    }
}


function closeConnection(myParams) {

    if ( ('keepDBConnAlive' in myParams) && (myParams['keepDBConnAlive'] == true)) {
        console.log('[DEBUG] Keeping connection alive');
        return;
    }

    if ( 'conn' in myParams ) {
        if (myParams['conn']) {
            myParams['conn'].close(function(err) {
                if (err) { 
                    console.log("[ERROR] Error releasing connection");
                    console.log(err.message); 
                    return;
                }
                console.log('[DEBUG] DB connection closed. conn');
            });
        //return;
        }
    } 

    if ('DB_CONN' in myParams) {
       if (myParams['DB_CONN']) {
            myParams['DB_CONN'].close(function(err) {
                if (err) { 
                    console.log("[ERROR] Error releasing connection");
                    console.log(err.message); 
                    return;
                }
                console.log('[DEBUG] DB connection closed. DB_CONN');
            });
        }
    }
}


/*

PARAMS:
    params - db_conn, table, select_clause, where_clause, bind_obj, table, id_lookup
    cb - callback function
RETURNS:
    params - rows, result
*/
function executeSelect ( params, cb ) {

    var conn = getConnection(params);

    if (conn == null) {
        console.log('[ERROR] DB connection object null');
        console.log(params);
        cb("Got null for Database Connection", params);
        return;
    }

    var where_clause = '';
    var select_clause = '';
    //var conn = params['db_conn'];
    //var pk = getPKByTable(params['table']);
    // We are using the below fields from params
    // 1. stmt (must)
    // 2. select_clause, where_clause, table

    var stmt = null;
    if ( params['stmt'] ) {
        stmt = params['stmt'];
    } else {

        if ( params['select_clause'] ) {
            select_clause = params['select_clause'];
        } else {
            select_clause = 'select * ' ;
        }

        if (params['where_clause']) {
            where_clause = params['where_clause']; 
        } 
        stmt = select_clause + ' from ' + params['table'] + ' ' + where_clause;
    }

    var table = '';
    if ('table' in params) {
        table = params['table'];
    }
    //var d = new Date();
    var startTime = Date.now();
    console.log('[INFO] ' + startTime.toString() + ' Running select stmt on table : '+table);
    conn.execute(stmt, params['bind_obj'], {outFormat: oracledb.OBJECT,
                                            maxRows: 10000
                                            }, 
        function (err,result) {
            if (err) {
                //params['error_obj'] = err;
                //closeConnection(params);
                cb(err,params);
                return;
            }
            var elapsedTime = (Date.now() - startTime)/1000;
            
            console.log('[INFO] Select stmt on table finished : '+table); 
            console.log('[INFO] Elapsed time (secs) : '+elapsedTime);    
            
            //console.log(result);

            if ( result.rows && result.rows.length > 0 ) {
                // if pk field is present, generate a pseudo column called ID, for GUI
                // Combine composite key into a single ID field separated by __
                if ( 'pk' in params ) {
                    for (var i=0; i<result.rows.length; i++) {
                       var ID = '';
                       for (var j=0; j<params['pk'].length; j++) {
                            ID = ID + '__' + result.rows[i][params['pk'][j]];
                       }     
                        ID = ID.substring(2); // + '__' + result.rows[i][params['pk'][j]];
                        result.rows[i]['ID']=ID;
                    }
                }

                if (params['id_lookup']) {
                    //var thisRow = transformDate(table, result.rows[0]);
                    //params['output'] = thisRow;
                    params['output'] = result.rows[0];
                } else {
                    params['output'] = result.rows;
                }
            } else {
                if (params['id_lookup']) {
                    params['output'] =  {};
                } else {
                    params['output'] = [];
                }
            }
            params['result'] = result;
            cb(null, params);
            //closeConnection(params);
    });
}


function transformDate(table, row) {

    console.log('[INFO] inside transformDate');
    table = table.toLowerCase();
    // get table's model def
    var metaDef = require('../models/'+table).meta_def;

    if (metaDef == undefined || metaDef == null) {
        console.log('[INFO] Exit transformDate 1');
        return row;
    }

    if ('date_cols' in metaDef) {
        for (var key in metaDef['date_cols']) {
            if ( row[key] != null && row[key] != "" && row[key] != undefined) {
                console.log("[INFO] Date Key is : " + key);
                console.log("[INFO] Date Value is ");
                console.log(row[key]);
                console.log("[INFO] Date Type is " + typeof(row[key]));
                var convertedDate = moment(row[key].toISOString()).format();
                console.log("[INFO] convertedDate Value is ");
                console.log(convertedDate);
                console.log("[INFO] convertedDate Type is " + typeof(convertedDate));
                row[key] =  convertedDate;
            }
        }
    }
    console.log('[INFO] Exit 2 transformDate 1');
    return row;
}


function executeStmt ( params, cb ) {    
    //var conn = params['db_conn'];

    var conn = getConnection(params);

    if (conn == null) {
        console.log('[ERROR] DB connection object null');
        console.log(params);
        cb("Got null for Database Connection", params);
        return;
    }


    var stmt;
    console.log('[INFO] Running Statement: '+params['stmt']);
    conn.execute(params['stmt'],[],{},function (err,result) {
        if (err) {
            //params['error_obj'] = err;
            //closeConnection(params);
            cb(err,params);
            return;
        }
        params['result'] = result;      
        cb(null, params);
        //closeConnection(params);
    });   
}


function executeInsert ( params, cb ) {
    
    var conn = getConnection(params);

    if (conn == null) {
        console.log('[ERROR] DB connection object null');
        console.log(params);
        cb("Got null for Database Connection", params);
        return;
    }

    var stmt = params['stmt']; 
    console.log('[INFO] Running insert stmt: '+stmt);

    conn.execute(stmt, params['bind_obj'], {outFormat: oracledb.OBJECT}, function (err,result) {
        if (err) {
            //params['error_obj'] = err;
            //closeConnection(params);
            cb(err,params);
            return;
        }
     
        //console.log("Total rows inserted: "+result.rowsAffected);
        params['inserted_count'] = result.rowsAffected;
        var msg = 'rows inserted ' + result.rowsAffected; 
        params['result'] = result;    
        params['output'] = { 'message' : msg };    

        if ( params['commit'] ) {
            conn.execute("commit",[],{},function (err1,result1) {
                if (err1) {
                    //params['error_obj'] = err;
                    cb(err1,params);
                    return;
                } 
                params['commit_result'] = result1;    
                cb(null, params);
                //closeConnection(params);
            });
        } else { 
            cb(null, params);  
            //closeConnection(params);
        }
    });
}


function executeUpdate ( params, cb ) {
    
    var conn = getConnection(params);

    if (conn == null) {
        console.log('[ERROR] DB connection object null');
        console.log(params);
        cb("Got null for Database Connection", params);
        return;
    }

    var stmt = params['stmt']; 
    console.log('[INFO] Running Update stmt: '+stmt);
    console.log('Bind Obj: ');
    console.log(params['bind_obj']);

    conn.execute(stmt, params['bind_obj'], {outFormat: oracledb.OBJECT}, function (err,result) {
        if (err) {
            //params['error_obj'] = err;
            //closeConnection(params);
            cb(err,params);
            return;
        }
     
        //console.log("Total rows inserted: "+result.rowsAffected);
        params['update_count'] = result.rowsAffected;
        params['result'] = result;    
        var msg = 'rows updated ' + result.rowsAffected; 
        params['output'] = { 'message' : msg };    

        if ( params['commit'] ) {
            conn.execute("commit",[],{},function (err1,result1) {
                if (err1) {
                    //params['error_obj'] = err;
                    cb(err,params);
                    return;
                } 
                params['commit_result'] = result1;           
                cb(null, params);
                //closeConnection(params);
            });
        } else { 
            cb(null, params);
            //closeConnection(params);  
        }
    });
}


function executeDelete ( params, cb ) {
    
    var conn = getConnection(params);

    if (conn == null) {
        console.log('[ERROR] DB connection object null');
        console.log(params);
        cb("Got null for Database Connection", params);
        return;
    }

    var stmt = params['stmt']; 
    console.log('[INFO] Running stmt: '+stmt);
    console.log(params['bind_obj']);

    conn.execute(stmt, params['bind_obj'], {outFormat: oracledb.OBJECT}, function (err,result) {
        if (err) {
            //params['error_obj'] = err;
            //closeConnection(params);
            cb(err,params);
            return;
        }
     
        //console.log("Total rows inserted: "+result.rowsAffected);
        params['delete_count'] = result.rowsAffected;
        params['result'] = result;    

        var msg = 'rows deleted ' + result.rowsAffected; 
        params['output'] = { 'message' : msg }; 


        if ( params['commit'] ) {
            conn.execute("commit",[],{},function (err1,result1) {
                if (err1) {
                    //params['error_obj'] = err;
                    cb(err1,params);
                    return;
                }        
                cb(null, params);
                //closeConnection(params);
                return;
            });
        } else {    
            cb(null, params);
            //closeConnection(params);  
        }
    });
}


var autoFillFields = function (objDef, authFields, queryType) {
    
    // if creating a new row, populate create_user/user_id column
    if (queryType == 'insert') {
        if ("USER_ID" in objDef) {
            objDef['USER_ID'] = authFields.username;
        } else if ( "CREATE_USER" in objDef ) {
            objDef['CREATE_USER'] = authFields.username;
        } 
    }

    // populate last_updated/update_user/last_updated_user in any type of dml
    if ( "LAST_UPDATED" in objDef) {
        objDef['LAST_UPDATED'] = authFields.username;
    } else if ( "UPDATE_USER" in objDef) {
        objDef['UPDATE_USER'] = authFields.username;
    } else if ( "LAST_UPDATE_USER" in objDef) {
        objDef['LAST_UPDATE_USER'] = authFields.username;
    }

    if ("OPERATOR_ID" in objDef) {  
        if ( 'operator_id' in authFields ) {
            objDef['OPERATOR_ID'] = authFields.operator_id;
        } else {
            objDef['OPERATOR_ID'] = 'SKU_APP';
        }
    }

    var date = new Date();

    if ("SYS_UPDATE_DATE" in objDef) {
        objDef['SYS_UPDATE_DATE'] = date;
    }  

    if ("LAST_UPDATE_TS" in objDef) {
        objDef['LAST_UPDATE_TS'] = date;
    }

    if (queryType == 'insert') {
        if ("SYS_CREATE_DATE" in objDef) {
            objDef['SYS_CREATE_DATE'] = date;
        }
        if ("SYS_UPDATE_DATE" in objDef) {
            objDef['SYS_UPDATE_DATE'] = date;
        } 
        if ("UPLOAD_DATE" in objDef) {
            objDef['UPLOAD_DATE'] = date;
        }
        if ("CREATE_TIME" in objDef) {
            objDef['CREATE_TIME'] = date;
        }
        if ("CREATE_TS" in objDef) {
            objDef['CREATE_TS'] = date;
        }
    } else if (queryType == 'update') {
        if ("SYS_CREATE_DATE" in objDef) {
            //objDef['SYS_CREATE_DATE'] = Date();
            delete objDef['SYS_CREATE_DATE'];
        }  
        if ("FILE_UPLOAD" in objDef) {
            delete objDef['FILE_UPLOAD'];
        }
        if ("CREATE_TIME" in objDef) {
            delete objDef['CREATE_TIME'];
        }

        if ("CREATE_TS" in objDef) {
           delete objDef['CREATE_TS']; 
        }

        if ("CIFA_ID" in objDef) {  
            if (objDef['CIFA_ID'] == null || objDef['CIFA_ID'].length == 0) {
                delete objDef['CIFA_ID'];
            }
        }
    } else {

    }


    }
    return objDef;
};


module.exports = {
    'doConnect'       : doConnect,
    'executeSelect'   : executeSelect,
    'executeInsert'   : executeInsert,
    'executeUpdate'   : executeUpdate,
    'executeDelete'   : executeDelete,
    'executeStmt'     : executeStmt,
    'autoFillFields'  : autoFillFields,
    'connDetails'     : conn_details,
    'createPool'      : createPool,
    'getConnectionFromPool' : getConnectionFromPool,
    'releaseConnection'     : releaseConnection
};

/*exports.invokeModelAPI  = invokeModelAPI;
exports.doConnect       = doConnect;
exports.executeSelect   = executeSelect;
exports.executeInsert   = executeInsert;
exports.executeUpdate   = executeUpdate;
exports.executeDelete   = executeDelete;
exports.executeStmt     = executeStmt;
exports.autoFillFields  = autoFillFields;
*/

//exports db_conn = dbconn;
//invokeModelAPI(model,action,params,callbackTest);

/*
function getStatementFromObj (table,type,stmt_obj) {

    var arr = [];

    Object.keys(stmt_obj).forEach(function(key,index) {
        arr.push(key);
    });

    var ins_clause = arr.join(',');
    if (type == 'insert') {
        for(var i=0;i<arr.length;i++) {
            arr[i] = ':' + arr[i];
        }
        var val_clause = arr.join(',');
        return 'insert into ' + table + '(' + ins_clause + ') values(' + val_clause + ')';
    } else if (type == 'update') {
        for(var i=0;i<arr.length;i++) {
            arr[i] = arr[i] + '=:' + arr[i];
        }
        var set_clause = arr.join(',');
        return 'update ' + table + ' set  ' + set_clause;
    }
}
*/