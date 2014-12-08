ns("Binary.App");

Binary.App.run = function (proxyUrl)
{
	Ext.Loader.setConfig({ enabled: true });

	Binary.App.widgetSettingsStore = Ext.create('Ext.data.Store',
	{
		type: 'localstorage',
		autoLoad: true,
		proxy:
		{
			type: 'localstorage',
			id: 'widgetSettingsStore'
		},
		fields: ['ID', 'Settings']
	});

	window.Dashboard = new Ext.app.Dashboard('dashboardTest', '1', 'local', 'dataComponents.json');
	Binary.App.localDeveloperStore = Ext.create('Ext.data.Store',
	{
		type: 'localstorage',
		autoLoad: true,
		proxy:
		{
			type: 'localstorage',
			id: 'localDeveloperStore'
		},
		fields: ['Name', 'ID', 'IconUrl', 'ComponentID', 'Options', 'DisplaySettings', 'Manifest', 'IsOwner']
	});

	var componentsUpdate = function ()
	{
		var components = window.Dashboard.getComponents();
		components.each(function (component)
		{
			if (component.data.Options.Url.indexOf("{proxyUrl}") > -1)
			{
				component.data.Options.Url = component.data.Options.Url.replace("{proxyUrl}", proxyUrl);
			}
		});
		Binary.App.localDeveloperStore.each(function (devComponent)
		{
			components.add(devComponent.data);
		});
	};
	Ext.app.Mediator.on("componentsLoaded", componentsUpdate);

	var leftPanel = Ext.app.Dashboard.ApplyLeftPanelDashboardEditor(window.Dashboard);
	var componentEditor = new Ext.app.ComponentEditor(
		window.Dashboard.getComponents(),
		Binary.App.localDeveloperStore,
		proxyUrl + '/ValidateWidget');

	Binary.Api.Manager = new window.Binary.Api.ManagerClass(proxyUrl);
	Binary.Api.Manager.BeginProcessing();
};

gadgets.Prefs.prototype.set = function (key, value)
{
	var gadgetID=this.getString("ID");
	var widgetRecord = Binary.App.widgetSettingsStore.findRecord("ID", gadgetID);
	if (!widgetRecord)
	{
		widgetRecord = Binary.App.widgetSettingsStore.add(
		{
			ID: gadgetID,
			Options: {}
		});
	}
	var options = widgetRecord.get("Options");
	options[key] = value;
	Binary.App.widgetSettingsStore.sync();
};