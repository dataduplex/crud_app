/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/pc_api/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(23);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var myApp = angular.module('myApp', ['ng-admin']);
	//var ui = require('./ui_entities');

	myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
	    return {
	        request: function (config) {
	            config.headers = config.headers || {};
	            if ($window.localStorage.token) {
	                config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
	            }
	            return config;
	        },
	        responseError: function (rejection) {
	            if (rejection.status === 401) {
	                // handle the case where the user is not authenticated
	            }
	            return $q.reject(rejection);
	        }
	    };
	});

	myApp.directive('approveSku', __webpack_require__(2).approveSku);
	myApp.directive('batchApprove', __webpack_require__(3).batchApprove);
	myApp.directive('batchUpdateRelease', __webpack_require__(4).batchUpdateRelease);

	myApp.config(function ($httpProvider) {
	    $httpProvider.interceptors.push('authInterceptor');
	});

	myApp.controller('username', ['$scope', '$window', function ($scope, $window) {
	    // used in header.html
	    console.log('Loc Storage:');
	    console.log($window.localStorage);
	    //console.log(window.localStorage.first_name);
	    $scope.username = $window.localStorage.username;
	}]);

	myApp.controller('logOutController', ['$scope', '$window', function ($scope, $window) {
	    $scope.logout = function () {
	        delete $window.localStorage.token;
	        delete $window.localStorage.username;
	        $window.location = 'http://localhost:8080/index.html';
	    };

	    $scope.passwordReset = function () {
	        delete $window.localStorage.token;
	        delete $window.localStorage.username;
	        $window.location = 'http://localhost:8080/password_reset.html';
	    };
	}]);

	/*
	<a class="navLinkHcp" href="{{hcpurl}}" title="Habitat Conservation Plan" target="_blank" ng-click="linkModelFunc(hcpurl)">Habitat Conservation Plan</a>
	*/

	myApp.controller('redirectController', ['$scope', '$window', function ($scope, $window) {
	    $scope.redirectFunc = function (url) {
	        console.log('redirectFunc');
	        $window.open(url);
	    };
	}]);

	myApp.config(['NgAdminConfigurationProvider', function (nga) {

	    var loggedInUser = window.localStorage.username;
	    // create an admin application
	    var admin = nga.application('Modesto Catalog Manager').baseApiUrl('http://localhost:8080/pc_api/'); // main API endpoint

	    admin.addEntity(nga.entity('product_definition'));
	    admin.addEntity(nga.entity('product_detail'));
	    admin.addEntity(nga.entity('product_definition_ext'));
	    admin.addEntity(nga.entity('image_urls'));
	    admin.addEntity(nga.entity('file_upload'));
	    admin.addEntity(nga.entity('imports'));
	    admin.addEntity(nga.entity('file_exports'));
	    admin.addEntity(nga.entity('sku_export_status'));
	    admin.addEntity(nga.entity('approvals'));
	    admin.addEntity(nga.entity('release_versions'));
	    admin.addEntity(nga.entity('cpbly_acc_comp'));
	    admin.addEntity(nga.entity('model_acc_comp'));
	    admin.addEntity(nga.entity('product_cpbly'));
	    admin.addEntity(nga.entity('model_spec'));
	    admin.addEntity(nga.entity('model_feature'));
	    admin.addEntity(nga.entity('imei_prefix'));
	    admin.addEntity(nga.entity('device_sim_comp'));
	    //admin.addEntity(nga.entity('compatibility'));
	    admin.addEntity(nga.entity('environment_map'));

	    //admin.addEntity(nga.entity('feature_type_ref')); 
	    admin.addEntity(nga.entity('manufacturer_ref'));
	    //admin.addEntity(nga.entity('acc_type_ref'));
	    admin.addEntity(nga.entity('cpbly_type_ref'));
	    admin.addEntity(nga.entity('channel_ref'));
	    admin.addEntity(nga.entity('config_code_ref'));
	    admin.addEntity(nga.entity('dept_ref'));
	    admin.addEntity(nga.entity('equip_id_ref'));
	    admin.addEntity(nga.entity('equip_sub_type_ref'));
	    admin.addEntity(nga.entity('equip_type_ref'));
	    admin.addEntity(nga.entity('equip_sub_cat_ref'));
	    //admin.addEntity(nga.entity('launch_phase_ref'));
	    admin.addEntity(nga.entity('package_type_ref'));
	    admin.addEntity(nga.entity('serial_type_ref'));
	    admin.addEntity(nga.entity('sim_form_ref'));
	    admin.addEntity(nga.entity('sim_type_ref'));
	    //admin.addEntity(nga.entity('system_ref'));
	    admin.addEntity(nga.entity('sku_type_ref'));
	    admin.addEntity(nga.entity('sub_dept_ref'));
	    admin.addEntity(nga.entity('url_type_ref'));
	    admin.addEntity(nga.entity('vendor_ref'));
	    admin.addEntity(nga.entity('model_number'));
	    admin.addEntity(nga.entity('color_ref'));
	    admin.addEntity(nga.entity('product_owner_ref'));
	    admin.addEntity(nga.entity('cifa_item_category_ref'));
	    admin.addEntity(nga.entity('policy_rules'));
	    admin.addEntity(nga.entity('config_code_map_ref'));

	    var product_definition = __webpack_require__(5).product_definition;
	    product_definition(nga, admin);

	    var product_detail = __webpack_require__(6).product_detail;
	    product_detail(nga, admin);

	    var product_definition_ext = __webpack_require__(7).product_definition_ext;
	    product_definition_ext(nga, admin);

	    var image_urls = __webpack_require__(8).image_urls;
	    image_urls(nga, admin);

	    //var image_urls = require('./image_urls/config').image_urls;
	    //image_urls(nga, admin);

	    var ref_tables = __webpack_require__(9).ref_tables;
	    ref_tables(nga, admin);

	    var file_upload = __webpack_require__(10).file_upload;
	    file_upload(nga, admin);

	    var imports = __webpack_require__(11).imports;
	    imports(nga, admin);

	    var cpbly_acc_comp = __webpack_require__(12).cpbly_acc_comp;
	    cpbly_acc_comp(nga, admin);

	    var model_acc_comp = __webpack_require__(13).model_acc_comp;
	    model_acc_comp(nga, admin);

	    var model_spec = __webpack_require__(14).model_spec;
	    model_spec(nga, admin);

	    var product_cpbly = __webpack_require__(15).product_cpbly;
	    product_cpbly(nga, admin);

	    var model_feature = __webpack_require__(16).model_feature;
	    model_feature(nga, admin);

	    var imei_prefix = __webpack_require__(17).imei_prefix;
	    imei_prefix(nga, admin);

	    var device_sim_comp = __webpack_require__(18).device_sim_comp;
	    device_sim_comp(nga, admin);

	    //var compatibility = require('./compatibility/config').compatibility;
	    //compatibility(nga, admin);    

	    var admin_tables = __webpack_require__(19).admin_tables;
	    admin_tables(nga, admin);

	    var approvals = __webpack_require__(20).approvals;
	    approvals(nga, admin);

	    admin.header(__webpack_require__(21));

	    var menu_admin = __webpack_require__(22);
	    admin.menu(menu_admin.landing_menu(nga, admin));

	    //admin.menu(require('./menu')(nga, admin));
	    // attach the admin application to the DOM and execute it
	    nga.configure(admin);
	}]);

/***/ },
/* 2 */
/***/ function(module, exports) {

	//var product_definition 
	var approveSku = function ($http, $state, notification) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            sku: "&",
	            size: "@"
	        },
	        link: function (scope, element, attrs) {
	            scope.sku = scope.sku();
	            scope.type = attrs.type;
	            console.log(scope);
	            //scope.approve = function(status) {
	            console.log('Inside link');
	            scope.approve = function (status) {
	                //console.log('scope:');
	                //console.log(scope);
	                //scope.sku.values.status = status;
	                var req = {
	                    method: 'PUT',
	                    url: 'http://localhost:8080/pc_api/approve_sku',
	                    data: { 'SKU': scope.sku.values.SKU,
	                        'STATUS': status
	                    }
	                };

	                $http(req).then(function (response) {
	                    $state.reload();
	                }).catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e));
	            };
	        },
	        template: ` <a ng-if="sku.values.STATUS == 'Pending'" class="btn btn-outline btn-success" ng-class="size ? \'btn-\' + size : \'\'" ng-click="approve('Accepted')">
	    <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Accept
	</a>
	<a ng-if="sku.values.STATUS == 'Pending'" class="btn btn-outline btn-danger" ng-class="size ? \'btn-\' + size : \'\'" ng-click="approve('Rejected')">
	    <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbspReject
	</a> <div ng-if="sku.values.STATUS == 'Pending'"><ma-edit-button entry="sku" entity="product_definition" size="xs"></ma-edit-button></div>`
	    };
	};

	approveSku.$inject = ['$http', '$state', 'notification'];
	exports.approveSku = approveSku;

	//.then(() => notification.log('Review ' + status, { addnCls: 'humane-flatty-success' }) )

	//export default approveSku;

	//$http(req).then(function(){...}, function(){...});
	/*
	$http.put('http://localhost:8080/pc_api/approvals/sku')
	.then(function(response) {
	    //$scope.greeting = response.data.message;
	    //alert('Response from rest api: '+response.data.message);
	})
	*/

