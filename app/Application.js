Ext.define('BinaryUI.Application', {

    name: 'BinaryUI',
    extend: 'Ext.app.Application',
	autoCreateViewport: 'BinaryUI.view.main.Main',
	requires: ['BinaryUI.*', 'Ext.*']
});
