var db_api  		= require('../library/db_api');
var utils   		= require('../library/common_utils');
var excel_reader   	= require('./consume_tabbed_excel');
const   util        = require('util');
var fs      		= require('fs');
var sku_app_schema 	= 'SKU_APP';
var json2xls 		= require('json2xls');
var globals 		= require('../library/globals');
var mailLib			= require('../library/sendMail');

var ingestion_order = [
	'PRODUCT_DEFINITION',
	'IMAGE_URLS'
];

/*
change below fields from global to local

2. overall_status
3. inputFileFull
4. inputFile
5. operator_id
6. mode
7. overall_status
8. overall_status_ext
9. ctrlParams
*/

var ctrl_fields = [
	'SYS_CREATE_DATE',
	'SYS_UPDATE_DATE',
	'OPERATOR_ID',
	'USER_ID'
];

//	'IMEI_PREFIX',
//var inputFileFull 	= '';
//var inputFile 		= '';
var operator_id 	= 'SKU_APP';
//var mode 			= 'full';
//var inputFileBase = '';
/*var overall_status = {
	'FILE_NAME' : '',
	'ERROR_MESSAGE' : '',
	'TOTAL_PARSED' : 0,
	'TOTAL_UPLOADED' : 0,
	'TOTAL_FAILED' : 0
};*/


/*var overall_status_ext = {
	'TOTAL_SUCCESS' : 0,
	'TOTAL_FAILURE' : 0,
	'ACTION' : null
};*/

var file_upload = require('../models/file_upload');
//var ctrlParams = { };

// Checks if an object is empty
// GOOD
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


function endProcess(overallStatus) {

	console.log('[INFO] endProcess :: Closing connections and cleaning up');

	db_api.releaseConnection(overallStatus['DB_CONN']);

	//var json2xls = require('json2xls');
	var xls = json2xls(overallStatus['STATUS_OBJECTS']);
	//console.log('globals');
	//console.log(globals);

	var rootDir = globals.globalVars['ROOT_DIR'];

	if (rootDir==null) {
		rootDir = process.env.SKU_APP_ROOT;	
	}

	var emailDir = rootDir + '/upload';
	var emailFile = emailDir + '/OUTPUT_' + overallStatus['FILE_NAME'];

	console.log('[DEBUG] Writing excel file to: '+emailFile);
	fs.writeFileSync(emailFile, xls, 'binary');
	console.log('[DEBUG] Done');
	// 1. close database connection
	// 2. Send email.

	var status = '';
	var text = "Input filename: " + overallStatus['FILE_NAME'] + "\n";
	text = text + "TOTAL_FAILURE = " + overallStatus['TOTAL_FAILURE'] + "\n";
	text = text + "TOTAL_SUCCESS = " + overallStatus['TOTAL_SUCCESS'];
	var emailAddress = overallStatus['CTRL_PARAMS']['email'];
	if (overallStatus['TOTAL_FAILURE']>0) {
		status = 'FAILED';
	} else {
		status = 'SUCCESS';
	}

	var mailOptions = {
	    from: 'jelumalai.modesto@gmail.com', // sender address
	    to: emailAddress,
	    subject: 'File Processing: '+status, // Subject line
	    text: text, // plain text body
	    attachments: [
	        {   // filename and content type is derived from path
	            path: emailFile
	        }
	    ]
	};

	console.log('[DEBUG] Sending email to: '+emailAddress);
	console.log(mailOptions);

	// send mail with defined transport object
	mailLib.transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	    	console.log(error);
	        return;
	    }
	    console.log('[INFO] Message %s sent: %s', info.messageId, info.response);
	});

}

// Close DB Connection
function closeConnection(obj) {

        obj['DB_CONN'].close(function(err) {
            if (err) { 
                console.log("[ERROR] Error releasing connection");
                console.log(err.message); 
                return;
            }
            console.log('[DEBUG] DB connection closed');
        });
    

}

function closeConnection2(conn) {

        conn.close(function(err) {
            if (err) { 
                console.log("[ERROR] Error releasing connection");
                console.log(err.message); 
                return;
            }
            console.log('[DEBUG] DB connection closed');
        });
    
}


// Convert a string of MM/DD/YY or MM/DD/YYYY format to a javascript date object
// GOOD
function convertStrToDate(objDef, obj) {
	var meta = objDef.meta_def;
	if ('date_cols' in meta) {
		var date_cols = meta.date_cols;
		for (var col in date_cols) {
			if ((col in obj) && obj[col]) {
				var parts = obj[col].split('/');
				//console.log('parts:');
				//console.log(parts);
				if (parts.length>1) {
					if (parts[2].length == 2) {
						parts[2] = '20'+parts[2];
					}
				} else {
					parts = obj[col].split('-');
					if (parts[2].length == 2) {
						parts[2] = '20'+parts[2];
					}
				}
				var mydate = new Date(parts[2],parts[0]-1,parts[1]);	
				obj[col] = mydate;
				//obj[col] = null;
			}
		}
	} 
}


