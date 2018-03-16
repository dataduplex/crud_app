var approvals = function (nga, admin) {
/*      'SKU': null,
        'TEAM': null,
        'STATUS': null,
        'UPDATE_USER': null,
        'UPDATE_TIME': null
*/
    
    const statuses = ['Pending', 'Accepted', 'Rejected'];
    const statusChoices = statuses.map(status => ({ label: status, value: status }));
    var approvals = admin.getEntity('approvals')
        .identifier(nga.field('ID'))
        .label('APPROVALS');
    
    approvals.listView()
                    .fields([nga.field('SKU').isDetailLink(true),
                            nga.field('TEAM'),
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
                    .listActions(['show']);

    //.editable(false)
    approvals.showView().fields(
        [nga.field('SKU'),
        nga.field('TEAM'),
        nga.field('STATUS'),
        nga.field('UPDATE_USER'),
        nga.field('UPDATE_TIME')
        ]);
    

    return approvals;
};
exports.approvals = approvals;