/***/ },
/* 3 */
/***/ function(module, exports) {

	var batchApprove = function ($http, notification, $state) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            selection: '=',
	            type: '@'
	        },
	        link: function (scope, element, attrs) {
	            const status = attrs.type == 'accept' ? 'Accepted' : 'Rejected';
	            scope.icon = attrs.type == 'accept' ? 'glyphicon-thumbs-up' : 'glyphicon-thumbs-down';
	            scope.label = attrs.type == 'accept' ? 'Accepted' : 'Rejected';
	            scope.updateStatus = function () {

	                //console.log('scope.selection');
	                //console.log(scope.selection);

	                var skuBatch = [];
	                for (var i = 0; i < scope.selection.length; i++) {
	                    skuBatch.push(scope.selection[i].values.SKU);
	                }

	                var req = {
	                    method: 'PUT',
	                    url: 'http://localhost:8080/pc_api/batch_approve_sku',
	                    data: { 'SKU_LIST': skuBatch,
	                        'STATUS': status }
	                };

	                $http(req).then(function (response) {
	                    $state.reload();
	                }).catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e));

	                /*
	                $q.all(scope.selection.map(e => Restangular.one('reviews', e.values.id).get()))
	                    .then(reviewReponses => reviewReponses.map(r => r.data))
	                    .then(reviews => reviews.map(review => { // your API my support batch updates, this one doesn't, so we iterate
	                        review.status = status;
	                        return review.put(); // review.put() is a promise
	                    })) // this executes all put() promises in parallel and returns
	                    .then(() => $state.reload())
	                    .then(() => notification.log(scope.selection.length + ' reviews ' + status, { addnCls: 'humane-flatty-success' }) )
	                    .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) )
	                */
	            };
	        },
	        template: ` <span ng-click="updateStatus()"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>`
	    };
	};

	batchApprove.$inject = ['$http', 'notification', '$state'];

	//export default batchApprove;
	exports.batchApprove = batchApprove;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var batchUpdateRelease = function ($http, notification, $state) {
	    'use strict';

	    return {
	        restrict: 'E',
	        scope: {
	            selection: '='
	        },
	        link: function (scope, element, attrs) {

	            //var activeRelease = datastore.getFirstEntry('activeRelease');
	            scope.label = 'update_release';
	            console.log('scope batchUpdateRelease');
	            console.log(scope);

	            scope.batchUpdateRel = function () {

	                //var activeRelease = datastore.getFirstEntry('activeRelease');
	                //console.log('activeRelease');
	                //console.log(activeRelease);
	                //console.log(datastore);

	                var skuBatch = [];
	                for (var i = 0; i < scope.selection.length; i++) {
	                    skuBatch.push(scope.selection[i].values.SKU);
	                }

	                var activeRelease = '';
	                $http.get('http://localhost:8080/pc_api/get_active_release').then(response => {
	                    //console.log('response');
	                    //console.log(response);
	                    //datastore.addEntry('activeRelease', response.data.REL_VERSION);
	                    activeRelease = response.data.REL_VERSION;
	                    var req = {
	                        method: 'PUT',
	                        url: 'http://localhost:8080/pc_api/batch_update_rel',
	                        data: { 'SKU_LIST': skuBatch,
	                            'REL_VERSION': activeRelease }
	                    };
	                    $http(req).then(function (response) {
	                        $state.reload();
	                    }).catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e));
	                }).catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e));
	            };
	        },
	        template: ` <span ng-click="batchUpdateRel()"><span aria-hidden="true"></span>&nbsp;{{ label }}</span>`
	    };
	};

	batchUpdateRelease.$inject = ['$http', 'notification', '$state'];

	//export default batchApprove;
	exports.batchUpdateRelease = batchUpdateRelease;

/***/ },
/* 5 */
/***/ function(module, exports) {

	var product_definition = function (nga, admin) {

	    const statuses = ['Pending', 'Accepted', 'Rejected'];
	    const statusChoices = statuses.map(status => ({ label: status, value: status }));

	    var product_definition = admin.getEntity('product_definition').identifier(nga.field('SKU')).label('PRODUCT_DEFINITION');
	    //.isDetailLink(true)
	    product_definition.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('REL_VERSION'), nga.field('USER_ID'), nga.field('STATUS', 'choice').choices(statusChoices).cssClasses(function (entry) {
	        // add custom CSS classes to inputs and columns
	        if (!entry) return;
	        if (entry.values.STATUS == 'Accepted') {
	            return 'text-center bg-success';
	        }
	        if (entry.values.STATUS == 'Rejected') {
	            return 'text-center bg-danger';
	        }
	        return 'text-center bg-warning';
	    })]).filters([nga.field('SKU').label('SKU'), nga.field('SKU_TYPE').label('SKU_TYPE'), nga.field('EQUIP_TYPE').label('EQUIP_TYPE'), nga.field('MANF_CODE').label('MANF_CODE')]).listActions(['<approve-sku size="xs" sku="entry"></approve-sku>', 'show']).batchActions(['<batch-approve type="accept" selection="selection"></batch-approve>', '<batch-approve type="reject" selection="selection"></batch-approve>', '<batch-update-release selection="selection"></batch-update-release>']);

	    product_definition.listView().prepare(['$http', 'datastore', 'view', function ($http, datastore, view) {
	        //const fromCurrency = view.getField('price').currency();
	        return $http.get('http://localhost:8080/pc_api/get_active_release').then(response => {
	            //console.log('response');
	            //console.log(response);
	            datastore.addEntry('activeRelease', response.data.REL_VERSION);
	        });
	    }]);

	    /*
	    
	            .listActions([
	                '<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Details"></ma-edit-button>',
	                '<approve-sku size="xs" sku="entry"></approve-sku>',
	            ])
	            .batchActions([
	                '<batch-approve type="accept" selection="selection"></batch-approve>',
	                '<batch-approve type="reject" selection="selection"></batch-approve>',
	                'delete'
	            ]);
	    
	    */

	    product_definition.creationView().fields([nga.field('SKU'), nga.field('SYS_CREATE_DATE', 'datetime'), nga.field('OPERATOR_ID'), nga.field('USER_ID'), nga.field('MANF_CODE'), nga.field('UPC'), nga.field('INTL_UPC'), nga.field('PART_NUMBER'), nga.field('CONFIG_CODE'), nga.field('MODEL_NUMBER'), nga.field('EQUIP_TYPE'), nga.field('EQUIP_SUB_TYPE'), nga.field('EQUIP_SUB_CAT'), nga.field('SERIAL_TYPE'), nga.field('EQUIP_ID'), nga.field('SIM_TYPE'), nga.field('SIM_FORM'), nga.field('PACKAGE_TYPE'), nga.field('PRE_INSERTED_SIM'), nga.field('SKU_TYPE'), nga.field('CIFA_ID'), nga.field('CIFA_ITEM_CATEGORY'), nga.field('PRODUCT_OWNER_ID')]);

	    var def_vals = '"{ OPERATOR_ID: entry.values.ROWNUM,' + 'USER_ID: entry.values.USER_ID,' + 'MANF_CODE: entry.values.MANF_CODE,' + 'UPC: entry.values.UPC,' + 'INTL_UPC: entry.values.INTL_UPC,' + 'PART_NUMBER: entry.values.PART_NUMBER,' + 'CONFIG_CODE: entry.values.CONFIG_CODE,' + 'MODEL_NUMBER: entry.values.MODEL_NUMBER,' + 'EQUIP_TYPE: entry.values.EQUIP_TYPE,' + 'EQUIP_SUB_TYPE: entry.values.EQUIP_SUB_TYPE,' + 'EQUIP_SUB_CAT: entry.values.EQUIP_SUB_CAT,' + 'SERIAL_TYPE: entry.values.SERIAL_TYPE,' + 'EQUIP_ID: entry.values.EQUIP_ID,' + 'SIM_TYPE: entry.values.SIM_TYPE,' + 'SIM_FORM: entry.values.SIM_FORM,' + 'PACKAGE_TYPE: entry.values.PACKAGE_TYPE,' + 'PRE_INSERTED_SIM: entry.values.PRE_INSERTED_SIM,' + 'SKU_TYPE: entry.values.SKU_TYPE,' + 'CIFA_ID: entry.values.CIFA_ID,' + 'CIFA_ITEM_CATEGORY: entry.values.CIFA_ITEM_CATEGORY,' + 'PRODUCT_OWNER_ID: entry.values.PRODUCT_OWNER_ID' + '}"';

	    var release_versions = nga.entity('release_versions').identifier(nga.field('REL_VERSION')).label('RELEASE_VERSIONS');
	    /*var comment = nga.entity('comments');
	    comment.listView().fields([
	       	nga.field('post_id', 'reference')
	           	.targetEntity(post) // Select a target Entity
	           	.targetField(nga.field('title')) // Select the field to be displayed
	    	]);*/

	    product_definition.editionView().fields([product_definition.creationView().fields(), nga.field('STATUS', 'choice').choices(statusChoices), nga.field('REL_VERSION', 'reference').targetEntity(release_versions).targetField(nga.field('REL_VERSION')), nga.field('').label('').template('<ma-create-button entity-name="product_definition" size="sm" label="Duplicate" default-values=' + def_vals + '></ma-create-button></span>')]);

	    product_definition.showView().fields(product_definition.creationView().fields());

	    return product_definition;
	};

	exports.product_definition = product_definition;