// If all key values are empty, null or spaces, return true
// GOOD
function isAllKeysAreEmpty(obj) {

	if (isEmpty(obj)) {
		console.log('Obbject is empty');
		return true;
	}

	for(var key in obj) {
		if ((obj[key] != null) && (obj[key].trim().length>0)) {
			// Does it have some value, then return true
			return false;
		}
	}			
	// If we are here all keys are either null or spaces
	return true;
}

// given a row object and it's meta data, check if it's PK exists
// GOOD
function checkPKExists (obj, tableDef) {
	//console.log('[checkPKExists] ');
	//console.log(tableDef);
	//console.log(obj);
	var result = true;
	//var primary_keys = ['SKU'];
	for (var i=0; i<tableDef.primary_keys.length; i++) {
		if ( ! ( tableDef.primary_keys[i] in obj) ) {
			result = false;
		}
	}
	//console.log('[checkPKExists] '+result);
	return result;
}

// Check if all columns in excel has a corresponding column in table
// GOOD
function validateTableStructure (obj, tableDef) {
	console.log('[validateTableStructure] '+tableDef.table_name);
	//console.log(tableDef);
	//console.log(obj);
	var def = tableDef.definition;
	var result;
	//var primary_keys = ['SKU'];

	for (var key in obj) {
		if (! (key in def)){
			return { 'STATUS' : 'FAIL', 'KEY' : key };
		}
	}	

	return { 'STATUS' : 'PASS', 'KEY' : '' };
}

// Given an table row object and it's definition. 
// Check if the primary is not null
// GOOD
function checkPKIsNotNull (obj, tableDef) {
	var result = true;
	//var primary_keys = ['SKU'];
	for (var i=0; i<tableDef.primary_keys.length; i++) {
		
		if (obj[tableDef.primary_keys[i]] == null) {
			return false;
		} 

		if ( obj[tableDef.primary_keys[i]].length == 0 ) {
			return false;
		}

	}
	return true;
}


