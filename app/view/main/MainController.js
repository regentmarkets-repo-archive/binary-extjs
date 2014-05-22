/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
 Ext.define('BinaryUI.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.MessageBox'
    ],

    alias: 'controller.main',

    onClickButton: function () {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
        }
    },

    onAddFeed: function () {
        var dashboard = this.getReference('dashboard');
        dashboard.addNew('rss');
    },

    onAddFeedUrl: function (sender) {
        var dashboard = this.getReference('dashboard');

        dashboard.addView({
            type: 'rss',
            feedUrl: sender.feedUrl
        });
    }

});
