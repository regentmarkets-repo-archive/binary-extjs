Ext.define('BinaryUI.store.Apps', {
	extend: 'Ext.data.ArrayStore',
	alias: 'store.apps',
	model: 'BinaryUI.model.App',
	data:
	[
        ['Statement'],
        ['Profit Table']
	]
});