// TODO: make sure params is populated in calling functions
var processFile = function (err, params) {

	//var DB_CONN = params['DB_CONN'];
	var os = params;

	if (err) {
		console.log('[ERROR] Error occurred');
		console.log(err);
		//closeConnection2(params['DB_CONN']);
		//db_api.releaseConnection(params['DB_CONN']);
		endProcess(os);
		return;
	}

	//console.log('params.FILE');
	var all_excel_rows = excel_reader.consumeExcel(params.FILE_PATH);
	var inputFile 		= baseName(params.FILE_PATH);

	var all_tables_rows = { };
	var all_filtered_rows = { };

	// ignore sheets which are not in ingestion_order
	Object.keys(all_excel_rows).forEach(function(key,index) {
		//console
		var exists = false;
		for (var i=0;i<ingestion_order.length;i++) {
			if (ingestion_order[i] == key) {
				exists = true;
				break;
			}
		}

		if ( exists ) {
			console.log('[INFO] Adding excel sheet '+key+' for processing');
			all_filtered_rows[key] =  all_excel_rows[key];
		} else {
			console.log('[WARN] Ignoring excel sheet '+key);
		}
	});	

	// Check if we have the model file corresponding to every excel tab (or table)
	var root_dir = params['app_root_dir'];
	console.log('[INFO] root_dir: '+root_dir);
	console.log('[INFO] Checking model file exists for all tables');
	for(var key in all_filtered_rows) { 
		var tableName = key.toLowerCase();
		var modelFile = '../models/'+tableName;
		//		var file_exists = 
		if ( ! fs.existsSync(root_dir+'/../models/'+tableName+'.js') ) {
			var err_msg = 'Model file doesnt not exist for '+tableName;
			console.log('[ERROR] '+err_msg);
			updateFileUploadTable('ERROR', err_msg, function (err, params) {
				if (err) {
					console.log('[ERROR] Error updating file_upload table');
					console.log(err);
				}
				endProcess(params);
			}, {
				'FILE_NAME' : inputFile,
				'TOTAL_SUCCESS' : '0',
				'TOTAL_FAILURE' : '1',
				'DB_CONN' : params['DB_CONN'],
				'STATUS_OBJECTS' 	: [],
				'CTRL_PARAMS' 		:  params['CTRL_PARAMS']
			});
			return;
		}

	}	

	// Remove empty objects
	console.log('[INFO] Removing empty excel rows');
	Object.keys(all_filtered_rows).forEach(function(key,index) {
		for (var i=0; i<all_filtered_rows[key].length; i++) {
			var allKeysEmpty = isAllKeysAreEmpty(all_filtered_rows[key][i]);
			console.log('allKeysEmpty: '+allKeysEmpty);
			if (allKeysEmpty) {
				console.log('[WARN] Empty object found.. removing..');
				console.log(all_filtered_rows[key][i]);
			} else {
				//all_tables_rows[]
				if (key in all_tables_rows) {
					//all_tables_rows[key][i] = all_filtered_rows[key][i];
					all_tables_rows[key].push(all_filtered_rows[key][i]);
				} else {
					all_tables_rows[key] = [];
					all_tables_rows[key].push(all_filtered_rows[key][i]);
				}
			}		
		}
	});


	//Validation: Check if all objects have primary key populated	
	console.log('[INFO] Checking primary key is not null for all rows');
	for(var key in all_tables_rows) { 
		var tableName = key.toLowerCase();
		var modelFile = '../models/'+tableName;

		// check if primary key is present and exists for all rows
		var tableDef = require(modelFile+'.js');
		//console.log('[INFO] '+modelFile+' Exists');
		for (var i=0; i<all_tables_rows[key].length; i++) {

			// If key name is UNDEFINED and it has nothing but space, remove it
			if ('UNDEFINED' in all_tables_rows[key][i]) {
				if (all_tables_rows[key][i]['UNDEFINED'].trim().length==0) {
					console.log('[INFO] Removing invalid field -> UNDEFINED');
					delete all_tables_rows[key][i]['UNDEFINED'];
				}
			}

			//checkPKExists(all_tables_rows[key][i],tableDef);	
			// if all keys are empty, remove this object
			//console.log('Checking rownum'+i);
			if (! ( checkPKExists(all_tables_rows[key][i], tableDef) ) ) {

					var err_msg = 'Primary Key not found in table' + tableDef.table_name;
					console.log(err_msg);

					updateFileUploadTable('ERROR', err_msg, function (err, params) {
						//console.log('Update stmt was successful');						
						if (err) {
							console.log('[ERROR] Error updating file_upload table');
							console.log(err);
							
						}
						//db_api.releaseConnection(params['DB_CONN']);
						endProcess(params);
					}, {
						'FILE_NAME' : inputFile,
						'TOTAL_SUCCESS' : '0',
						'TOTAL_FAILURE' : '1',
						'DB_CONN' : params['DB_CONN'],
						'STATUS_OBJECTS' : [],
						'CTRL_PARAMS' 		:  params['CTRL_PARAMS']
					});
					console.log('[ERROR]'+ err_msg);
					console.log(all_tables_rows[key][i]);
					return;
			}

			if (! ( checkPKIsNotNull(all_tables_rows[key][i], tableDef) ) ) {

					var err_msg = 'Primary key value is null or empty' + tableDef.table_name;
					updateFileUploadTable('ERROR', err_msg, function (err, params) {
						//console.log('Update stmt was successful');
						if (err) {
							console.log('[ERROR] Error updating file_upload table');
							console.log(err);
						}
						//db_api.releaseConnection(params['DB_CONN']);
						endProcess(params);
					}, {
						'FILE_NAME' : inputFile,
						'TOTAL_SUCCESS' : '0',
						'TOTAL_FAILURE' : '1',
						'DB_CONN' : params['DB_CONN'],
						'STATUS_OBJECTS' : [],
						'CTRL_PARAMS' 		:  params['CTRL_PARAMS']
					});
					console.log('[ERROR]'+ err_msg);
					//console.log('[ERROR] Ignoring object');
					//console.log(all_tables_rows[key][i]);
					return;
			}

			var validationResult = validateTableStructure(all_tables_rows[key][i], tableDef);

			if ( validationResult['STATUS'] == 'FAIL' ) {
				var err_msg = 'Excel key ' + validationResult['KEY'] + ' not found in table ' + tableDef.table_name;
				updateFileUploadTable('ERROR', err_msg, function (err, params) {
					console.log('Update stmt was successful');
					if (err) {
						console.log('[ERROR] Error updating file_upload table');
						console.log(err);
					}
					//db_api.releaseConnection(params['DB_CONN']);
					endProcess(params);
				}, {
					'FILE_NAME' : inputFile,
					'TOTAL_SUCCESS' : '0',
					'TOTAL_FAILURE' : '1',
					'DB_CONN' : params['DB_CONN'],
					'STATUS_OBJECTS' : [],
					'CTRL_PARAMS' 		:  params['CTRL_PARAMS']
				});
				console.log('[ERROR]'+ err_msg);
				//console.log('[ERROR] Ignoring object');
				console.log(all_tables_rows[key][i]);
				return;
			}

			// remove control fields
			console.log('[INFO] Removing control fields, if there are any');
			for (var k=0;k<ctrl_fields.length;k++) {
				var field = ctrl_fields[k];
				if (field in all_tables_rows[key][i]) {
					delete all_tables_rows[key][i][field];
				}	
			}

			for(var field in all_tables_rows[key][i]) {
				var val = all_tables_rows[key][i][field].trim();
				all_tables_rows[key][i][field] = val;
			}	
		}
	}

	// create supplementary objects for product_definition

	if (params['ACTION'] == 'insert' && ('PRODUCT_DEFINITION' in all_tables_rows)) {
		console.log('[INFO] Creating supplementary data for product_definition');
		all_tables_rows['PRODUCT_DEFINITION_EXT'] = [];
		for (var i=0;i<all_tables_rows['PRODUCT_DEFINITION'].length;i++) {
			all_tables_rows['PRODUCT_DEFINITION_EXT'][i] = { 'SKU' : all_tables_rows['PRODUCT_DEFINITION'][i]['SKU'],
															'REL_VERSION' : null}
		}
	}

	// If model number is present.
	// Add it to the first group
	var table_rows = null;
	var table_def = null;
	var all_rows = [];
	var arr = [];
	var group = 0;
	//all_rows = [];

	if ( ('MODEL_NUMBER' in all_tables_rows) && (all_tables_rows['MODEL_NUMBER'].length>0)) {
		//console.log('[DEBUG] Inside model_number clause');
		console.log('[INFO] Adding MODEL_NUMBER and it\'s child tables for processing');
		all_rows[group] = [];
		table_rows = all_tables_rows['MODEL_NUMBER'];
		table_def = require('../models/model_number');
		
		for (var i=0; i<table_rows.length; i++) {
			addRowToInsert (all_tables_rows, group, table_rows[i], table_def, all_rows);
			group++;
		}
	}


	if ( ('PRODUCT_DEFINITION' in all_tables_rows) && (all_tables_rows['PRODUCT_DEFINITION'].length>0)) {
		console.log('[INFO] Adding PRODUCT_DEFINITION and it\'s child tables for processing');
		table_rows = all_tables_rows['PRODUCT_DEFINITION'];
		table_def = require('../models/product_definition');
		
		for (var i=0; i<table_rows.length; i++) {
			//group++;
			// all_rows, group, single row, table definition, output_array
			addRowToInsert (all_tables_rows, group, table_rows[i], table_def, all_rows);
			group++;
		}
	}

	console.log('all_tables_rows');
	console.log(all_tables_rows);
	console.log('[INFO] Adding all tables for processing');
	for (var i=0; i<ingestion_order.length; i++) {

		var currTableName = ingestion_order[i];
		console.log('[DEBUG] Checking table: '+currTableName);
		if (!(currTableName in all_tables_rows)) {
			continue;
		}
		console.log('[DEBUG] Processing table: '+currTableName);
		//var table_def = require('../models/product_definition');
		var currTableDef 	= require('../models/'+currTableName.toLowerCase());
		//console.log(currTableName);
		var currPrimaryKey = currTableDef.primary_keys[0];
		//var currTableRowKey	= curr_obj[curr_primary_key];

		for (var j=0; j<all_tables_rows[currTableName].length; j++) {
			var currObj = all_tables_rows[currTableName][j];
			//console.log('currObj');
			//console.log(currObj);
			//if currObj has not been added yet
			if (! ('meta_processed' in currObj)) {

				currObj['meta_processed'] = 1;

				var arr = [];
				arr[0] = currTableDef.table_name;
				arr[1] = currObj;
				arr[2] = 'READY';
				// What is this for?
				arr[3] = currObj[currPrimaryKey];

				if (group in all_rows) {
					all_rows[group].push(arr);
				} else {
					all_rows[group] = [];
					all_rows[group].push(arr);
				}

				
			} // check processed flag is not set
		} // next row in current table
	} // next table

	var status = [];
	status[0] = [];

	var overallStatusObj = {
		'TOTAL_FAILURE' : 0,
		'TOTAL_SUCCESS' : 0,
		'CTRL_PARAMS' 	: params['CTRL_PARAMS'],
		'FILE_NAME'		: inputFile,
		'ACTION'		: params['ACTION'],
		'DB_CONN'		: params['DB_CONN'],
		'STATUS_OBJECTS' : []
	};

	if (params['ACTION'] == 'insert') {
		console.log('[INFO] Starting the DB inserts');
		doInsertSKU(0,0,status,all_rows,overallStatusObj);
	} else {
		console.log('[INFO] Starting the DB updates');
		console.log(all_rows);
		doUpdateSKU(0,0,status,all_rows,overallStatusObj);
	}	 
}


