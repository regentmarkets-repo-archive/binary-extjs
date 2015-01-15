/// <reference path="Binary.Core.js" />
/// <reference path="../Dashboard.js" />

ns("Binary.App");

Binary.App.run = function (proxyUrl)
{
	Ext.Loader.setConfig({ enabled: true });

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

	$(window).bind("message", function (e)
	{
		if (e.originalEvent.data.indexOf(Binary.PostMessageOSPrefix) == 0)
		{
			var data = $.parseJSON(e.originalEvent.data.substr(Binary.PostMessageOSPrefix.length));
			if(data.action == 'set_title')
			{
				Ext.each(window.Dashboard.DashboardPanel.getPortalPanel().query('portlet'), function (portlet)
				{
					if (portlet.component.data.ID == data.widgetID)
					{
						portlet.setTitle(data.data);
					}
				});
			}
		}
	});
};

Binary.App.OpenSocial =
{
	set_title: function (data)
	{
		Binary.App.getWidgetEl(data.widgetID)
	}
};