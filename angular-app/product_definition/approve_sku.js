//var product_definition 
var approveSku = function ($http, $state, notification) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            sku: "&",
            size: "@",
        },
        link: function(scope, element, attrs) {
            scope.sku = scope.sku();
            scope.type = attrs.type;
            console.log(scope);
            //scope.approve = function(status) {
            console.log('Inside link');    
            scope.approve = function(status){
                //console.log('scope:');
                //console.log(scope);
                //scope.sku.values.status = status;
                var req = {
                    method: 'PUT',
                    url: 'http://localhost:8080/pc_api/approve_sku',
                    data: { 'SKU' : scope.sku.values.SKU,
                            'STATUS' : status 
                        }
                };

                $http(req).then(function(response){ 
                        $state.reload();
                })

                .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) )
            };
        },
        template:
` <a ng-if="sku.values.STATUS == 'Pending'" class="btn btn-outline btn-success" ng-class="size ? \'btn-\' + size : \'\'" ng-click="approve('Accepted')">
    <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Accept
</a>
<a ng-if="sku.values.STATUS == 'Pending'" class="btn btn-outline btn-danger" ng-class="size ? \'btn-\' + size : \'\'" ng-click="approve('Rejected')">
    <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbspReject
</a> <div ng-if="sku.values.STATUS == 'Pending'"><ma-edit-button entry="sku" entity="product_definition" size="xs"></ma-edit-button></div>`
    };
}

approveSku.$inject = ['$http','$state', 'notification'];
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