// Pre-process the row before DB update 
// groups related table inserts into a single group
//GOOD
function addRowToInsert (all_obj, group, curr_obj, curr_table_def, all_rows) {

	console.log('[DEBUG] processing table: '+ curr_table_def.table_name);

	// get primary key from table def
	var curr_primary_key = curr_table_def.primary_keys[0];
	curr_obj['meta_processed'] = 1;


	if ( group in all_rows ) {
		var arr = [];
		arr[0] = curr_table_def.table_name;
		arr[1] = curr_obj;
		arr[2] = 'READY';
		arr[3] = curr_obj[curr_primary_key];
		all_rows[group].push(arr);
	} else {
		all_rows[group] = [ ];
		var arr = [];
		arr[0] = curr_table_def.table_name;
		arr[1] = curr_obj;
		arr[2] = 'READY';
		arr[3] = curr_obj[curr_primary_key];		
		all_rows[group].push(arr);
	}

	// TODO: define meta_def in all models
	if ('child' in curr_table_def.meta_def) {
		var childs = curr_table_def.meta_def['child'];
		for (var i=0; i<childs.length;i++) {

			var next_table_name 	= childs[i][0];
			var next_table_key_name = childs[i][1];
			var next_table_row_key 	= curr_obj[curr_primary_key];
			var next_model_file 	= '../models/'+next_table_name.toLowerCase();

			console.log('[DEBUG] processing child: '+ next_table_name);

			var next_table_def 	= require(next_model_file);
			if (next_table_name.toUpperCase() in all_obj) {

				var next_table = all_obj[next_table_name.toUpperCase()];
				var next_table_rows = findRowsInArray(next_table_key_name, next_table_row_key, next_table);

				if ( next_table_rows == null ) {

					console.log('[WARN] Nothing was found');
					continue;
				} else {
					// recur
					console.log('[DEBUG] Calling recursion');
					for (var j=0; j<next_table_rows.length; j++) {
						addRowToInsert(all_obj,group,next_table_rows[j],next_table_def,all_rows);
					}
				}
			} else {
				continue;
			}
		}
	} else {
		return all_rows;
		//exit from recursion
	}
}

