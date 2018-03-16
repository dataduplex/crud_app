var imports = function (nga, admin) {
    
    var imports = admin.getEntity('imports')
                            .identifier(nga.field('ID'))
                            .label('IMPORTS');
    imports.listView()
        .fields([nga.field('FILE_NAME'),
                nga.field('ACTION'),
                nga.field('PRODUCT_CODE'),
                nga.field('TABLE_NAME'),
                nga.field('PERSISTED'),
                nga.field('ERROR_MSG'),
                nga.field('LAST_UPDATED'),]) 
        .filters([ nga.field('FILE_NAME')
                    .label('FILE_NAME'),
                    nga.field('TABLE_NAME')
                    .label('TABLE_NAME')
                ]);      


    imports.showView()
                .fields([nga.field('FILE_NAME'),
                nga.field('ACTION'),
                nga.field('PRODUCT_CODE'),
                nga.field('TABLE_NAME'),
                nga.field('PERSISTED'),
                nga.field('ERROR_MSG'),
                nga.field('LAST_UPDATED'),]);  


    //admin.addEntity(imports);
    return imports;

};
exports.imports = imports;
