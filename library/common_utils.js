/*
_page:1
_perPage:30
_sortDir:DESC
_sortField:id
*/

var db_api = require('./db_api');

var paginate = function (sourceList, page, perPage) {
    var totalCount = sourceList.length;
    var lastPage = Math.floor(totalCount / perPage);
    var sliceBegin = page*perPage;
    var sliceEnd = sliceBegin+perPage;
    var pageList = sourceList.slice(sliceBegin, sliceEnd);
    return {
        pageData: pageList,
        nextPage: page < lastPage ? page+1 : null,
        totalCount: totalCount
    }
};


var responseHandler = function (err, params) {
    var res = params['res'];
    // close database connection
    db_api.releaseConnection(params['conn']);

    if ('req' in params) {
        var req = params['req'];
        if ('query' in req) {
            params['pageNum'] = parseInt(req.query._page || 0);
            params['perPage'] = parseInt(req.query._perPage || 30);    
        }
    }

    if (err) {
        console.log("ERROR: Error occorred");
        console.log(err);
        res.send(401, 'Some error occurred');
        return;
    }

    var pageNum = null;
    var page = null;
    if ('pageNum' in params) {
        pageNum = params['pageNum'] - 1;
        perPage = params['perPage'];
        page = paginate(params['output'], pageNum, perPage);  
        if (page.nextPage) {
            res.set("Link", params['Link']+page.nextPage);
        }
        res.set("X-Total-Count", params['output'].length);
        res.status(200).json(page.pageData);
    } else {
        res.status(200).json(params['output']);
    }
};



/*
For every key in target, if the key exists in source, copy the value from source to target.
*/
var copy_keys = function  (src, target) { 
    Object.keys(target).forEach(function(key,index) {
        if (key in src) {
            target[key] = src[key];
        }
    }); 
    return target;
};


var getTablesAndRoles = function (role, cb) {
    return [   
        {   'role' : 'Admin',
            'table_name' : 'product_detail', 
            'privs' : 'rw'
        }
    ];
};


var getInsertClause = function (def) {
    return Object.keys(def).join(',');
};

var getValueClause = function (def) {
    var val_clause = '';
    Object.keys(def).forEach(function(key,index) {
        val_clause = val_clause + ':' + key + ',';
    });
    val_clause = val_clause.substring(0, val_clause.length - 1);
    return val_clause;
};

// returns string of format " COL1=:COL1, COL2=:COL2"
var getUpdateClause = function (def) {
    var upd_clause = '';
    Object.keys(def).forEach(function(key,index) {
        upd_clause = upd_clause + key + '=:' + key + ',';
    });
    upd_clause = upd_clause.substring(0, upd_clause.length - 1);
    return upd_clause;
};


var getConditionClauseByPK = function (keysArr) {
    var upd_clause = '';
    for (var i=0; i<keysArr.length; i++) {
        upd_clause = upd_clause + keysArr[i] + '=:' + keysArr[i] + ' and ';
    }
    upd_clause = upd_clause.substring(0, upd_clause.length - 5);
    return upd_clause;
};


// check if object has atleast one property
function isEmptyObject(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}

var getToday = function () {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    return yyyy+mm+dd;
    //today = mm+'/'+dd+'/'+yyyy;
};


module.exports = {
    'responseHandler' : responseHandler,
    'copy_keys' : copy_keys,
    'getInsertClause' : getInsertClause,
    'getValueClause' : getValueClause,
    'getUpdateClause' : getUpdateClause,
    'getToday'  : getToday,
    'getConditionClauseByPK' : getConditionClauseByPK
};