// Given key, value and an array of objects which has key/value pairs
// find the object that matches this key and value
// GOOD
function findRowsInArray (key_name, key_value, table_arr) {

	var key_name_uc = key_name.toUpperCase();
	var key_name_lc = key_name.toLowerCase();
	//console.log('')

	var result = [];
	for (var i=0; i<table_arr.length; i++) {

		if ( key_name_uc in table_arr[i] && table_arr[i][key_name_uc] == key_value) {
			//return table_arr[i];
			result.push(table_arr[i]);
		} else if ( key_name_lc in table_arr[i] && table_arr[i][key_name_lc] == key_value ) {
			//return table_arr[i];
			result.push(table_arr[i]);
		}

	}

	if (result.length>0) {
		return result;
	} else {
		return null;	
	}
}


// sku_ind - this is the group index
// ind - this is the sub index within a group
// status - an object to store the results
// db_objects - db rows organized as groups
function doInsertSKU (sku_ind, ind, status, db_objects, overallStatus) {

	//console.log(db_objects);
	//console.log('ind: '+ind);
	var ctrlParams = overallStatus['CTRL_PARAMS'];
	var db_row = db_objects[sku_ind][ind];
	//var status_row = status[sku_ind];
	var table = db_row[0];
    var mymodel = require('../models/'+table);
    var bind_obj = Object.assign({}, mymodel.definition);

    bind_obj = db_api.autoFillFields(bind_obj, ctrlParams, 'insert');
    utils.copy_keys(mymodel.defaults,bind_obj);
    utils.copy_keys(db_row[1],bind_obj);

	var primary_keys = '';
	for(var i=0; i<mymodel.primary_keys.length; i++) {
		if (i == 0) {
			primary_keys = bind_obj[mymodel.primary_keys[0]];		
		} else {
			primary_keys = primary_keys + '__' + bind_obj[mymodel.primary_keys[i]];
		}
	}
 
 	convertStrToDate(mymodel,bind_obj);
	//console.log('table: '+table);
	//console.log(bind_obj);
	var ins_stmt = mymodel.ins_stmt;
	if ( table == 'product_definition' || table == 'PRODUCT_DEFINITION') {
		if (('CIFA_ID' in bind_obj) && (bind_obj['CIFA_ID'] == null || bind_obj['CIFA_ID'].length == 0)) {
			console.log('[INFO] CIFA_ID is null, removing it from bind object');
			delete bind_obj['CIFA_ID'];
			var temp = ins_stmt.replace(/,CIFA_ID/, '');
			temp 	 = temp.replace(/,:CIFA_ID/, '');
			ins_stmt = temp;
		}
	}
		
    var params = {
		'bind_obj' : bind_obj,
		'table' : table,
		'stmt' : ins_stmt,
		'commit' : false,
		'curr_ind' : ind,
		'conn'	: overallStatus['DB_CONN']
	};

	//overall_status['TOTAL_ROWS_PROCESSED']++;

	db_api.executeInsert(params,function (err, params) {

		status[sku_ind][ind] = {
			'FILE_NAME' 	: overallStatus['FILE_NAME'],
			'TABLE_NAME' 	: table,
			'PRODUCT_CODE' 	: primary_keys,
			'ACTION'		: overallStatus['ACTION']
		};

		if (err) {	
			console.log('[ERROR] DB error during insert');
			console.log(err);	
			status[sku_ind][ind]['SUCCESS'] = false;
			status[sku_ind][ind]['ERROR_MSG'] = err.toString();			 
			console.log(status[sku_ind][ind]['ERROR_MSG']);
			console.log(params);
			overallStatus['TOTAL_FAILURE']++;
		} else {
			status[sku_ind][ind]['SUCCESS'] = true;	
			status[sku_ind][ind]['ERROR_MSG'] = 'Processed Successfully';
			overallStatus['TOTAL_SUCCESS']++;
		}

		ind++;
		if (ind < db_objects[sku_ind].length) {			
			// Insert next element
			doInsertSKU(sku_ind,ind,status,db_objects,overallStatus);
		} else {
			sku_ind++;
			// Is there a next group to process?
			if (sku_ind < db_objects.length) {
				ind=0;
				status[sku_ind] = [];
				doInsertSKU(sku_ind,ind,status,db_objects,overallStatus);
			} else {
				console.log('[INFO]: Finished processing all rows from excel '+overallStatus['FILE_NAME']);

				if (overallStatus['TOTAL_FAILURE']>0) {
					for (var i=0; i<status.length; i++) {
						for (var j=0; j<status[i].length; j++) {
							status[i][j]['PERSISTED'] = 'N';
						}
					}

					// Rollback
					console.log('[INFO]: One or more rows failed. Rolling back');
					db_api.executeStmt( { 'stmt' : 'rollback',
										  'conn'	: overallStatus['DB_CONN'] },
										  //'keepDBConnAlive'	: true }, 
										  function (err1,params1) {
										  		if (err1) {
										  			console.log('[ERROR] Error during rollback');
										  			console.log(err1);
										  			//closeConnection(overallStatus);
										  			endProcess(overallStatus);
										  			return;
										  		}

						console.log('[INFO] Inserting status logs');
						doInsertStatus(0,0,status,overallStatus);
					});	

				} else {
					for (var i=0; i<status.length; i++) {
						for (var j=0; j<status[i].length; j++) {
							status[i][j]['PERSISTED'] = 'Y';
						}
					}

					console.log('[INFO] Inserting status logs');
					doInsertStatus(0,0,status,overallStatus);
				}

			}
		}
	});
}


