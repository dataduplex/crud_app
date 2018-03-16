var admin_tables = function (nga, admin) {

	const downstreams = ['WSA', 'EP', 'CATALYST', 'MEC'];
	const downstreamsChoices = downstreams.map(downstream => ({ label: downstream, value: downstream }));


    const envs = ['ROLEX', 'OMEGA', 'SWATCH', 'BREITLING'];
    const envChoices = envs.map(env => ({ label: env, value: env }));

	const statuses = ['SUBMIT', 'CANCEL'];
	const statusChoices = statuses.map(status => ({ label: status, value: status }));

    const rel_statuses = ['ACTIVE', 'DONE'];
    const rel_choices = rel_statuses.map(rel_status => ({ label: rel_status, value: rel_status }));


    var environment_map = admin.getEntity('environment_map')
                    .identifier(nga.field('ID'))
                    .label('ENVIRONMENT_MAP');

    environment_map.creationView().fields([
        nga.field('MIS_ENV'),
        nga.field('DOWNSTREAM_ENV'),
        nga.field('DOWNSTREAM_APP')
    ]);


    environment_map.editionView().fields([
        nga.field('MIS_ENV'),
        nga.field('DOWNSTREAM_ENV'),
        nga.field('DOWNSTREAM_APP')
    ]);


    environment_map.listView().fields([
        nga.field('MIS_ENV').isDetailLink(true),
        nga.field('DOWNSTREAM_ENV'),
        nga.field('DOWNSTREAM_APP')
    ])
    .listActions(['show','delete','edit']);


    environment_map.showView().fields([
        nga.field('MIS_ENV'),
        nga.field('DOWNSTREAM_ENV'),
        nga.field('DOWNSTREAM_APP')
    ]);


    var release_versions = admin.getEntity('release_versions')
                    .identifier(nga.field('REL_VERSION'))
                    .label('RELEASE_VERSIONS');

    release_versions.creationView().fields([
        nga.field('REL_VERSION'),
        nga.field('STATUS','choice')
                        .choices(rel_choices)
    ]);


    release_versions.editionView().fields([
        nga.field('REL_VERSION'),
        nga.field('STATUS','choice')
                        .choices(rel_choices)
    ]);


    release_versions.listView().fields([
        nga.field('REL_VERSION').isDetailLink(true),
        nga.field('STATUS')
    ])
    .listActions(['show','delete','edit']);


    release_versions.showView().fields([
        nga.field('REL_VERSION'),
        nga.field('STATUS')
    ]);


	var file_exports = admin.getEntity('file_exports')
                            .identifier(nga.field('ID'))
                            .label('FILE_EXPORTS');
    
    file_exports.listView()
                    .fields([nga.field('FILE_NAME').isDetailLink(true),
                            nga.field('DOWNSTREAM_APP'),
                            nga.field('DOWNSTREAM_ENV'),
                            nga.field('REL_VERSION')
                     ])
                    .listActions(['show','edit']);


    /*release_versions.creationView().fields([
        nga.field('REL_VERSION'),
        nga.field('STATUS','choice')
                        .choices(rel_choices)
    ]);*/


    file_exports.creationView().fields([
		nga.field('DOWNSTREAM_APP','choice')
                				.choices(downstreamsChoices),
        nga.field('DOWNSTREAM_ENV','choice')
                                .choices(envChoices),
		nga.field('REL_VERSION','reference')
        	.targetEntity(release_versions)
        	.targetField(nga.field('REL_VERSION'))
    ]);


	/*var release_versions = nga.entity('release_versions')
					.identifier(nga.field('REL_VERSION'))
                    .label('RELEASE_VERSIONS');*/

    file_exports.editionView().fields(
        [nga.field('FILE_NAME').editable(false),
		nga.field('DOWNSTREAM_APP').editable(false),
        nga.field('DOWNSTREAM_ENV').editable(false),
		nga.field('REL_VERSION').editable(false),
		nga.field('STATUS','choice')
                				.choices(statusChoices),
		nga.field('TOTAL_SKUS'),
		nga.field('TOTAL_SUCCESS'),
		nga.field('TOTAL_FAILURES')]
        );

    
    file_exports.showView()
                    .fields([
		nga.field('FILE_NAME'),
		nga.field('DOWNSTREAM_APP'),
        nga.field('DOWNSTREAM_ENV'),
		nga.field('REL_VERSION'),
		nga.field('STATUS'),
		nga.field('CREATE_USER'),
		nga.field('CREATE_TIME'),
		nga.field('TOTAL_SKUS'),
		nga.field('TOTAL_SUCCESS'),
		nga.field('TOTAL_FAILURES')
    ]);

    //return product_definition;


	var sku_export_status = admin.getEntity('sku_export_status')
                            .identifier(nga.field('ID'))
                            .label('SKU_EXPORT_STATUS');


    sku_export_status.listView()
                    .fields([nga.field('SKU').isDetailLink(true),
                            nga.field('DOWNSTREAM_APP'),
                            nga.field('DOWNSTREAM_ENV'),
                            nga.field('REL_VERSION'),
                            nga.field('STATUS')
                     ])
                    .listActions(['show'])
                    .filters([ nga.field('SKU')
                                  .label('SKU'),
                                nga.field('DOWNSTREAM_APP')
                                  .label('DOWNSTREAM_APP'),
                                nga.field('DOWNSTREAM_ENV')
                                  .label('DOWNSTREAM_ENV'),
                                nga.field('REL_VERSION')
                                  .label('REL_VERSION') ]);      

    sku_export_status.showView()
                    .fields([
		nga.field('SKU'),
		nga.field('DOWNSTREAM_APP'),
        nga.field('DOWNSTREAM_ENV'),
		nga.field('ACTION'),
        nga.field('REL_VERSION'),
		nga.field('STATUS'),
		nga.field('CREATE_TIME'),
		nga.field('ERROR_MSG')
    ]);


};

exports.admin_tables = admin_tables;