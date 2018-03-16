/**
 * Created by jeluma200 on 7/20/16.
 */
var table = {
    "USERNAME" : "",
    "PASSWORD" : "",
    "ROLE" : ""
};

var primary_keys = ['USERNAME'];

var table_name = "app_users";
var oracledb = require('oracledb');


/*var deleteTableRows = function(obj,cb) {

    var where_clause = " where";
    oracledb.autoCommit = true;

    if (obj.keys) {
        for (var i = 0, len = primary_keys.length; i < len; i++) {
            where_clause = where_clause + " " + primary_keys[i] + " = '" + obj.keys[primary_keys[i]] + "'";
        }
        obj.stmt="delete from " + table_name + where_clause;
    } else {
        obj.stmt="delete from " + table_name;
    }

    oracledb.getConnection(
        obj.db_conn_str,
        function(error, conn){
            if (error) {
                cb(error,obj);
                return;
            }
            obj.conn_obj = conn;
            conn.execute(obj.stmt, [], {outFormat: oracledb.OBJECT}, function (err,result) {
                if (err) {
                    cb(err,obj);
                    return;
                }
                obj.result = result;
                //console.log("Total rows deleted: "+result.rowsAffected);
                //console.log(result.rows);
                cb(null, obj);
            });
        });
};*/

var insertTableRows = function(obj,cb) {

    //var oracledb = require('oracledb');
    oracledb.autoCommit = true;
    obj.stmt = "insert into " + table_name + "(" +
        "USERNAME,PASSWORD,ROLE)" +
        " values(:USERNAME, :PASSWORD, :ROLE)";


    oracledb.getConnection(
        obj.db_conn_str,
        function(error, conn){
            if (error) {
                cb(error,obj);
                return;
            }
            obj.conn_obj = conn;
            conn.execute(obj.stmt, obj.bind_obj, {outFormat: oracledb.OBJECT}, function (err,result) {
                if (err) {
                    cb(err,obj);
                    return;
                }
                obj.result = result;
                //console.log("Total rows inserted: "+result.rowsAffected);
                //console.log(result.rows);
                cb(null, obj);
            });
        });

};


var selectTableRows = function(obj,cb) {

    var where_clause = " where ";
    if (obj.keys) {
        for (var i = 0, len = primary_keys.length; i < len; i++) {
            where_clause = where_clause + " " + primary_keys[i] + " = '" + obj.keys[i] + "'";
        }
        obj.stmt="select * from " + table_name + where_clause;
    } else {
        obj.stmt="select * from " + table_name;
    }
    //fetchInfo: myfetchInfo
    oracledb.getConnection(
        obj.db_conn_str,
        function(error, conn){
            if (error) {
                cb(error,obj);
                return;
            }
            obj.conn_obj = conn;
            conn.execute(obj.stmt, [], {outFormat: oracledb.OBJECT}, function (err,result) {
                if (err) {
                    cb(err,obj);
                    return;
                }
                obj.result = result.rows;
                cb(null, obj);
            });

        });
};

exports.selectTableRows = selectTableRows;
exports.insertTableRows = insertTableRows;
exports.primary_keys = primary_keys;