// Recursively insert status rows
function doInsertStatus ( sku_ind,ind,status,overallStatus ) {

/*

    'FILE_NAME': null, Y
    'ACTION': null, Y
    'PRODUCT_CODE': null, Y
    'TABLE_NAME': null, Y
    'PERSISTED': null, Y
    'ERROR_MSG': null, Y
    'LAST_UPDATED' : null
*/

	var db_row = status[sku_ind][ind];
    var mymodel = require('../models/imports');
    var bind_obj = Object.assign({}, mymodel.definition);
    utils.copy_keys(mymodel.defaults,bind_obj);
    utils.copy_keys(db_row,bind_obj);

    bind_obj['LAST_UPDATED'] = new Date();
    bind_obj['ACTION'] = overallStatus['ACTION'];

    var params = {
		'bind_obj' : bind_obj,
		'table' : 'imports',
		'stmt' : mymodel.ins_stmt,
		'commit' : false,
		'curr_ind' : ind,
		'conn'	: overallStatus['DB_CONN'],
		//'keepDBConnAlive'	: true
	};

	overallStatus['STATUS_OBJECTS'].push(bind_obj);

	db_api.executeInsert(params,function (err, params) {
		if (err) {
			console.log('[ERROR] Error occurred during insert to imports table');
			console.log(err);
			console.log(params['bind_obj']);
			//closeConnection2(overallStatus['DB_CONN']);
			//endProcess(overallStatus);
			//return;
		}
		ind++;
		if (ind < status[sku_ind].length) {			
			// Insert next element
			doInsertStatus(sku_ind,ind,status,overallStatus);
		} else {
			sku_ind++;
			if (sku_ind < status.length) {
				ind=0;
				//status[sku_ind] = [];
				doInsertStatus(sku_ind,ind,status,overallStatus);
			} else {
				// Done with all rows and columns
				console.log('[INFO] Imports table updated');
				console.log(status);

				//overall_status['STATUS'] = 'COMPLETE';
        		//var file_upload_def = Object.assign({}, file_upload.definition);
        		//utils.copy_keys(overall_status,file_upload_def);
        		//var upd_clause = '';
        		//Object.keys(overall_status).forEach(function(key,index) {
            	//	upd_clause = upd_clause + key + '=:' + key + ',';
        		//});
        		//upd_clause = upd_clause.substring(0, upd_clause.length - 1);
        		//var stmt = 'update '+sku_app_schema+'.'+'file_upload set ' + upd_clause + ' where FILE_NAME = :FILE_NAME';

        		/*var params = {
            		'bind_obj' : overall_status,
            		'table' : 'file_upload',
            		'stmt' : stmt,
            		//'commit' : true
            		'commit' : true
        		};*/

				/*db_api.executeUpdate(params, function(upd_err,params) {
					if (upd_err) {
						console.log("[ERROR] Some error occurred during update: "+upd_err);
						console.log(params['bind_obj']);
						return;
					}

					console.log('Rows updated: '+params['update_count']);
					return;
				});*/

				// This is our final update
				var fileUploadStatus = null;
				var err_msg = '';
				if (overallStatus['TOTAL_FAILURE'] == 0) {
					fileUploadStatus = 'COMPLETE';
					err_msg = 'Completed';
				} else {
					fileUploadStatus = 'ERROR';
					err_msg = 'Failed';
				}


				updateFileUploadTable(fileUploadStatus, err_msg, function (err, params) {
					//console.log('Update stmt was successful');						
					if (err) {
						console.log('[ERROR] Error updating file_upload table');
						console.log(err);
						//closeConnection(overallStatus);
						//closeConnection(overallStatus);
						//endProcess(overallStatus);
						//return;
					}
					endProcess(overallStatus);
					//return;
				}, overallStatus);
			}
		}

	});
}

