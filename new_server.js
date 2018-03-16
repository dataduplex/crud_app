//UV_THREADPOOL_SIZE=15

var express         = require('express'),           // call express
    app             = express(),                    // define our app using express
    bodyParser      = require('body-parser'),
    db_api          = require('./library/db_api');
const   util        = require('util');
var     pool;   

var globals         = require('./library/globals');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/'));
//app.disable('etag');

var multer  = require('multer');
var upload  = multer({ dest: 'upload/' });
var fs      = require('fs');
var type    = upload.single('file');

var port        = process.env.PORT || 8080;
var expressJwt  = require('express-jwt');
var jwt         = require('jsonwebtoken');
var secret      = 'this is the secret secret secret 12356';
var bcrypt      = require('bcrypt');
var path        = require('path');
var nodeCleanup = require('node-cleanup');
 
nodeCleanup(function (exitCode, signal) {
    // release resources here before node exits 
    console.log('Received exit code: ');
    console.log(exitCode);
    console.log('Received signal: ');
    console.log(signal);

});

process.on('exit', function() {
    console.log('[INFO]: exiting..');
})

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
    console.log('Ctrl-C...');
    process.exit(2);
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', function(e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
});

// get an instance of the express Router
var router = express.Router();              
// Secure our routes
//app.use('/pc_api', expressJwt({secret: secret}));

app.all('/*', function(req, res, next) {


console.log('[INFO] Inside all');

//console.log('request header: ');
//console.log(req.header);

  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  //res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    console.log('[INFO] Inside all - calling next');
    req['DB_CONN_POOL'] = pool;
    next();
  }

});



app.use(function(req, res, next) {
  res.on('finish', function() {
    console.log('[INFO] Inside finish');
    /*if ('conn' in req) {
        if (req['conn']) {
            console.log('[INFO] MIDDLEWARE Closing connection');
            req['conn'].close(function(err) {
                console.log('[ERROR] MIDDLEWARE Error occurred while Closing connection');
                console.log(err);
                return;
            });
        }
    }*/
    var poolInfo = {
        connectionsInUse: pool.connectionsInUse,
        connectionsOpen : pool.connectionsOpen,
        poolIncrement   : pool.poolIncrement,
        poolMax         : pool.poolMax,
        poolMin         : pool.poolMin,
        poolTimeout     : pool.poolTimeout,
        stmtCacheSize   : pool.stmtCacheSize
    };
    console.log('[INFO] Pool Info');
    console.log(poolInfo);

  });
  next();
});


