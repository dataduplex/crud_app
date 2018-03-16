var image_urls = function (nga, admin) {

    var image_urls = admin.getEntity('image_urls')
                            .identifier(nga.field('ID'))
                            .label('IMAGE_URLS');
    
    image_urls.listView()
                    .fields([nga.field('SKU').isDetailLink(true),
                            nga.field('URL_TYPE')])
                    .filters([ nga.field('SKU')
                    				.label('SKU')
                			])    
                    .listActions(['show','edit']);


    image_urls.creationView().fields([
		nga.field('SKU'),
		nga.field('URL_TYPE'),
		nga.field('IMAGE_URL'),
		nga.field('IMAGE_ALT_TEXT')
    ]);


	image_urls.editionView().fields([
		nga.field('SKU'),
		nga.field('URL_TYPE'),
		nga.field('IMAGE_URL'),
		nga.field('IMAGE_ALT_TEXT')
    	]);	


	image_urls.showView()
                    .fields([
		nga.field('SKU'),
		nga.field('URL_TYPE'),
		nga.field('IMAGE_URL')
			.label('')
			.template('<div ng-controller="redirectController"><a href="${{ entry.values.IMAGE_URL }}" target="_blank" ng-click="redirectFunc(entry.values.IMAGE_URL)">${{ entry.values.IMAGE_URL }}</a> </div>'),
		nga.field('IMAGE_ALT_TEXT')
	]);

	return image_urls;
};

exports.image_urls = image_urls;