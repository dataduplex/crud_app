var product_definition = function (nga, admin) {

	const statuses = ['Pending', 'Accepted', 'Rejected'];
	const statusChoices = statuses.map(status => ({ label: status, value: status }));

	var product_definition = admin.getEntity('product_definition')
                            .identifier(nga.field('SKU'))
                            .label('PRODUCT_DEFINITION');
    //.isDetailLink(true)
    product_definition.listView()
                    .fields([nga.field('SKU').isDetailLink(true),
                            nga.field('REL_VERSION'),
                            nga.field('USER_ID'),
                            nga.field('STATUS', 'choice')
                			.choices(statusChoices)
                			.cssClasses(function(entry) { // add custom CSS classes to inputs and columns
                    			if (!entry) return;
                    			if (entry.values.STATUS == 'Accepted') {
                        			return 'text-center bg-success';
                    			}
                    			if (entry.values.STATUS == 'Rejected') {
                        			return 'text-center bg-danger';
                    			}
                    			return 'text-center bg-warning';
                			})
                     ])
                    .filters([
                    	nga.field('SKU')
                			.label('SKU'),
                        nga.field('SKU_TYPE')
                            .label('SKU_TYPE'),
                        nga.field('EQUIP_TYPE')
                            .label('EQUIP_TYPE'),
                        nga.field('MANF_CODE')
                            .label('MANF_CODE')    
                	])		
                    .listActions(['<approve-sku size="xs" sku="entry"></approve-sku>','show'])
                    .batchActions([
                        '<batch-approve type="accept" selection="selection"></batch-approve>',
                        '<batch-approve type="reject" selection="selection"></batch-approve>',
                        '<batch-update-release selection="selection"></batch-update-release>'
                    ]);

    product_definition.listView().prepare(['$http', 'datastore', 'view', function($http, datastore, view) {
            //const fromCurrency = view.getField('price').currency();
            return $http.get('http://localhost:8080/pc_api/get_active_release')
        .then(response => {
            //console.log('response');
            //console.log(response);
            datastore.addEntry('activeRelease', response.data.REL_VERSION);
        });
}])



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


    product_definition.creationView().fields([
		nga.field('SKU'),
		nga.field('SYS_CREATE_DATE','datetime'),
		nga.field('OPERATOR_ID'),
		nga.field('USER_ID'),
		nga.field('MANF_CODE'),
		nga.field('UPC'),
		nga.field('INTL_UPC'),
		nga.field('PART_NUMBER'),
		nga.field('CONFIG_CODE'),
		nga.field('MODEL_NUMBER'),
		nga.field('EQUIP_TYPE'),
		nga.field('EQUIP_SUB_TYPE'),
		nga.field('EQUIP_SUB_CAT'),
		nga.field('SERIAL_TYPE'),
		nga.field('EQUIP_ID'),
		nga.field('SIM_TYPE'),
		nga.field('SIM_FORM'),
		nga.field('PACKAGE_TYPE'),
		nga.field('PRE_INSERTED_SIM'),
        nga.field('SKU_TYPE'),
        nga.field('CIFA_ID'),
        nga.field('CIFA_ITEM_CATEGORY'),
        nga.field('PRODUCT_OWNER_ID')
    ]);

    var def_vals='"{ OPERATOR_ID: entry.values.ROWNUM,'+
    			'USER_ID: entry.values.USER_ID,'+   
    			'MANF_CODE: entry.values.MANF_CODE,'+   
    			'UPC: entry.values.UPC,'+   
    			'INTL_UPC: entry.values.INTL_UPC,'+   
    			'PART_NUMBER: entry.values.PART_NUMBER,'+   
    			'CONFIG_CODE: entry.values.CONFIG_CODE,'+   
    			'MODEL_NUMBER: entry.values.MODEL_NUMBER,'+   
    			'EQUIP_TYPE: entry.values.EQUIP_TYPE,'+   
    			'EQUIP_SUB_TYPE: entry.values.EQUIP_SUB_TYPE,'+   
    			'EQUIP_SUB_CAT: entry.values.EQUIP_SUB_CAT,'+   
    			'SERIAL_TYPE: entry.values.SERIAL_TYPE,'+   
    			'EQUIP_ID: entry.values.EQUIP_ID,'+
    			'SIM_TYPE: entry.values.SIM_TYPE,'+
    			'SIM_FORM: entry.values.SIM_FORM,'+
    			'PACKAGE_TYPE: entry.values.PACKAGE_TYPE,'+
    			'PRE_INSERTED_SIM: entry.values.PRE_INSERTED_SIM,'+
    			'SKU_TYPE: entry.values.SKU_TYPE,'+
                'CIFA_ID: entry.values.CIFA_ID,'+
                'CIFA_ITEM_CATEGORY: entry.values.CIFA_ITEM_CATEGORY,'+
                'PRODUCT_OWNER_ID: entry.values.PRODUCT_OWNER_ID'+
    			'}"';



	var release_versions = nga.entity('release_versions')
					.identifier(nga.field('REL_VERSION'))
                    .label('RELEASE_VERSIONS');
	/*var comment = nga.entity('comments');
	comment.listView().fields([
    	nga.field('post_id', 'reference')
        	.targetEntity(post) // Select a target Entity
        	.targetField(nga.field('title')) // Select the field to be displayed
		]);*/


    product_definition.editionView().fields(
        [product_definition.creationView().fields(),
		nga.field('STATUS', 'choice')
                .choices(statusChoices),
        nga.field('REL_VERSION','reference')
        	.targetEntity(release_versions)
        	.targetField(nga.field('REL_VERSION')),
        nga.field('').label('')
            .template('<ma-create-button entity-name="product_definition" size="sm" label="Duplicate" default-values='+def_vals+'></ma-create-button></span>')
        ]
        );
    
    product_definition.showView()
                    .fields( product_definition.creationView().fields() );

    return product_definition;
};

exports.product_definition = product_definition;