//'Bearer '
app.use('/pc_api', function(req, res, next) { 

    //res.setHeader('Last-Modified', (new Date()).toUTCString());

    //var d = new Date();
    console.log(req.params);
    //var token = req.headers['Authorization'];
    var token = null;
    if (req.headers['authorization']) {
        token = req.headers['authorization'].substring(7);
    } else if (req.query.token) {
        token = req.query.token;
    } 
    //str
    if (token) { 
        jwt.verify(token, secret, function(err, decoded) {      
            if (err) {
                return res.status(401).send({ 
                    success: false, 
                    message: 'Failed to authenticate' 
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                console.log('[DEBUG] decoded token');
                console.log(decoded);
                console.log('Getting DB connection for: '+req.path);
                // Get a DB connection
                db_api.getConnectionFromPool({ }, function(err,params){
                    if (err) {
                        console.log("[ERROR] Cannot get a DB Connection");
                        console.log(err);
                        return res.status(500).send({ 
                            success: false, 
                            message: 'Cannot get a DB Connection' 
                        });
                    } else {

                        req['conn'] = params['DB_CONN'];
                        //console.log(req['conn']);
                        next();        
                    }

                });

                /*pool.getConnection( function(err, conn) {

                    if (err) {
                        console.log("[ERROR] Cannot get a DB Connection");
                        console.log(err);
                        return res.status(500).send({ 
                            success: false, 
                            message: 'Cannot get a DB Connection' 
                        });
                    } else {
                        req['conn'] = conn;
                        next();        
                    }
                });*/
            }
        });
    } else {
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
    }    
});


app.get('/test', function(req, res) {
    res.status(200).send({ message: 'welcome' });        
});


app.get('/pc_api/secure.html', function(req, res) {

    //res.setHeader('Last-Modified', (new Date()).toUTCString());
    db_api.releaseConnection(req['conn']);
    var landing_view = null;
    landing_view = '/landing_'+req.decoded.role.toLowerCase()+'.html';
    //landing_view = '/secure.html';
    res.sendFile(path.join(__dirname + landing_view));
    //return res.status(200).send({'message' : 'Hello, welcome to pc_api!'});
});


// password_reset
// var token = req.body.token || req.query.token || req.headers['Authorization'];
// Landing route
app.post('/authenticate', function (req, res) {
    var profile = { };
    var params = { 
        'id_lookup' : true,
        'stmt' : 'select username, password, role, email from sku_app.app_users where username=:USERNAME',
        'table' : 'app_users',
        'res' : res,
        'bind_obj' : { 'USERNAME' : req.body.username }
    };

    console.log('[INFO] Inside authenticate');

    var poolInfo = {
        connectionsInUse: pool.connectionsInUse,
        connectionsOpen : pool.connectionsOpen,
        poolIncrement   : pool.poolIncrement,
        poolMax         : pool.poolMax,
        poolMin         : pool.poolMin,
        poolTimeout     : pool.poolTimeout,
        stmtCacheSize   : pool.stmtCacheSize
    };

    console.log('[INFO] Pool Info before authenticate');
    console.log(poolInfo);

    pool.getConnection( function(err, conn) {
        if (err) {
            return res.status(500).send({ 
                        success: false, 
                        message: 'DB Connection Error' 
            });
        }
        params['conn'] = conn;
        req['conn'] = conn;
        db_api.executeSelect(params, function (err,params) {
            console.log(params['output']);
            bcrypt.compare(req.body.password, params['output']['PASSWORD'], function (err, isMatch) {
                if (err) {
                    console.log('[ERROR] Error occurred during Authentication');
                    console.log(err);
                    console.log('[INFO] Closing connection after select from app_users 2');
                    conn.close(function(err) {
                        if (err) {
                            console.log("[ERROR] Error releasing connection 2");
                            console.log(err);
                            return;
                        }

                        var poolInfo = {
                            connectionsInUse: pool.connectionsInUse,
                            connectionsOpen : pool.connectionsOpen,
                            poolIncrement   : pool.poolIncrement,
                            poolMax         : pool.poolMax,
                            poolMin         : pool.poolMin,
                            poolTimeout     : pool.poolTimeout,
                            stmtCacheSize   : pool.stmtCacheSize
                        };
                        console.log('[INFO] Pool Info before authenticate close 2');
                        console.log(poolInfo);
                    });

                    res.status(401).send({ 
                        success: false, 
                        message: 'Failed to authenticate' 
                    });
                    return;    
                }
                if (isMatch) {
                    profile = {
                        'username' : req.body.username,
                        'role' : params['output']['ROLE'],
                        'email' : params['output']['EMAIL']
                    };
                    console.log(profile);
                    var token = jwt.sign(profile, secret, { expiresIn: 60*50 });
                    res.status(200).send({ token: token, profile: profile });        
                } else {
                    res.status(401).send({ 
                        success: false, 
                        message: 'Invalid credentials' 
                    });
                }

                console.log('[INFO] Closing connection after select from app_users');

                conn.close(function(err) {
                    if (err) {
                        console.log("[ERROR] Error releasing connection");
                        console.log(err);
                        return;
                    }


                        var poolInfo = {
                            connectionsInUse: pool.connectionsInUse,
                            connectionsOpen : pool.connectionsOpen,
                            poolIncrement   : pool.poolIncrement,
                            poolMax         : pool.poolMax,
                            poolMin         : pool.poolMin,
                            poolTimeout     : pool.poolTimeout,
                            stmtCacheSize   : pool.stmtCacheSize
                        };
                        console.log('[INFO] Pool Info before authenticate close');
                        console.log(poolInfo);
                });

                //cb(null, user_obj);
            });

        });

    }); 


});


//passwordCurr passwordNew passwordNew2
app.post('/password_reset', function (req, res) {

    if (req.body.passwordNew != req.body.passwordNew2) {
        return res.status(401).send({ 
            success: false, 
            message: "Passwords don't match" 
        });
    }


    pool.getConnection( function(err, conn) {

        if (err) {
            return res.status(500).send({ 
                        success: false, 
                        message: 'DB Connection Error' 
            });
        }

        var params = { 
            'id_lookup' : true,
            'stmt'      : 'select username, password, role from sku_app.app_users where username=:USERNAME',
            'table'     : 'app_users',
            'res'       : res,
            'bind_obj'  : { 'USERNAME' : req.body.username },
            'conn'      : conn,
            'keepDBConnAlive' : true 
        };
      
        db_api.executeSelect(params, function (err,params) {
            console.log(params['output']);
            bcrypt.compare(req.body.passwordCurr, params['output']['PASSWORD'], function (err, isMatch) {
                if (err) {
                    return res.status(401).send({ 
                        success: false, 
                        message: 'Failed to authenticate' 
                    });    
                }
                if (isMatch) {

                    var pswdEncrypt = require('./user_mgmt/user_auth.js').encrypt;
                    pswdEncrypt({ 'passwd' : req.body.passwordNew }, function (user_obj) {
                       var params = { 
                            'stmt'  : 'update sku_app.app_users set PASSWORD=:PASSWORD where username=:USERNAME',
                            'table' : 'app_users',
                            'bind_obj'  : { 'USERNAME' : req.body.username, 'PASSWORD' : user_obj.passwd_hash },
                            'commit'    : true,
                            'conn'      : conn
                        };
                        db_api.executeUpdate(params, function (err,params) {
                            if (err) {
                                return res.status(401).send({ 
                                    success: false, 
                                    message: "Internal error, Sorry" 
                                });
                            }
                            res.status(200).send({ success: true });        
                        });
                    }); 

                } else {
                    return res.status(401).send({ 
                        success: false, 
                        message: 'Invalid credentials' 
                    });
                }
            });
        });

     });   

});


app.route('/pc_api/product_definition')
    .post(function(req, res) {
        require('./routes/product_definition').HandlePost(req, res);
    })

    .get(function(req, res) {
      require('./routes/product_definition').HandleGet(req, res);  
    });

app.route('/pc_api/product_definition/:sku')
    .get(function(req, res) {
        require('./routes/product_definition').HandleGetByID(req, res);    
    })

    .put(function(req, res) {
        require('./routes/product_definition').HandlePutByID(req, res);
    })

    .delete(function(req, res) {       
        require('./routes/product_definition').HandleDeleteByID(req, res);
    });




app.route('/pc_api/image_urls')
    .post(function(req, res) {
        require('./routes/image_urls').HandlePost(req, res);
    })

    .get(function(req, res) {
      require('./routes/image_urls').HandleGet(req, res);  
    });

app.route('/pc_api/image_urls/:id')
    .get(function(req, res) {
        require('./routes/image_urls').HandleGetByID(req, res);    
    })

    .put(function(req, res) {
        require('./routes/image_urls').HandlePutByID(req, res);
    })

    .delete(function(req, res) {       
        require('./routes/image_urls').HandleDeleteByID(req, res);
    });



app.route('/pc_api/file_upload')
    .post(function(req, res) {
        req.app_root_dir = __dirname;
        require('./routes/file_upload').HandlePost(req, res);
    })

    .get(function(req, res) {
      require('./routes/file_upload').HandleGet(req, res);  
    });

app.route('/pc_api/file_upload/:file_name')
    .get(function(req, res) {
        require('./routes/file_upload').HandleGetByID(req, res);    
    });

app.route('/pc_api/imports')
    .get(function(req, res) {
      require('./routes/imports').HandleGet(req, res);  
    });

app.post('/pc_api/file_transfer', type, function(req, res) {

    console.log(util.inspect(req.body, {showHidden: false, depth: null}));
    
    var tmp_path = req.file.path;
    var target_path = 'upload/' + req.file.originalname;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);

    src.pipe(dest);
    src.on('end', function() { res.json({'filename' : req.file.originalname}); });
    src.on('error', function(err) { res.json({'Result' : 'Error'}); });
    // Upload XML to DB
    db_api.releaseConnection(req['conn']);

});


app.route('/pc_api/approvals')
    .get(function(req, res) {
      require('./routes/approvals').HandleGet(req, res);  
    });

app.route('/pc_api/approvals/:id')
    .get(function(req, res) {
      require('./routes/approvals').HandleGetByID(req, res);  
    });



app.route('/pc_api/approve_sku')
    .put(function(req, res) {
        //require('./routes/product_definition').HandlePost(req, res);
       //res.status(200).send({ 'RETURN_STATUS': req.body.STATUS, 'SKU' : req.body.SKU });         
       require('./routes/approve_sku').HandlePutByID(req, res);
    });


app.route('/pc_api/batch_approve_sku')
    .put(function(req, res) {
       require('./routes/batch_approve_sku').HandlePutByID(req, res);
    });

app.route('/pc_api/batch_update_rel')
    .put(function(req, res) {
       require('./routes/batch_update_rel').HandlePutByID(req, res);
    });


app.route('/pc_api/get_active_release')
    .get(function(req, res) {
       require('./routes/get_active_release').HandleGet(req, res);
    });


app.route('/pc_api/file_exports')
    .post(function(req, res) {
        require('./routes/file_exports').HandlePost(req, res);
    })

    .get(function(req, res) {
      require('./routes/file_exports').HandleGet(req, res);  
    });

app.route('/pc_api/file_exports/:id')
    .get(function(req, res) {
        require('./routes/file_exports').HandleGetByID(req, res);    
    })

    .put(function(req, res) {
        require('./routes/file_exports').HandlePutByID(req, res);
    });


app.route('/pc_api/release_versions')
    .post(function(req, res) {
        require('./routes/release_versions').HandlePost(req, res);
    })

    .get(function(req, res) {
      require('./routes/release_versions').HandleGet(req, res);  
    });

app.route('/pc_api/release_versions/:rel_version')
    .get(function(req, res) {
        require('./routes/release_versions').HandleGetByID(req, res);    
    })

    .put(function(req, res) {
        require('./routes/release_versions').HandlePutByID(req, res);
    })

    .delete(function(req, res) {       
        require('./routes/release_versions').HandleDeleteByID(req, res);
    });



var server_params = { 'app' : app, 'router' : router, 'port' : port };
var db_conn = null;
var connectDB_and_start_server = function (err, params) {
    //app.use(express.json());
    //app.use(express.urlencoded());
    if (err) {
        console.log('Some error occurred while starting server');
        console.log(err);
        return;
    }

    //db_conn = params['db_conn'];
    pool    = params['DB_CONN_POOL'];
    params['app'].listen(params['port']);
    console.log('Magic happens on port ' + port);
};


var env_setup = function () { 
    globals.globalVars['ROOT_DIR'] = __dirname;   
    //db_api.doConnect(server_params, connectDB_and_start_server);
    db_api.createPool(server_params, connectDB_and_start_server);
};

// Go for it!
env_setup();