/*

*/
function updateFileUploadTable (status, err_msg, cb, overallStatus) {

	var bindObj = { 
		'FILE_NAME' 		: overallStatus['FILE_NAME'],
		'STATUS'			: status,
		'TOTAL_UPLOADED'	: overallStatus['TOTAL_SUCCESS'],
		'TOTAL_FAILED'		: overallStatus['TOTAL_FAILURE'],
		'ERROR_MESSAGE'		: err_msg
	};
	
	
	var stmt = '';
	var upd_clause = '';

	Object.keys(bindObj).forEach(function(key,index) {
		upd_clause = upd_clause + key + '=:' + key + ',';
	});
		
	upd_clause = upd_clause.substring(0, upd_clause.length - 1);
	stmt = 'update '+sku_app_schema+'.'+'file_upload set ' + upd_clause + ' where FILE_NAME = :FILE_NAME';
	
	console.log('[INFO] overall_status');
	console.log(bindObj);

	//bind_obj = overall_status;
	params = {
		'bind_obj' 		: bindObj,
		'table' 		: 'file_upload',
		'stmt' 			: stmt,
		'commit' 		: true,
		'conn'			: overallStatus['DB_CONN']
	};
		
	db_api.executeUpdate(params, function(err,params) {
		if (err) {
			console.log("[ERROR] Some error occurred during update: "+err);
			console.log(params['bind_obj']);
			cb(err,overallStatus);
			//closeConnection(overallStatus);
			return;
		}
		console.log('[INFO] Rows updated: '+params['update_count']);
		cb(null,overallStatus);
		return;
	});
}


function insertFileUploadTable (status, cb_params, cb, overallStatus) {

	var ctrlParams 				= overallStatus['CTRL_PARAMS'];
	var bindObj = { 
		'FILE_NAME' 		: overallStatus['FILE_NAME'],
		'FILE_TYPE'			: 'EXCEL',
		'STATUS'			: status,
		'TOTAL_UPLOADED'	: '0',
		'TOTAL_FAILED'		: '0',
 		'USER_ID'			: ctrlParams['username'],
		'UPLOAD_DATE'   	: new Date(),
		'ACTION' 			: overallStatus['ACTION']
	};

	var stmt = '';
	//var params = { };

	stmt = 'insert into '+sku_app_schema+'.'+'file_upload (' +  utils.getInsertClause(bindObj) + ') values ';
	stmt = stmt + '(' + utils.getValueClause(bindObj) + ')';
	//bind_obj = file_upload_def;

	var params = { };
	params = {
		'bind_obj' 	: bindObj,
		'table' 	: 'file_upload',
		'stmt' 		: stmt,
		'commit' 	: true,
		'conn'		: overallStatus['DB_CONN']
	};


	db_api.executeInsert(params, function(err,params) {
		if (err) {
			console.log("[ERROR] Some error occurred during insert: "+err);
			console.log(params['bind_obj']);
			cb(err,overallStatus);
			return;
		}
		//console.log('Rows updated: '+params['update_count']);
		cb(null,overallStatus);
		return;
	});
}


function baseName(str)
{
	var leafname= str.split('\\').pop().split('/').pop();
	return leafname;
}



