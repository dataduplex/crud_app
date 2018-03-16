var file_upload = function (nga, admin) {
    
        const statuses = ['INSERT', 'UPDATE'];
        const statusChoices = statuses.map(status => ({ label: status, value: status }));

        /*const updateTypes = ['FULL', 'PARTIAL'];
        const updateTypeChoices = updateTypes.map(status => ({ label: status, value: status }));*/


    var file_upload = admin.getEntity('file_upload')
                            .identifier(nga.field('FILE_NAME'))
                            .label('FILE_UPLOAD');

    file_upload.listView()
        .fields([nga.field('FILE_NAME').isDetailLink(true),
                nga.field('STATUS'),])
                    .listActions(['show'])
                    .filters([
                        nga.field('FILE_NAME')
                            .label('FILE_NAME')]);                            

    file_upload.creationView().fields([
        nga.field('FILE_PATH', 'file').uploadInformation({ 'url' : 'http://localhost:8080/pc_api/file_transfer', 
                                                    'apifilename' : 'filename', 
                                                    'accept' : '.xlsx'}),
        nga.field('FILE_TYPE'),
        nga.field('ACTION','choice')
            .choices(statusChoices)
    ]);

    /*
    nga.field('UPDATE_TYPE','choice')
            .choices(updateTypeChoices)
            */
    file_upload.showView()
            .fields([nga.field('FILE_NAME'),
                nga.field('FILE_TYPE'),
                nga.field('USER_ID'),
                nga.field('UPLOAD_DATE', 'datetime'),
                nga.field('STATUS'),
                nga.field('TOTAL_PARSED'),
                nga.field('TOTAL_UPLOADED'),
                nga.field('TOTAL_FAILED'),
                nga.field('ERROR_MESSAGE'),
                nga.field('ACTION')
                ]);

    //admin.addEntity(file_upload);
    return file_upload;
};
exports.file_upload = file_upload;
