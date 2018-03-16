// nga.menu(entity) sets defaults title, link and active values correctly
//            .addChild(nga.menu(admin.getEntity('launch_phase_ref'))
//                .icon('<span class="fa fa-database fa-fw"></span>'))

var landing_menu = function (nga, admin) {
    return nga.menu()
        .addChild(nga.menu()
            .title('Products')
            .icon('<span class="fa fa-mobile fa-fw"></span>')
            .addChild(nga.menu(admin.getEntity('product_definition')) // nga.menu(entity) sets defaults title, link and active values correctly
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('image_urls'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
        )
        .addChild(nga.menu()
            .title('Imports/Exports')
            .icon('<span class="fa fa-truck fa-fw"></span>')
            .addChild(nga.menu(admin.getEntity('file_upload')) // nga.menu(entity) sets defaults title, link and active values correctly
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('imports'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('file_exports'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('sku_export_status'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('approvals'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('release_versions'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
            .addChild(nga.menu(admin.getEntity('environment_map'))
                .icon('<span class="fa fa-database fa-fw"></span>'))
        )
};

exports.landing_menu = landing_menu;

