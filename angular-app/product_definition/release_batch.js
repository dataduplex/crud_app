var batchUpdateRelease = function($http, notification, $state) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            selection: '=',
            //datastore: '&',

        },
        link: function(scope, element, attrs) {

            //var activeRelease = datastore.getFirstEntry('activeRelease');
            scope.label = 'update_release';
            console.log('scope batchUpdateRelease');
            console.log(scope);

            scope.batchUpdateRel = function() {

                //var activeRelease = datastore.getFirstEntry('activeRelease');
                //console.log('activeRelease');
                //console.log(activeRelease);
                //console.log(datastore);

                var skuBatch = [];
                for (var i=0; i<scope.selection.length; i++) {
                    skuBatch.push(scope.selection[i].values.SKU);
                }

            var  activeRelease = '';   
            $http.get('http://localhost:8080/pc_api/get_active_release')
            .then(response => {
                //console.log('response');
                //console.log(response);
                //datastore.addEntry('activeRelease', response.data.REL_VERSION);
                activeRelease = response.data.REL_VERSION;
                var req = {
                    method: 'PUT',
                    url: 'http://localhost:8080/pc_api/batch_update_rel',
                    data: { 'SKU_LIST' : skuBatch,
                            'REL_VERSION' : activeRelease  }
                };
                $http(req).then(function(response){ 
                        $state.reload();
                })
                .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) );

            })
            .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) );

          }   
        },
        template: ` <span ng-click="batchUpdateRel()"><span aria-hidden="true"></span>&nbsp;{{ label }}</span>`
    };
}

batchUpdateRelease.$inject = ['$http', 'notification', '$state'];

//export default batchApprove;
exports.batchUpdateRelease = batchUpdateRelease;