function doUpdateSKU (sku_ind, ind, status, db_objects, overallStatus) {

	var ctrlParams = overallStatus['CTRL_PARAMS'];
	var db_row = db_objects[sku_ind][ind];

	var table = db_row[0];
    var mymodel = require('../models/'+table);
    
    // create an empty object with all the database columns set to null
    // Let's call this empty object our bind object
    var bind_obj = Object.assign({}, mymodel.definition);

    // fill the control fields in our bind object
    bind_obj = db_api.autoFillFields(bind_obj, ctrlParams, 'update');
    
    // Copy any default value into our bind object
    utils.copy_keys(mymodel.defaults,bind_obj);

    // Now copy all fields from the incoming excel object
    // Copy the matching fields only
    // If a field A exists in excel object and not exists in the bind object
    // field A will not be copied
    utils.copy_keys(db_row[1],bind_obj);


    // remove any field from the bind object that's not present in our excel object
    // control fields are exceptions to this rule - they may not be present in excel object
    var obj = { };
    for (var key in bind_obj) {
    	if (key in db_row[1]) {
    		obj[key] = db_row[1][key];
    	} else {
    		if (bind_obj[key] != null) {
    			obj[key] = bind_obj[key];
    		}	
    	}
    }
    bind_obj = obj;

    //var updClause = utils.getUpdateClause(mymodel.definition);
    var updClause = utils.getUpdateClause(bind_obj);
    var whereClause = '';
	var primary_keys = '';
	for(var i=0; i<mymodel.primary_keys.length; i++) {
		if (i == 0) {
			primary_keys = bind_obj[mymodel.primary_keys[i]];		
			whereClause = ' where ' + mymodel.primary_keys[i] + '=:' + mymodel.primary_keys[i];
		} else {
			primary_keys = primary_keys + '__' + bind_obj[mymodel.primary_keys[i]];
			whereClause = whereClause + ' and ' + mymodel.primary_keys[i] + '=:' + mymodel.primary_keys[i];
		}
	}
 
 	var stmt = 'update ' +  mymodel.meta_def.schema + '.' + table + ' set ' + updClause + whereClause;
 	convertStrToDate(mymodel,bind_obj);

    var params = {
		'bind_obj' 	: bind_obj,
		'table' 	: table,
		'stmt' 		: stmt,
		'commit' 	: false,
		'curr_ind' 	: ind,
		'conn'			: overallStatus['DB_CONN'],
		//'keepDBConnAlive'	: true
	};


	db_api.executeUpdate(params,function (err, params) {

		status[sku_ind][ind] = {
			'FILE_NAME' : overallStatus['FILE_NAME'],
			'TABLE_NAME' : table,
			'PRODUCT_CODE' : primary_keys
		};

		if (err) {	
			console.log(err);	
			status[sku_ind][ind]['SUCCESS'] = false;
			status[sku_ind][ind]['ERROR_MSG'] = err.toString();		
			overallStatus['TOTAL_FAILURE']++;	 
		} else {
			status[sku_ind][ind]['SUCCESS'] = true;		
			overallStatus['TOTAL_SUCCESS']++;
		}

		ind++;
		if (ind < db_objects[sku_ind].length) {			
			// Insert next element
			doUpdateSKU(sku_ind,ind,status,db_objects,overallStatus);
		} else {

			var isSkuFailure = false;
			for (var i=0; i<db_objects[sku_ind].length; i++) {
				if (! status[sku_ind][i]['SUCCESS']) {
					isSkuFailure = true;
					break;
				}	
			}

			/*if (isSkuFailure == true) {
				overall_status['TOTAL_FAILED']++;
			} else {
				overall_status['TOTAL_UPLOADED']++;
			}*/

			// Is there a next row?
			sku_ind++;
			if (sku_ind < db_objects.length) {
				ind=0;
				status[sku_ind] = [];
				doUpdateSKU(sku_ind,ind,status,db_objects,overallStatus);
			} else {

				/*var params = { };
				if (overallStatus['TOTAL_FAILURE']>0) {
					console.log('[INFO] ::doUpdateSKU:: One or more rows failed during update, rolling back..');
					params['stmt'] = 'rollback';
				} else {
					console.log('[INFO] ::doUpdateSKU:: Successfully processed all rows.. committing');
					params['stmt'] = 'commit';
				}*/

				if (overallStatus['TOTAL_FAILURE']>0) {
					for (var i=0; i<status.length; i++) {
						for (var j=0; j<status[i].length; j++) {
							status[i][j]['PERSISTED'] = 'N';
						}
					}

					// Rollback
					console.log('[INFO]: [doUpdateSKU] One or more rows failed. Rolling back');
					db_api.executeStmt( { 'stmt' : 'rollback',
										  'conn'	: overallStatus['DB_CONN']
										},
										  //'keepDBConnAlive'	: true }, 
										  function (err1,params1) {
										  		if (err1) {
										  			console.log('[ERROR] [doUpdateSKU] Error during rollback');
										  			console.log(err1);
										  			//closeConnection(overallStatus);
										  			endProcess(overallStatus);
										  			return;
										  		}

												console.log('[INFO] [doUpdateSKU] Inserting status logs');
												doInsertStatus(0,0,status,overallStatus);
					});	

				} else {
					for (var i=0; i<status.length; i++) {
						for (var j=0; j<status[i].length; j++) {
							status[i][j]['PERSISTED'] = 'Y';
						}
					}

					console.log('[INFO] [doUpdateSKU] Inserting status logs');
					doInsertStatus(0,0,status,overallStatus);
				}

			}

		}
	});
}

//We require two parameters
// 1. Full path of excel file
// 2. User ID
// 3. action (update/insert)
// params needed - FILE_PATH, ACTION, DB_CONN

var Main = function(params, ctrlFields) {
	// DO NOT set global vars
	var inputFile 		= baseName(params.FILE_PATH);
	params['CTRL_PARAMS'] = ctrlFields;

	db_api.getConnectionFromPool(params, function(err,params){
		if (err) {
			console.log("[ERROR] Cannot get a DB Connection from pool");
			console.log(err);
            return;            
         } 

		insertFileUploadTable('IN_PROGRESS', params, processFile, { 
			'FILE_NAME' : inputFile,
			'FILE_PATH' : 	params.FILE_PATH,
			'CTRL_PARAMS' :  ctrlFields,
			'ACTION'	  :  params['ACTION'],
			'DB_CONN'	  :  params['DB_CONN'],
			'app_root_dir' : params['app_root_dir'],
			'STATUS_OBJECTS' : []
		});

	});	

}

module.exports = {
    'Main' : Main
};