/***/ },
/* 6 */
/***/ function(module, exports) {

	var product_detail = function (nga, admin) {

	    var product_details = admin.getEntity('product_detail').identifier(nga.field('SKU')).label('PRODUCT_DETAIL');

	    product_details.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('PRODUCT_NAME'), nga.field('PRODUCT_DESC')]).filters([nga.field('SKU').label('SKU')]).listActions(['show']);

	    product_details.creationView().fields([nga.field('SKU'), nga.field('OPERATOR_ID'), nga.field('USER_ID'), nga.field('PRODUCT_NAME'), nga.field('PRODUCT_NAME_ES_US'), nga.field('PRODUCT_DESC'), nga.field('VENDOR_PROD_NAME'), nga.field('DEFAULT_VARIANT'), nga.field('FINANCE_SKU'), nga.field('FINANCE_PRICE'), nga.field('FINANCE_TERM'), nga.field('DEFAULT_VENDOR_COST'), nga.field('DEFAULT_SRP'), nga.field('WEIGHT_UNIT_OF_MEAS'), nga.field('SIZE_UNIT_OF_MEAS'), nga.field('MEM_CAP_UNIT_OF_MEAS'), nga.field('PRODUCT_WEIGHT'), nga.field('PRODUCT_HEIGHT'), nga.field('PRODUCT_WIDTH'), nga.field('PRODUCT_LENGTH'), nga.field('DEFAULT_VARIANT'), nga.field('COLOR'), nga.field('COLOR_HEX'), nga.field('MEMORY_CAPACITY'), nga.field('LAUNCH_DATE'), nga.field('END_OF_LIFE_DATE'), nga.field('COUNTRY_OF_ORIGIN'), nga.field('MIN_FEATURE_VALUE'), nga.field('MAX_FEATURE_VALUE'), nga.field('DEPT_ID'), nga.field('SUB_DEPT_ID'), nga.field('LAUNCH_PHASE'), nga.field('MIN_ORDER_QTY'), nga.field('REQUIRED_RETURN'), nga.field('CONSIGNED'), nga.field('OS_TYPE'), nga.field('HERO_HEADING'), nga.field('HERO_SUB_HEADING'), nga.field('STORE_ID'), nga.field('TAXABLE'), nga.field('MAKE_VISIBLE'), nga.field('ONLINE_VISIBLE'), nga.field('PRODUCT_UNITS'), nga.field('AGENT_AVAILABILITY'), nga.field('AVAILABLE_TO_ORDER'), nga.field('AVAILABLE_TO_SHIP'), nga.field('AUTO_CALC_COST'), nga.field('DIGITAL_ASSET'), nga.field('AVAILABILITY_RULE'), nga.field('SKU_ENABLE_DATE_EP'), nga.field('SKU_DISABLE_DATE_EP'), nga.field('PRODUCT_NAME_CATALYST'), nga.field('FINANCE_SKU_NAME'), nga.field('NO_STOCK_ORDER_ENABLE_FLAG'), nga.field('NO_STOCK_ORDER_LIMIT'), nga.field('NO_STOCK_ORDER_QTY'), nga.field('NO_STOCK_ORDER_AVAILABILITY_TX'), nga.field('AVAILABLE_TO_REPORT'), nga.field('PHYSICAL'), nga.field('RETAIL_INVENTORIED'), nga.field('RETAIL_AVAILABLE')]);

	    var def_vals = '"{ PRODUCT_NAME: entry.values.PRODUCT_NAME,' + 'PRODUCT_NAME_ES_US: entry.values.PRODUCT_NAME_ES_US,' + 'PRODUCT_DESC: entry.values.PRODUCT_DESC,' + 'VENDOR_PROD_NAME: entry.values.VENDOR_PROD_NAME,' + 'DEFAULT_VARIANT: entry.values.DEFAULT_VARIANT,' + 'FINANCE_SKU: entry.values.FINANCE_SKU,' + 'FINANCE_PRICE: entry.values.FINANCE_PRICE,' + 'FINANCE_TERM: entry.values.FINANCE_TERM,' + 'DEFAULT_VENDOR_COST: entry.values.DEFAULT_VENDOR_COST,' + 'DEFAULT_SRP: entry.values.DEFAULT_SRP,' + 'WEIGHT_UNIT_OF_MEAS: entry.values.WEIGHT_UNIT_OF_MEAS,' + 'SIZE_UNIT_OF_MEAS: entry.values.SIZE_UNIT_OF_MEAS,' + 'MEM_CAP_UNIT_OF_MEAS: entry.values.MEM_CAP_UNIT_OF_MEAS,' + 'PRODUCT_WEIGHT: entry.values.PRODUCT_WEIGHT,' + 'PRODUCT_HEIGHT: entry.values.PRODUCT_HEIGHT,' + 'PRODUCT_WIDTH: entry.values.PRODUCT_WIDTH,' + 'PRODUCT_LENGTH: entry.values.PRODUCT_LENGTH,' + 'DEFAULT_VARIANT: entry.values.DEFAULT_VARIANT' + 'COLOR: entry.values.COLOR,' + 'COLOR_HEX: entry.values.COLOR_HEX,' + 'MEMORY_CAPACITY: entry.values.MEMORY_CAPACITY,' + 'LAUNCH_DATE: entry.values.LAUNCH_DATE,' + 'END_OF_LIFE_DATE: entry.values.END_OF_LIFE_DATE,' + 'COUNTRY_OF_ORIGIN: entry.values.COUNTRY_OF_ORIGIN,' + 'MIN_FEATURE_VALUE: entry.values.MIN_FEATURE_VALUE,' + 'MAX_FEATURE_VALUE: entry.values.MAX_FEATURE_VALUE,' + 'DEPT_ID: entry.values.DEPT_ID,' + 'SUB_DEPT_ID: entry.values.SUB_DEPT_ID,' + 'LAUNCH_PHASE: entry.values.LAUNCH_PHASE,' + 'MIN_ORDER_QTY: entry.values.MIN_ORDER_QTY,' + 'REQUIRED_RETURN: entry.values.REQUIRED_RETURN,' + 'CONSIGNED: entry.values.CONSIGNED,' + 'OS_TYPE: entry.values.OS_TYPE,' + 'HERO_HEADING: entry.values.HERO_HEADING,' + 'HERO_SUB_HEADING: entry.values.HERO_SUB_HEADING,' + 'STORE_ID: entry.values.STORE_ID' + 'TAXABLE: entry.values.TAXABLE,' + 'MAKE_VISIBLE: entry.values.MAKE_VISIBLE,' + 'ONLINE_VISIBLE: entry.values.ONLINE_VISIBLE,' + 'PRODUCT_UNITS: entry.values.PRODUCT_UNITS,' + 'AGENT_AVAILABILITY: entry.values.AGENT_AVAILABILITY,' + 'AVAILABLE_TO_ORDER: entry.values.AVAILABLE_TO_ORDER,' + 'AVAILABLE_TO_SHIP: entry.values.AVAILABLE_TO_SHIP,' + 'AUTO_CALC_COST: entry.values.AUTO_CALC_COST,' + 'DIGITAL_ASSET: entry.values.DIGITAL_ASSET,' + 'AVAILABILITY_RULE: entry.values.AVAILABILITY_RULE' + 'SKU_ENABLE_DATE_EP: entry.values.SKU_ENABLE_DATE_EP' + 'SKU_DISABLE_DATE_EP: entry.values.SKU_DISABLE_DATE_EP' + 'PRODUCT_NAME_CATALYST: entry.values.PRODUCT_NAME_CATALYST' + 'FINANCE_SKU_NAME: entry.values.FINANCE_SKU_NAME' + 'NO_STOCK_ORDER_ENABLE_FLAG: entry.values.NO_STOCK_ORDER_ENABLE_FLAG' + 'NO_STOCK_ORDER_LIMIT: entry.values.NO_STOCK_ORDER_LIMIT' + 'NO_STOCK_ORDER_QTY: entry.values.NO_STOCK_ORDER_QTY' + 'NO_STOCK_ORDER_AVAILABILITY_TX: entry.values.NO_STOCK_ORDER_AVAILABILITY_TX' + 'AVAILABLE_TO_REPORT: entry.values.AVAILABLE_TO_REPORT' + 'PHYSICAL: entry.values.PHYSICAL' + 'RETAIL_INVENTORIED: entry.values.RETAIL_INVENTORIED' + 'RETAIL_AVAILABLE: entry.values.RETAIL_AVAILABLE' + '}"';

	    //.editable(false)
	    product_details.editionView().fields([nga.field('SKU'), nga.field('OPERATOR_ID'), nga.field('USER_ID'), nga.field('PRODUCT_NAME'), nga.field('PRODUCT_NAME_ES_US'), nga.field('PRODUCT_DESC'), nga.field('VENDOR_PROD_NAME'), nga.field('DEFAULT_VARIANT'), nga.field('FINANCE_SKU'), nga.field('FINANCE_PRICE'), nga.field('FINANCE_TERM'), nga.field('DEFAULT_VENDOR_COST'), nga.field('DEFAULT_SRP'), nga.field('WEIGHT_UNIT_OF_MEAS'), nga.field('SIZE_UNIT_OF_MEAS'), nga.field('MEM_CAP_UNIT_OF_MEAS'), nga.field('PRODUCT_WEIGHT'), nga.field('PRODUCT_HEIGHT'), nga.field('PRODUCT_WIDTH'), nga.field('PRODUCT_LENGTH'), nga.field('DEFAULT_VARIANT'), nga.field('COLOR'), nga.field('COLOR_HEX'), nga.field('MEMORY_CAPACITY'), nga.field('LAUNCH_DATE'), nga.field('END_OF_LIFE_DATE'), nga.field('COUNTRY_OF_ORIGIN'), nga.field('MIN_FEATURE_VALUE'), nga.field('MAX_FEATURE_VALUE'), nga.field('DEPT_ID'), nga.field('SUB_DEPT_ID'), nga.field('LAUNCH_PHASE'), nga.field('MIN_ORDER_QTY'), nga.field('REQUIRED_RETURN'), nga.field('CONSIGNED'), nga.field('OS_TYPE'), nga.field('HERO_HEADING'), nga.field('HERO_SUB_HEADING'), nga.field('STORE_ID'), nga.field('TAXABLE'), nga.field('MAKE_VISIBLE'), nga.field('ONLINE_VISIBLE'), nga.field('PRODUCT_UNITS'), nga.field('AGENT_AVAILABILITY'), nga.field('AVAILABLE_TO_ORDER'), nga.field('AVAILABLE_TO_SHIP'), nga.field('AUTO_CALC_COST'), nga.field('DIGITAL_ASSET'), nga.field('AVAILABILITY_RULE'), nga.field('SKU_ENABLE_DATE_EP'), nga.field('SKU_DISABLE_DATE_EP'), nga.field('PRODUCT_NAME_CATALYST'), nga.field('FINANCE_SKU_NAME'), nga.field('NO_STOCK_ORDER_ENABLE_FLAG'), nga.field('NO_STOCK_ORDER_LIMIT'), nga.field('NO_STOCK_ORDER_QTY'), nga.field('NO_STOCK_ORDER_AVAILABILITY_TX'), nga.field('AVAILABLE_TO_REPORT'), nga.field('PHYSICAL'), nga.field('RETAIL_INVENTORIED'), nga.field('RETAIL_AVAILABLE'), nga.field('').label('').template('<ma-create-button entity-name="product_detail" size="sm" label="Clone" default-values=' + def_vals + '></ma-create-button></span>')]);
	    //.template('<a href="{{ entry.values.PRODUCT_DESC }}">{{ entry.values.PRODUCT_DESC }}</a>'),
	    product_details.showView().fields(product_details.creationView().fields());

	    return product_details;
	};
	exports.product_detail = product_detail;

/***/ },
/* 7 */
/***/ function(module, exports) {

	var product_definition_ext = function (nga, admin) {

	    var product_definition_ext = admin.getEntity('product_definition_ext').identifier(nga.field('SKU')).label('PRODUCT_DEFINITION_EXT');

	    product_definition_ext.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('REL_VERSION'), nga.field('INVENTORY_SYNC')]).filters([nga.field('SKU').label('SKU')]).listActions(['show']);

	    /*product_definition_ext.creationView().fields([
	            nga.field('SKU'),
	            nga.field('REL_VERSION'),
	            nga.field('INVENTORY_SYNC')
	                nga.field('country', 'choice')
	      .choices([
	        { value: 'FR', label: 'France' },
	        { value: 'US', label: 'USA' },
	      ]);
	    ]);*/

	    //.editable(false)
	    product_definition_ext.editionView().fields([nga.field('SKU'), nga.field('REL_VERSION'), nga.field('INVENTORY_SYNC', 'choice').choices([{ value: 'TRUE', label: 'TRUE' }, { value: 'FALSE', label: 'FALSE' }])]).actions(['show', 'list']);

	    //.template('<a href="{{ entry.values.PRODUCT_DESC }}">{{ entry.values.PRODUCT_DESC }}</a>'),
	    product_definition_ext.showView().fields(product_definition_ext.editionView().fields());

	    return product_definition_ext;
	};
	exports.product_definition_ext = product_definition_ext;

/***/ },
/* 8 */
/***/ function(module, exports) {

	var image_urls = function (nga, admin) {

		var image_urls = admin.getEntity('image_urls').identifier(nga.field('ID')).label('IMAGE_URLS');

		image_urls.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('URL_TYPE')]).filters([nga.field('SKU').label('SKU')]).listActions(['show', 'edit']);

		image_urls.creationView().fields([nga.field('SKU'), nga.field('URL_TYPE'), nga.field('IMAGE_URL'), nga.field('IMAGE_ALT_TEXT')]);

		image_urls.editionView().fields([nga.field('SKU'), nga.field('URL_TYPE'), nga.field('IMAGE_URL'), nga.field('IMAGE_ALT_TEXT')]);

		image_urls.showView().fields([nga.field('SKU'), nga.field('URL_TYPE'), nga.field('IMAGE_URL').label('').template('<div ng-controller="redirectController"><a href="${{ entry.values.IMAGE_URL }}" target="_blank" ng-click="redirectFunc(entry.values.IMAGE_URL)">${{ entry.values.IMAGE_URL }}</a> </div>'), nga.field('IMAGE_ALT_TEXT')]);

		return image_urls;
	};

	exports.image_urls = image_urls;

/***/ },
/* 9 */
/***/ function(module, exports) {

	var ref_tables = function (nga, admin) {

	    /*var acc_type_ref = admin.getEntity('acc_type_ref')
	                            .identifier(nga.field('ACC_TYPE'))
	                            .label('ACC_TYPE')
	                            .baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    acc_type_ref.listView()
	                    .fields([nga.field('ACC_TYPE').isDetailLink(true),
	                            nga.field('ACC_TYPE_DESC')])
	                    .listActions(['show']);
	    acc_type_ref.creationView().fields([
	        nga.field('ACC_TYPE'),
	        nga.field('ACC_TYPE_DESC')
	    ]);
	    acc_type_ref.editionView().fields([
	        nga.field('ACC_TYPE'),
	        nga.field('ACC_TYPE_DESC')
	        ]); 
	    acc_type_ref.showView()
	                    .fields([
	        nga.field('ACC_TYPE'),
	        nga.field('ACC_TYPE_DESC')
	    ]);*/

	    var cpbly_type_ref = admin.getEntity('cpbly_type_ref').identifier(nga.field('CPBLY_NAME')).label('CPBLY_NAME').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    cpbly_type_ref.listView().fields([nga.field('CPBLY_NAME').isDetailLink(true), nga.field('CPBLY_DESC')]).listActions(['show']);
	    cpbly_type_ref.creationView().fields([nga.field('CPBLY_NAME'), nga.field('CPBLY_DESC')]);
	    cpbly_type_ref.editionView().fields([nga.field('CPBLY_NAME'), nga.field('CPBLY_DESC')]);
	    cpbly_type_ref.showView().fields([nga.field('CPBLY_NAME'), nga.field('CPBLY_DESC')]);

	    var channel_ref = admin.getEntity('channel_ref').identifier(nga.field('CHANNEL')).label('CHANNEL').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    channel_ref.listView().fields([nga.field('CHANNEL').isDetailLink(true), nga.field('CHANNEL_NAME'), nga.field('CHANNEL_DESC')]).listActions(['show']);
	    channel_ref.creationView().fields([nga.field('CHANNEL'), nga.field('CHANNEL_NAME'), nga.field('CHANNEL_DESC')]);
	    channel_ref.editionView().fields([nga.field('CHANNEL'), nga.field('CHANNEL_NAME'), nga.field('CHANNEL_DESC')]);
	    channel_ref.showView().fields([nga.field('CHANNEL'), nga.field('CHANNEL_NAME'), nga.field('CHANNEL_DESC')]);

	    var config_code_ref = admin.getEntity('config_code_ref').identifier(nga.field('CONFIG_CODE')).label('CONFIG_CODE').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    config_code_ref.listView().fields([nga.field('CONFIG_CODE').isDetailLink(true), nga.field('CONFIG_CODE_DESC')]).listActions(['show']);
	    config_code_ref.creationView().fields([nga.field('CONFIG_CODE'), nga.field('CONFIG_CODE_DESC')]);
	    config_code_ref.editionView().fields([nga.field('CONFIG_CODE'), nga.field('CONFIG_CODE_DESC')]);
	    config_code_ref.showView().fields([nga.field('CONFIG_CODE'), nga.field('CONFIG_CODE_DESC')]);

	    var equip_id_ref = admin.getEntity('equip_id_ref').identifier(nga.field('EQUIP_ID')).label('EQUIP_ID_DESC').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    equip_id_ref.listView().fields([nga.field('EQUIP_ID').isDetailLink(true), nga.field('EQUIP_ID_DESC')]).listActions(['show']);
	    equip_id_ref.creationView().fields([nga.field('EQUIP_ID'), nga.field('EQUIP_ID_DESC')]);
	    equip_id_ref.editionView().fields([nga.field('EQUIP_ID'), nga.field('EQUIP_ID_DESC')]);
	    equip_id_ref.showView().fields([nga.field('EQUIP_ID'), nga.field('EQUIP_ID_DESC')]);

	    var dept_ref = admin.getEntity('dept_ref').identifier(nga.field('DEPT_ID')).label('DEPT_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    dept_ref.listView().fields([nga.field('DEPT_ID').isDetailLink(true), nga.field('DEPT_NAME')]).listActions(['show']);
	    dept_ref.creationView().fields([nga.field('DEPT_ID'), nga.field('DEPT_NAME')]);
	    dept_ref.editionView().fields([nga.field('DEPT_ID'), nga.field('DEPT_NAME')]);
	    dept_ref.showView().fields([nga.field('DEPT_ID'), nga.field('DEPT_NAME')]);

	    var equip_type_ref = admin.getEntity('equip_type_ref').identifier(nga.field('EQUIP_TYPE')).label('EQUIP_TYPE_DESC').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    equip_type_ref.listView().fields([nga.field('EQUIP_TYPE').isDetailLink(true), nga.field('EQUIP_TYPE_DESC')]).listActions(['show']);
	    equip_type_ref.creationView().fields([nga.field('EQUIP_TYPE'), nga.field('EQUIP_TYPE_DESC')]);
	    equip_type_ref.editionView().fields([nga.field('EQUIP_TYPE'), nga.field('EQUIP_TYPE_DESC')]);
	    equip_type_ref.showView().fields([nga.field('EQUIP_TYPE'), nga.field('EQUIP_TYPE_DESC')]);

	    var equip_sub_cat_ref = admin.getEntity('equip_sub_cat_ref').identifier(nga.field('EQUIP_SUB_CAT')).label('EQUIP_SUB_CAT').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    equip_sub_cat_ref.listView().fields([nga.field('EQUIP_SUB_CAT').isDetailLink(true), nga.field('EQUIP_SUB_CAT_DESC')]).listActions(['show']);
	    equip_sub_cat_ref.creationView().fields([nga.field('EQUIP_SUB_CAT'), nga.field('EQUIP_SUB_CAT_DESC')]);
	    equip_sub_cat_ref.editionView().fields([nga.field('EQUIP_SUB_CAT'), nga.field('EQUIP_SUB_CAT_DESC')]);
	    equip_sub_cat_ref.showView().fields([nga.field('EQUIP_SUB_CAT'), nga.field('EQUIP_SUB_CAT_DESC')]);

	    var equip_sub_type_ref = admin.getEntity('equip_sub_type_ref').identifier(nga.field('EQUIP_SUB_TYPE')).label('EQUIP_SUB_TYPE').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    equip_sub_type_ref.listView().fields([nga.field('EQUIP_SUB_TYPE').isDetailLink(true), nga.field('EQUIP_SUB_TYPE_DESC')]).listActions(['show']);
	    equip_sub_type_ref.creationView().fields([nga.field('EQUIP_SUB_TYPE'), nga.field('EQUIP_SUB_TYPE_DESC')]);
	    equip_sub_type_ref.editionView().fields([nga.field('EQUIP_SUB_TYPE'), nga.field('EQUIP_SUB_TYPE_DESC')]);
	    equip_sub_type_ref.showView().fields([nga.field('EQUIP_SUB_TYPE'), nga.field('EQUIP_SUB_TYPE_DESC')]);

	    /*var launch_phase_ref = admin.getEntity('launch_phase_ref')
	                            .identifier(nga.field('LAUNCH_PHASE'))
	                            .label('LAUNCH_PHASE_DESC')
	                            .baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    launch_phase_ref.listView()
	                    .fields([nga.field('LAUNCH_PHASE').isDetailLink(true),
	                            nga.field('LAUNCH_PHASE_DESC')
	                            ])
	                    .listActions(['show']);
	    launch_phase_ref.creationView().fields([
	        nga.field('LAUNCH_PHASE'),
	        nga.field('LAUNCH_PHASE_DESC')
	    ]);
	    launch_phase_ref.editionView().fields([
	        nga.field('LAUNCH_PHASE'),
	        nga.field('LAUNCH_PHASE_DESC')
	        ]); 
	    launch_phase_ref.showView()
	                    .fields([
	        nga.field('LAUNCH_PHASE'),
	        nga.field('LAUNCH_PHASE_DESC')
	    ]);
	    */

	    var package_type_ref = admin.getEntity('package_type_ref').identifier(nga.field('PACKAGE_TYPE')).label('PACKAGE_TYPE_DESC').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    package_type_ref.listView().fields([nga.field('PACKAGE_TYPE').isDetailLink(true), nga.field('PACKAGE_TYPE_DESC')]).listActions(['show']);
	    package_type_ref.creationView().fields([nga.field('PACKAGE_TYPE'), nga.field('PACKAGE_TYPE_DESC')]);
	    package_type_ref.editionView().fields([nga.field('PACKAGE_TYPE'), nga.field('PACKAGE_TYPE_DESC')]);
	    package_type_ref.showView().fields([nga.field('PACKAGE_TYPE'), nga.field('PACKAGE_TYPE_DESC')]);

	    var serial_type_ref = admin.getEntity('serial_type_ref').identifier(nga.field('SERIAL_TYPE')).label('SERIAL_TYPE').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    serial_type_ref.listView().fields([nga.field('SERIAL_TYPE').isDetailLink(true), nga.field('SERIAL_TYPE_DESC')]).listActions(['show']);
	    serial_type_ref.creationView().fields([nga.field('SERIAL_TYPE'), nga.field('SERIAL_TYPE_DESC')]);
	    serial_type_ref.editionView().fields([nga.field('SERIAL_TYPE'), nga.field('SERIAL_TYPE_DESC')]);
	    serial_type_ref.showView().fields([nga.field('SERIAL_TYPE'), nga.field('SERIAL_TYPE_DESC')]);

	    var sim_form_ref = admin.getEntity('sim_form_ref').identifier(nga.field('SIM_FORM')).label('SIM_FORM').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    sim_form_ref.listView().fields([nga.field('SIM_FORM').isDetailLink(true), nga.field('SIM_FORM_DESC')]).listActions(['show']);
	    sim_form_ref.creationView().fields([nga.field('SIM_FORM'), nga.field('SIM_FORM_DESC')]);
	    sim_form_ref.editionView().fields([nga.field('SIM_FORM'), nga.field('SIM_FORM_DESC')]);
	    sim_form_ref.showView().fields([nga.field('SIM_FORM'), nga.field('SIM_FORM_DESC')]);

	    var sim_type_ref = admin.getEntity('sim_type_ref').identifier(nga.field('SIM_TYPE')).label('SIM_TYPE').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    sim_type_ref.listView().fields([nga.field('SIM_TYPE').isDetailLink(true), nga.field('SIM_TYPE_DESC')]).listActions(['show']);
	    sim_type_ref.creationView().fields([nga.field('SIM_TYPE'), nga.field('SIM_TYPE_DESC')]);
	    sim_type_ref.editionView().fields([nga.field('SIM_TYPE'), nga.field('SIM_TYPE_DESC')]);
	    sim_type_ref.showView().fields([nga.field('SIM_TYPE'), nga.field('SIM_TYPE_DESC')]);

	    /*var system_ref = admin.getEntity('system_ref')
	                            .identifier(nga.field('SYSTEM'))
	                            .label('SYSTEM')
	                            .baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    system_ref.listView()
	                    .fields([nga.field('SYSTEM').isDetailLink(true),
	                            nga.field('SYSTEM_NAME'),
	                            nga.field('SYSTEM_DESC')
	                            ])
	                    .listActions(['show']);
	    system_ref.creationView().fields([
	        nga.field('SYSTEM'),
	        nga.field('SYSTEM_NAME'),
	        nga.field('SYSTEM_DESC')
	    ]);
	    system_ref.editionView().fields([
	        nga.field('SYSTEM'),
	        nga.field('SYSTEM_NAME'),
	        nga.field('SYSTEM_DESC')
	        ]); 
	    system_ref.showView()
	                    .fields([
	        nga.field('SYSTEM'),
	        nga.field('SYSTEM_NAME'),
	        nga.field('SYSTEM_DESC')
	    ]);
	    */

	    var sku_type_ref = admin.getEntity('sku_type_ref').identifier(nga.field('SKU_TYPE')).label('SKU_TYPE_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    sku_type_ref.listView().fields([nga.field('SKU_TYPE').isDetailLink(true), nga.field('SKU_TYPE_NAME'), nga.field('SKU_TYPE_DESC')]).listActions(['show']);
	    sku_type_ref.creationView().fields([nga.field('SKU_TYPE'), nga.field('SKU_TYPE_NAME'), nga.field('SKU_TYPE_DESC'), nga.field('DEFAULT_NAME_CONV'), nga.field('HAS_VENDOR_PART_NUM'), nga.field('HAS_UPC'), nga.field('UPC_OWNER'), nga.field('ACTIVATABLE')]);
	    sku_type_ref.editionView().fields([nga.field('SKU_TYPE'), nga.field('SKU_TYPE_NAME'), nga.field('SKU_TYPE_DESC'), nga.field('DEFAULT_NAME_CONV'), nga.field('HAS_VENDOR_PART_NUM'), nga.field('HAS_UPC'), nga.field('UPC_OWNER'), nga.field('ACTIVATABLE')]);
	    sku_type_ref.showView().fields([nga.field('SKU_TYPE'), nga.field('SKU_TYPE_NAME'), nga.field('SKU_TYPE_DESC'), nga.field('DEFAULT_NAME_CONV'), nga.field('HAS_VENDOR_PART_NUM'), nga.field('HAS_UPC'), nga.field('UPC_OWNER'), nga.field('ACTIVATABLE')]);

	    var sub_dept_ref = admin.getEntity('sub_dept_ref').identifier(nga.field('SUB_DEPT_ID')).label('sub_dept_ref').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    sub_dept_ref.listView().fields([nga.field('SUB_DEPT_ID').isDetailLink(true), nga.field('SUB_DEPT_NAME')]).listActions(['show']);
	    sub_dept_ref.creationView().fields([nga.field('SUB_DEPT_ID'), nga.field('SUB_DEPT_NAME')]);
	    sub_dept_ref.editionView().fields([nga.field('SUB_DEPT_ID'), nga.field('SUB_DEPT_NAME')]);
	    sub_dept_ref.showView().fields([nga.field('SUB_DEPT_ID'), nga.field('SUB_DEPT_NAME')]);

	    var url_type_ref = admin.getEntity('url_type_ref').identifier(nga.field('URL_TYPE')).label('URL_TYPE_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    url_type_ref.listView().fields([nga.field('URL_TYPE').isDetailLink(true), nga.field('URL_TYPE_DESC')]).listActions(['show']);
	    url_type_ref.creationView().fields([nga.field('URL_TYPE'), nga.field('URL_TYPE_DESC')]);
	    url_type_ref.editionView().fields([nga.field('URL_TYPE'), nga.field('URL_TYPE_DESC')]);
	    url_type_ref.showView().fields([nga.field('URL_TYPE'), nga.field('URL_TYPE_DESC')]);

	    var vendor_ref = admin.getEntity('vendor_ref').identifier(nga.field('VENDOR_CODE')).label('VENDOR_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    vendor_ref.listView().fields([nga.field('VENDOR_CODE').isDetailLink(true), nga.field('VENDOR_NAME')]).listActions(['show']);
	    vendor_ref.creationView().fields([nga.field('VENDOR_CODE'), nga.field('VENDOR_NAME'), nga.field('VENDOR_DESC'), nga.field('CIFA_VENDOR_CODE')]);
	    vendor_ref.editionView().fields([nga.field('VENDOR_CODE'), nga.field('VENDOR_NAME'), nga.field('VENDOR_DESC'), nga.field('CIFA_VENDOR_CODE')]);
	    vendor_ref.showView().fields([nga.field('VENDOR_CODE'), nga.field('VENDOR_NAME'), nga.field('VENDOR_DESC'), nga.field('CIFA_VENDOR_CODE')]);

	    var model_number = admin.getEntity('model_number').identifier(nga.field('MODEL_NUMBER')).label('MODEL_NUMBER').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	    model_number.listView().fields([nga.field('MODEL_NUMBER').isDetailLink(true), nga.field('MANF_CODE')]).filters([nga.field('MODEL_NUMBER').label('MODEL_NUMBER'), nga.field('MANF_CODE').label('MANF_CODE')]).listActions(['show']);
	    model_number.creationView().fields([nga.field('MODEL_NUMBER'), nga.field('MANF_CODE'), nga.field('MODEL_NAME'), nga.field('MODEL_DESC'), nga.field('WEIGHT_UNIT_OF_MEAS'), nga.field('SIZE_UNIT_OF_MEAS'), nga.field('PACKAGE_WEIGHT'), nga.field('PACKAGE_HEIGHT'), nga.field('PACKAGE_WIDTH'), nga.field('PACKAGE_LENGTH'), nga.field('MASTER_CARTON_QTY'), nga.field('MASTER_CARTON_WEIGHT'), nga.field('MASTER_CARTON_HEIGHT'), nga.field('MASTER_CARTON_WIDTH'), nga.field('MASTER_CARTON_LENGTH'), nga.field('PALLET_LAYER_QTY'), nga.field('PALLET_LAYER_MASTER_CTN_QTY'), nga.field('PALLET_LAYERS'), nga.field('PALLET_QTY'), nga.field('PALLET_MASTER_CARTON_QTY'), nga.field('PALLET_LAYER_PRODUCT_QTY'), nga.field('BYOD'), nga.field('PROGRAMMING_INSTRUCTIONS'), nga.field('MODEL_ENABLE_DATE_EP'), nga.field('MODEL_DISABLE_DATE_EP'), nga.field('NO_STOCK_RANK')]);
	    model_number.editionView().fields([nga.field('MODEL_NUMBER'), nga.field('MANF_CODE'), nga.field('MODEL_NAME'), nga.field('MODEL_DESC'), nga.field('WEIGHT_UNIT_OF_MEAS'), nga.field('SIZE_UNIT_OF_MEAS'), nga.field('PACKAGE_WEIGHT'), nga.field('PACKAGE_HEIGHT'), nga.field('PACKAGE_WIDTH'), nga.field('PACKAGE_LENGTH'), nga.field('MASTER_CARTON_QTY'), nga.field('MASTER_CARTON_WEIGHT'), nga.field('MASTER_CARTON_HEIGHT'), nga.field('MASTER_CARTON_WIDTH'), nga.field('MASTER_CARTON_LENGTH'), nga.field('PALLET_LAYER_QTY'), nga.field('PALLET_LAYER_MASTER_CTN_QTY'), nga.field('PALLET_LAYERS'), nga.field('PALLET_QTY'), nga.field('PALLET_MASTER_CARTON_QTY'), nga.field('PALLET_LAYER_PRODUCT_QTY'), nga.field('BYOD'), nga.field('PROGRAMMING_INSTRUCTIONS'), nga.field('MODEL_ENABLE_DATE_EP'), nga.field('MODEL_DISABLE_DATE_EP'), nga.field('NO_STOCK_RANK')]);
	    model_number.showView().fields([nga.field('MODEL_NUMBER'), nga.field('MANF_CODE'), nga.field('MODEL_NAME'), nga.field('MODEL_DESC'), nga.field('WEIGHT_UNIT_OF_MEAS'), nga.field('SIZE_UNIT_OF_MEAS'), nga.field('PACKAGE_WEIGHT'), nga.field('PACKAGE_HEIGHT'), nga.field('PACKAGE_WIDTH'), nga.field('PACKAGE_LENGTH'), nga.field('MASTER_CARTON_QTY'), nga.field('MASTER_CARTON_WEIGHT'), nga.field('MASTER_CARTON_HEIGHT'), nga.field('MASTER_CARTON_WIDTH'), nga.field('MASTER_CARTON_LENGTH'), nga.field('PALLET_LAYER_QTY'), nga.field('PALLET_LAYER_MASTER_CTN_QTY'), nga.field('PALLET_LAYERS'), nga.field('PALLET_QTY'), nga.field('PALLET_MASTER_CARTON_QTY'), nga.field('PALLET_LAYER_PRODUCT_QTY'), nga.field('BYOD'), nga.field('PROGRAMMING_INSTRUCTIONS'), nga.field('MODEL_ENABLE_DATE_EP'), nga.field('MODEL_DISABLE_DATE_EP'), nga.field('NO_STOCK_RANK')]);

	    /*var feature_type_ref = admin.getEntity('feature_type_ref')
	                            .identifier(nga.field('FEATURE_NAME'))
	                            .label('FEATURE_TYPE_REF')
	                            .baseApiUrl('http://localhost:8080/pc_api/ref_tables/');
	     
	    feature_type_ref.listView()
	                    .fields([nga.field('FEATURE_NAME').isDetailLink(true),
	                            nga.field('FEATURE_DESC')])
	                    .listActions(['show']);
	      feature_type_ref.creationView().fields([
	    nga.field('FEATURE_NAME'),
	    nga.field('FEATURE_DESC')
	    ]);
	    feature_type_ref.editionView().fields([
	    nga.field('FEATURE_NAME'),
	    nga.field('FEATURE_DESC')
	    	]);	
	    feature_type_ref.showView()
	                    .fields([
	    nga.field('FEATURE_NAME'),
	    nga.field('FEATURE_DESC')
	    ]);*/

	    var manufacturer_ref = admin.getEntity('manufacturer_ref').identifier(nga.field('MANF_CODE')).label('MANUFACTURER_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');

	    manufacturer_ref.listView().fields([nga.field('MANF_CODE').isDetailLink(true), nga.field('MANF_NAME'), nga.field('MANF_DESC')]).listActions(['show']);

	    manufacturer_ref.creationView().fields([nga.field('MANF_CODE'), nga.field('MANF_NAME'), nga.field('MANF_DESC')]);

	    manufacturer_ref.editionView().fields([nga.field('MANF_CODE'), nga.field('MANF_NAME'), nga.field('MANF_DESC')]);

	    manufacturer_ref.showView().fields([nga.field('MANF_CODE'), nga.field('MANF_NAME'), nga.field('MANF_DESC')]);

	    var color_ref = admin.getEntity('color_ref').identifier(nga.field('COLOR')).label('COLOR_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');

	    color_ref.listView().fields([nga.field('COLOR').isDetailLink(true), nga.field('COLOR_DESC'), nga.field('HEX_COLOR')]).listActions(['show']);

	    color_ref.creationView().fields([nga.field('COLOR'), nga.field('COLOR_DESC'), nga.field('TWO_DIGIT_CODE'), nga.field('THREE_DIGIT_CODE'), nga.field('FOUR_DIGIT_CODE'), nga.field('FULL_NAME_CODE'), nga.field('HEX_COLOR')]);

	    color_ref.editionView().fields([nga.field('COLOR'), nga.field('COLOR_DESC'), nga.field('TWO_DIGIT_CODE'), nga.field('THREE_DIGIT_CODE'), nga.field('FOUR_DIGIT_CODE'), nga.field('FULL_NAME_CODE'), nga.field('HEX_COLOR')]);

	    color_ref.showView().fields([nga.field('COLOR'), nga.field('COLOR_DESC'), nga.field('TWO_DIGIT_CODE'), nga.field('THREE_DIGIT_CODE'), nga.field('FOUR_DIGIT_CODE'), nga.field('FULL_NAME_CODE'), nga.field('HEX_COLOR')]);

	    var cifa_item_category_ref = admin.getEntity('cifa_item_category_ref').identifier(nga.field('CIFA_ITEM_CATEGORY')).label('CIFA_ITEM_CATEGORY_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');

	    cifa_item_category_ref.listView().fields([nga.field('CIFA_ITEM_CATEGORY').isDetailLink(true), nga.field('CIFA_ITEM_CATEGORY_NAME')]).listActions(['show']);

	    cifa_item_category_ref.creationView().fields([nga.field('CIFA_ITEM_CATEGORY'), nga.field('CIFA_ITEM_CATEGORY_NAME')]);

	    cifa_item_category_ref.editionView().fields([nga.field('CIFA_ITEM_CATEGORY'), nga.field('CIFA_ITEM_CATEGORY_NAME')]);

	    cifa_item_category_ref.showView().fields([nga.field('CIFA_ITEM_CATEGORY'), nga.field('CIFA_ITEM_CATEGORY_NAME')]);

	    var product_owner_ref = admin.getEntity('product_owner_ref').identifier(nga.field('PRODUCT_OWNER_ID')).label('PRODUCT_OWNER_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');

	    product_owner_ref.listView().fields([nga.field('PRODUCT_OWNER_ID').isDetailLink(true), nga.field('PRODUCT_OWNER_NAME')]).listActions(['show']);

	    product_owner_ref.creationView().fields([nga.field('PRODUCT_OWNER_ID'), nga.field('PRODUCT_OWNER_NAME')]);

	    product_owner_ref.editionView().fields([nga.field('PRODUCT_OWNER_ID'), nga.field('PRODUCT_OWNER_NAME')]);

	    product_owner_ref.showView().fields([nga.field('PRODUCT_OWNER_ID'), nga.field('PRODUCT_OWNER_NAME')]);

	    var policy_rules = admin.getEntity('policy_rules').identifier(nga.field('POLICY_ID')).label('POLICY_RULES').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');

	    policy_rules.listView().fields([nga.field('POLICY_ID').isDetailLink(true), nga.field('ALLOWED')]).listActions(['show']);

	    policy_rules.creationView().fields([nga.field('POLICY_ID'), nga.field('ALLOWED'), nga.field('NOTES')]);

	    policy_rules.editionView().fields([nga.field('POLICY_ID'), nga.field('ALLOWED'), nga.field('NOTES')]);

	    policy_rules.showView().fields([nga.field('POLICY_ID'), nga.field('ALLOWED'), nga.field('NOTES'), nga.field('SYS_CREATE_DATE'), nga.field('SYS_UPDATE_DATE'), nga.field('CREATE_USER'), nga.field('UPDATE_USER')]);

	    /*
	        'CONFIG_CODE': null,
	        'MANF_CODE': null,
	        'MODEL_NUMBER': null,
	        'MODEL_NAME': null,
	        'COLOR_CODE': null,
	        'MEMORY_CAPACITY': null,
	        'NON_COMCAST_SKU': null,
	        'BYOD_SKU': null,
	        'SUPPORTED': null,
	        'CREATE_TS': null,
	        'LAST_UPDATE_TS': null,
	        'CREATE_USER': null,
	        'LAST_UPDATE_USER': null
	        */

	    var config_code_map_ref = admin.getEntity('config_code_map_ref').identifier(nga.field('ID')).label('CONFIG_CODE_MAP_REF').baseApiUrl('http://localhost:8080/pc_api/ref_tables/');

	    config_code_map_ref.listView().fields([nga.field('CONFIG_CODE').isDetailLink(true), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('COLOR_CODE'), nga.field('MEMORY_CAPACITY')]).listActions(['show']);

	    config_code_map_ref.creationView().fields([nga.field('CONFIG_CODE'), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('MODEL_NAME'), nga.field('COLOR_CODE'), nga.field('MEMORY_CAPACITY'), nga.field('NON_COMCAST_SKU'), nga.field('BYOD_SKU'), nga.field('SUPPORTED')]);

	    config_code_map_ref.editionView().fields([nga.field('CONFIG_CODE'), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('MODEL_NAME'), nga.field('COLOR_CODE'), nga.field('MEMORY_CAPACITY'), nga.field('NON_COMCAST_SKU'), nga.field('BYOD_SKU'), nga.field('SUPPORTED')]);

	    config_code_map_ref.showView().fields([nga.field('CONFIG_CODE'), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('MODEL_NAME'), nga.field('COLOR_CODE'), nga.field('MEMORY_CAPACITY'), nga.field('NON_COMCAST_SKU'), nga.field('BYOD_SKU'), nga.field('SUPPORTED'), nga.field('CREATE_TS'), nga.field('LAST_UPDATE_TS'), nga.field('CREATE_USER'), nga.field('LAST_UPDATE_USER')]);

	    //return feature_type_ref;
	};

	exports.ref_tables = ref_tables;

/***/ },
/* 10 */
/***/ function(module, exports) {

	var file_upload = function (nga, admin) {

	    const statuses = ['INSERT', 'UPDATE'];
	    const statusChoices = statuses.map(status => ({ label: status, value: status }));

	    /*const updateTypes = ['FULL', 'PARTIAL'];
	    const updateTypeChoices = updateTypes.map(status => ({ label: status, value: status }));*/

	    var file_upload = admin.getEntity('file_upload').identifier(nga.field('FILE_NAME')).label('FILE_UPLOAD');

	    file_upload.listView().fields([nga.field('FILE_NAME').isDetailLink(true), nga.field('STATUS')]).listActions(['show']).filters([nga.field('FILE_NAME').label('FILE_NAME')]);

	    file_upload.creationView().fields([nga.field('FILE_PATH', 'file').uploadInformation({ 'url': 'http://localhost:8080/pc_api/file_transfer',
	        'apifilename': 'filename',
	        'accept': '.xlsx' }), nga.field('FILE_TYPE'), nga.field('ACTION', 'choice').choices(statusChoices)]);

	    /*
	    nga.field('UPDATE_TYPE','choice')
	            .choices(updateTypeChoices)
	            */
	    file_upload.showView().fields([nga.field('FILE_NAME'), nga.field('FILE_TYPE'), nga.field('USER_ID'), nga.field('UPLOAD_DATE', 'datetime'), nga.field('STATUS'), nga.field('TOTAL_PARSED'), nga.field('TOTAL_UPLOADED'), nga.field('TOTAL_FAILED'), nga.field('ERROR_MESSAGE'), nga.field('ACTION')]);

	    //admin.addEntity(file_upload);
	    return file_upload;
	};
	exports.file_upload = file_upload;

/***/ },
/* 11 */
/***/ function(module, exports) {

	var imports = function (nga, admin) {

	            var imports = admin.getEntity('imports').identifier(nga.field('ID')).label('IMPORTS');
	            imports.listView().fields([nga.field('FILE_NAME'), nga.field('ACTION'), nga.field('PRODUCT_CODE'), nga.field('TABLE_NAME'), nga.field('PERSISTED'), nga.field('ERROR_MSG'), nga.field('LAST_UPDATED')]).filters([nga.field('FILE_NAME').label('FILE_NAME'), nga.field('TABLE_NAME').label('TABLE_NAME')]);

	            imports.showView().fields([nga.field('FILE_NAME'), nga.field('ACTION'), nga.field('PRODUCT_CODE'), nga.field('TABLE_NAME'), nga.field('PERSISTED'), nga.field('ERROR_MSG'), nga.field('LAST_UPDATED')]);

	            //admin.addEntity(imports);
	            return imports;
	};
	exports.imports = imports;

/***/ },
/* 12 */
/***/ function(module, exports) {

	var cpbly_acc_comp = function (nga, admin) {

		var cpbly_acc_comp = admin.getEntity('cpbly_acc_comp').identifier(nga.field('ID')).label('CPBLY_ACC_COMP');

		cpbly_acc_comp.listView().fields([nga.field('DEVICE_CPBLY').isDetailLink(true), nga.field('ACC_SKU')]).listActions(['show']);

		cpbly_acc_comp.creationView().fields([nga.field('DEVICE_CPBLY'), nga.field('ACC_SKU'), nga.field('OPERATOR_ID'), nga.field('USER_ID'), nga.field('ACC_EXPIRATION_DATE')]);

		cpbly_acc_comp.editionView().fields([nga.field('DEVICE_CPBLY'), nga.field('ACC_SKU'), nga.field('OPERATOR_ID'), nga.field('USER_ID'), nga.field('ACC_EXPIRATION_DATE')]);

		cpbly_acc_comp.showView().fields([nga.field('DEVICE_CPBLY'), nga.field('ACC_SKU'), nga.field('OPERATOR_ID'), nga.field('USER_ID'), nga.field('ACC_EXPIRATION_DATE')]);

		return cpbly_acc_comp;
	};

	exports.cpbly_acc_comp = cpbly_acc_comp;

/***/ },
/* 13 */
/***/ function(module, exports) {

	var model_acc_comp = function (nga, admin) {

	    var model_acc_comp = admin.getEntity('model_acc_comp').identifier(nga.field('ID')).label('MODEL_ACC_COMP');

	    model_acc_comp.listView().fields([nga.field('MODEL_NUMBER').isDetailLink(true), nga.field('ACC_SKU')]).filters([nga.field('MODEL_NUMBER').label('MODEL_NUMBER'), nga.field('ACC_SKU').label('ACC_SKU')]).listActions(['show']);

	    model_acc_comp.creationView().fields([nga.field('MODEL_NUMBER'), nga.field('ACC_SKU')]);

	    model_acc_comp.editionView().fields([nga.field('MODEL_NUMBER'), nga.field('ACC_SKU')]);

	    model_acc_comp.showView().fields([nga.field('MODEL_NUMBER'), nga.field('ACC_SKU'), nga.field('OPERATOR_ID'), nga.field('USER_ID')]);

	    return model_acc_comp;
	};

	exports.model_acc_comp = model_acc_comp;

/***/ },
/* 14 */
/***/ function(module, exports) {

	var model_spec = function (nga, admin) {

	  var model_spec = admin.getEntity('model_spec').identifier(nga.field('ID')).label('MODEL_SPEC');

	  model_spec.listView().fields([nga.field('MODEL_NUMBER').isDetailLink(true), nga.field('SPEC_ORDER_ID'), nga.field('SPEC_NAME'), nga.field('SPEC_VALUE')]).filters([nga.field('MODEL_NUMBER').label('MODEL_NUMBER')]).listActions(['show', 'edit']);

	  model_spec.creationView().fields([nga.field('MODEL_NUMBER'), nga.field('SPEC_ORDER_ID'), nga.field('SPEC_NAME'), nga.field('SPEC_VALUE')]);

	  model_spec.editionView().fields([nga.field('MODEL_NUMBER'), nga.field('SPEC_ORDER_ID'), nga.field('SPEC_NAME'), nga.field('SPEC_VALUE')]);

	  model_spec.showView().fields([nga.field('MODEL_NUMBER'), nga.field('SPEC_ORDER_ID'), nga.field('SPEC_NAME'), nga.field('SPEC_VALUE')]);

	  return model_spec;
	};

	exports.model_spec = model_spec;

/***/ },
/* 15 */
/***/ function(module, exports) {

	var product_cpbly = function (nga, admin) {

	  var product_cpbly = admin.getEntity('product_cpbly').identifier(nga.field('ID')).label('PRODUCT_CPBLY');

	  product_cpbly.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('CPBLY_NAME'), nga.field('CPBLY_VALUE')]).filters([nga.field('SKU').label('SKU')]).listActions(['show', 'edit']);

	  product_cpbly.creationView().fields([nga.field('SKU'), nga.field('CPBLY_NAME'), nga.field('CPBLY_VALUE')]);

	  product_cpbly.editionView().fields([nga.field('SKU'), nga.field('CPBLY_NAME'), nga.field('CPBLY_VALUE')]);

	  product_cpbly.showView().fields([nga.field('SKU'), nga.field('CPBLY_NAME'), nga.field('CPBLY_VALUE'), nga.field('USER_ID'), nga.field('SYS_UPDATE_DATE')]);

	  return product_cpbly;
	};

	exports.product_cpbly = product_cpbly;

/***/ },
/* 16 */
/***/ function(module, exports) {

	/*
	    'MODEL_NUMBER': null,
	    'FEATURE_ORDER_ID': null,
	    'SYS_CREATE_DATE': null,
	    'SYS_UPDATE_DATE': null,
	    'OPERATOR_ID': null,
	    'USER_ID': null,
	    'FEATURE_NAME': null,
	    'FEATURE_VALUE': null,
	    'IMAGE_URL': null,
	    'IMAGE_ALT_TEXT': null
	    */

	var model_feature = function (nga, admin) {

	    var model_feature = admin.getEntity('model_feature').identifier(nga.field('ID')).label('MODEL_FEATURE');

	    model_feature.listView().fields([nga.field('MODEL_NUMBER').isDetailLink(true), nga.field('FEATURE_ORDER_ID'), nga.field('FEATURE_NAME'), nga.field('FEATURE_VALUE')]).filters([nga.field('MODEL_NUMBER')]).listActions(['show', 'edit']);

	    model_feature.creationView().fields([nga.field('MODEL_NUMBER'), nga.field('FEATURE_ORDER_ID'), nga.field('FEATURE_NAME'), nga.field('FEATURE_VALUE'), nga.field('IMAGE_URL'), nga.field('IMAGE_ALT_TEXT')]);

	    model_feature.editionView().fields([nga.field('MODEL_NUMBER'), nga.field('FEATURE_ORDER_ID'), nga.field('FEATURE_NAME'), nga.field('FEATURE_VALUE'), nga.field('IMAGE_URL'), nga.field('IMAGE_ALT_TEXT')]);

	    model_feature.showView().fields([nga.field('MODEL_NUMBER'), nga.field('FEATURE_ORDER_ID'), nga.field('FEATURE_NAME'), nga.field('FEATURE_VALUE'), nga.field('IMAGE_URL'), nga.field('IMAGE_ALT_TEXT')]);

	    return model_feature;
	};

	exports.model_feature = model_feature;

/***/ },
/* 17 */
/***/ function(module, exports) {

	/*
		'IMEI_PREFIX': null,
		'MANF_CODE': null,
		'MODEL_NUMBER': null,
		'SYS_CREATE_DATE': null,
		'SYS_UPDATE_DATE': null,
		'OPERATOR_ID': null,
		'USER_ID': null,
		'IMEI_LOW_NUMBER': null,
		'IMEI_HIGH_NUMBER': null
		*/

	var imei_prefix = function (nga, admin) {

		var imei_prefix = admin.getEntity('imei_prefix').identifier(nga.field('ID')).label('IMEI_PREFIX');

		imei_prefix.listView().fields([nga.field('IMEI_PREFIX').isDetailLink(true), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER')]).filters([nga.field('IMEI_PREFIX').label('IMEI_PREFIX')]).listActions(['show', 'edit']);

		imei_prefix.creationView().fields([nga.field('IMEI_PREFIX'), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('IMEI_LOW_NUMBER'), nga.field('IMEI_HIGH_NUMBER')]);

		imei_prefix.editionView().fields([nga.field('IMEI_PREFIX'), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('IMEI_LOW_NUMBER'), nga.field('IMEI_HIGH_NUMBER')]);

		imei_prefix.showView().fields([nga.field('IMEI_PREFIX'), nga.field('MANF_CODE'), nga.field('MODEL_NUMBER'), nga.field('IMEI_LOW_NUMBER'), nga.field('IMEI_HIGH_NUMBER')]);

		return imei_prefix;
	};

	exports.imei_prefix = imei_prefix;

/***/ },
/* 18 */
/***/ function(module, exports) {

	/*
	'IMEI_SKU' : null,
	'SIM_SKU' : null,
	'SYS_CREATE_DATE' : null,
	'OPERATOR_ID' : null,
	'USER_ID' : null
	*/

	var device_sim_comp = function (nga, admin) {

	  var device_sim_comp = admin.getEntity('device_sim_comp').identifier(nga.field('ID')).label('DEVICE_SIM_COMP');

	  device_sim_comp.listView().fields([nga.field('IMEI_SKU').isDetailLink(true), nga.field('SIM_SKU')]).filters([nga.field('IMEI_SKU').label('IMEI_SKU')]).listActions(['show', 'edit']);

	  device_sim_comp.creationView().fields([nga.field('IMEI_SKU'), nga.field('SIM_SKU')]);

	  device_sim_comp.editionView().fields([nga.field('IMEI_SKU'), nga.field('SIM_SKU')]);

	  device_sim_comp.showView().fields([nga.field('IMEI_SKU'), nga.field('SIM_SKU')]);

	  return device_sim_comp;
	};

	exports.device_sim_comp = device_sim_comp;

/***/ },
/* 19 */
/***/ function(module, exports) {

	var admin_tables = function (nga, admin) {

	    const downstreams = ['WSA', 'EP', 'CATALYST', 'MEC'];
	    const downstreamsChoices = downstreams.map(downstream => ({ label: downstream, value: downstream }));

	    const envs = ['ROLEX', 'OMEGA', 'SWATCH', 'BREITLING'];
	    const envChoices = envs.map(env => ({ label: env, value: env }));

	    const statuses = ['SUBMIT', 'CANCEL'];
	    const statusChoices = statuses.map(status => ({ label: status, value: status }));

	    const rel_statuses = ['ACTIVE', 'DONE'];
	    const rel_choices = rel_statuses.map(rel_status => ({ label: rel_status, value: rel_status }));

	    var environment_map = admin.getEntity('environment_map').identifier(nga.field('ID')).label('ENVIRONMENT_MAP');

	    environment_map.creationView().fields([nga.field('MIS_ENV'), nga.field('DOWNSTREAM_ENV'), nga.field('DOWNSTREAM_APP')]);

	    environment_map.editionView().fields([nga.field('MIS_ENV'), nga.field('DOWNSTREAM_ENV'), nga.field('DOWNSTREAM_APP')]);

	    environment_map.listView().fields([nga.field('MIS_ENV').isDetailLink(true), nga.field('DOWNSTREAM_ENV'), nga.field('DOWNSTREAM_APP')]).listActions(['show', 'delete', 'edit']);

	    environment_map.showView().fields([nga.field('MIS_ENV'), nga.field('DOWNSTREAM_ENV'), nga.field('DOWNSTREAM_APP')]);

	    var release_versions = admin.getEntity('release_versions').identifier(nga.field('REL_VERSION')).label('RELEASE_VERSIONS');

	    release_versions.creationView().fields([nga.field('REL_VERSION'), nga.field('STATUS', 'choice').choices(rel_choices)]);

	    release_versions.editionView().fields([nga.field('REL_VERSION'), nga.field('STATUS', 'choice').choices(rel_choices)]);

	    release_versions.listView().fields([nga.field('REL_VERSION').isDetailLink(true), nga.field('STATUS')]).listActions(['show', 'delete', 'edit']);

	    release_versions.showView().fields([nga.field('REL_VERSION'), nga.field('STATUS')]);

	    var file_exports = admin.getEntity('file_exports').identifier(nga.field('ID')).label('FILE_EXPORTS');

	    file_exports.listView().fields([nga.field('FILE_NAME').isDetailLink(true), nga.field('DOWNSTREAM_APP'), nga.field('DOWNSTREAM_ENV'), nga.field('REL_VERSION')]).listActions(['show', 'edit']);

	    /*release_versions.creationView().fields([
	        nga.field('REL_VERSION'),
	        nga.field('STATUS','choice')
	                        .choices(rel_choices)
	    ]);*/

	    file_exports.creationView().fields([nga.field('DOWNSTREAM_APP', 'choice').choices(downstreamsChoices), nga.field('DOWNSTREAM_ENV', 'choice').choices(envChoices), nga.field('REL_VERSION', 'reference').targetEntity(release_versions).targetField(nga.field('REL_VERSION'))]);

	    /*var release_versions = nga.entity('release_versions')
	    				.identifier(nga.field('REL_VERSION'))
	                       .label('RELEASE_VERSIONS');*/

	    file_exports.editionView().fields([nga.field('FILE_NAME').editable(false), nga.field('DOWNSTREAM_APP').editable(false), nga.field('DOWNSTREAM_ENV').editable(false), nga.field('REL_VERSION').editable(false), nga.field('STATUS', 'choice').choices(statusChoices), nga.field('TOTAL_SKUS'), nga.field('TOTAL_SUCCESS'), nga.field('TOTAL_FAILURES')]);

	    file_exports.showView().fields([nga.field('FILE_NAME'), nga.field('DOWNSTREAM_APP'), nga.field('DOWNSTREAM_ENV'), nga.field('REL_VERSION'), nga.field('STATUS'), nga.field('CREATE_USER'), nga.field('CREATE_TIME'), nga.field('TOTAL_SKUS'), nga.field('TOTAL_SUCCESS'), nga.field('TOTAL_FAILURES')]);

	    //return product_definition;


	    var sku_export_status = admin.getEntity('sku_export_status').identifier(nga.field('ID')).label('SKU_EXPORT_STATUS');

	    sku_export_status.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('DOWNSTREAM_APP'), nga.field('DOWNSTREAM_ENV'), nga.field('REL_VERSION'), nga.field('STATUS')]).listActions(['show']).filters([nga.field('SKU').label('SKU'), nga.field('DOWNSTREAM_APP').label('DOWNSTREAM_APP'), nga.field('DOWNSTREAM_ENV').label('DOWNSTREAM_ENV'), nga.field('REL_VERSION').label('REL_VERSION')]);

	    sku_export_status.showView().fields([nga.field('SKU'), nga.field('DOWNSTREAM_APP'), nga.field('DOWNSTREAM_ENV'), nga.field('ACTION'), nga.field('REL_VERSION'), nga.field('STATUS'), nga.field('CREATE_TIME'), nga.field('ERROR_MSG')]);
	};

	exports.admin_tables = admin_tables;

/***/ },
/* 20 */
/***/ function(module, exports) {

	var approvals = function (nga, admin) {
	    /*      'SKU': null,
	            'TEAM': null,
	            'STATUS': null,
	            'UPDATE_USER': null,
	            'UPDATE_TIME': null
	    */

	    const statuses = ['Pending', 'Accepted', 'Rejected'];
	    const statusChoices = statuses.map(status => ({ label: status, value: status }));
	    var approvals = admin.getEntity('approvals').identifier(nga.field('ID')).label('APPROVALS');

	    approvals.listView().fields([nga.field('SKU').isDetailLink(true), nga.field('TEAM'), nga.field('STATUS', 'choice').choices(statusChoices).cssClasses(function (entry) {
	        // add custom CSS classes to inputs and columns
	        if (!entry) return;
	        if (entry.values.STATUS == 'Accepted') {
	            return 'text-center bg-success';
	        }
	        if (entry.values.STATUS == 'Rejected') {
	            return 'text-center bg-danger';
	        }
	        return 'text-center bg-warning';
	    })]).listActions(['show']);

	    //.editable(false)
	    approvals.showView().fields([nga.field('SKU'), nga.field('TEAM'), nga.field('STATUS'), nga.field('UPDATE_USER'), nga.field('UPDATE_TIME')]);

	    return approvals;
	};
	exports.approvals = approvals;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\">\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"#\" ng-click=\"appController.displayHome()\">Modesto Catalog Manager envPlaceHolder</a>\n</div>\n<ul class=\"nav navbar-top-links navbar-right hidden-xs\">\n    <li>\n        <a href=\"https://github.com/dataduplex/Modesto-pc-rest\">\n            <i class=\"fa fa-github fa-lg\"></i>&nbsp;Source\n        </a>\n    </li>\n    <li uib-dropdown>\n        <a uib-dropdown-toggle href=\"#\" aria-expanded=\"true\" ng-controller=\"username\">\n            <i class=\"fa fa-user fa-lg\"></i>&nbsp;{{ username }}&nbsp;<i class=\"fa fa-caret-down\"></i>\n        </a>\n        <ul class=\"dropdown-menu dropdown-user\" role=\"menu\" ng-controller=\"logOutController\">\n            <li><a href ng-click=\"logout()\"><i class=\"fa fa-sign-out fa-fw\"></i> Logout</a></li>\n            <li><a href ng-click=\"passwordReset()\"><i class=\"fa fa-sign-out fa-fw\"></i> Reset Password</a></li>\n        </ul>\n    </li>\n</ul>\n<!--ng-click=\"isCollapsed = !isCollapsed\"-->\n";

/***/ },
/* 22 */
/***/ function(module, exports) {

	// nga.menu(entity) sets defaults title, link and active values correctly
	//            .addChild(nga.menu(admin.getEntity('launch_phase_ref'))
	//                .icon('<span class="fa fa-database fa-fw"></span>'))

	var landing_menu = function (nga, admin) {
	    return nga.menu().addChild(nga.menu().title('Products').icon('<span class="fa fa-mobile fa-fw"></span>').addChild(nga.menu(admin.getEntity('product_definition')) // nga.menu(entity) sets defaults title, link and active values correctly
	    .icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('product_detail')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('product_definition_ext')) // nga.menu(entity) sets defaults title, link and active values correctly
	    .icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('image_urls')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('cpbly_acc_comp')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('model_acc_comp')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('device_sim_comp')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('product_cpbly')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('model_spec')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('model_feature')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('imei_prefix')).icon('<span class="fa fa-database fa-fw"></span>'))).addChild(nga.menu().title('Imports/Exports').icon('<span class="fa fa-truck fa-fw"></span>').addChild(nga.menu(admin.getEntity('file_upload')) // nga.menu(entity) sets defaults title, link and active values correctly
	    .icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('imports')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('file_exports')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('sku_export_status')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('approvals')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('release_versions')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('environment_map')).icon('<span class="fa fa-database fa-fw"></span>'))).addChild(nga.menu().title('Ref Tables').icon('<span class="fa fa-sticky-note fa-fw"></span>').addChild(nga.menu(admin.getEntity('color_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('cpbly_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('channel_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('config_code_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('dept_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('equip_id_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('equip_sub_cat_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('equip_sub_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('equip_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('manufacturer_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('model_number')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('package_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('serial_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('sim_form_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('sim_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('sku_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('sub_dept_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('url_type_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('vendor_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('product_owner_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('cifa_item_category_ref')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('policy_rules')).icon('<span class="fa fa-database fa-fw"></span>')).addChild(nga.menu(admin.getEntity('config_code_map_ref')).icon('<span class="fa fa-database fa-fw"></span>')));
	};

	exports.landing_menu = landing_menu;

	/*
	    admin.addEntity(nga.entity('feature_type_ref')); 
	    admin.addEntity(nga.entity('manufacturer_ref'));
	    admin.addEntity(nga.entity('acc_type_ref'));
	    admin.addEntity(nga.entity('capability_type_ref'));
	    admin.addEntity(nga.entity('channel_ref'));
	    admin.addEntity(nga.entity('config_code_ref'));
	    admin.addEntity(nga.entity('equipment_id_ref'));
	    admin.addEntity(nga.entity('equipment_sub_type_cat_ref'));
	    admin.addEntity(nga.entity('equipment_sub_type_ref'));
	    admin.addEntity(nga.entity('launch_phase_ref'));
	    admin.addEntity(nga.entity('package_type_ref'));
	    admin.addEntity(nga.entity('serial_type_ref'));
	    admin.addEntity(nga.entity('sim_form_ref'));
	    admin.addEntity(nga.entity('sim_type_ref'));
	    admin.addEntity(nga.entity('system_ref'));
	    admin.addEntity(nga.entity('sku_type_ref'));
	    admin.addEntity(nga.entity('url_type_ref'));
	    admin.addEntity(nga.entity('vendor_ref'));
	    admin.addEntity(nga.entity('model_number'));*/

/***/ },
/* 23 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);