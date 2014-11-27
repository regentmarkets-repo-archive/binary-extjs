Ext.app.Dashboard = Ext.app.Dashboard || {};

Ext.app.Dashboard.CreateMediator = function ()
{
	var result = new Ext.util.Observable(
	{
		allStoresLoaded: function ()
		{
			return this.layoutsLoaded && this.dashboardsLoaded && this.componentsLoaded && this.dashboardComponentsLoaded;
		},
		layoutsLoaded: false,
		dashboardsLoaded: false,
		componentsLoaded: false,
		dashboardComponentsLoaded: false,
		allDeferred: false
	});

	result.addEvents(

		'dataLoaded',					// Fires after all required data loaded. dataLoaded(Mediator mediatorInstance)
		'dashboardsLoaded',				// Fires after dashboards store loaded. dashboardsLoaded(Store dashboardsStore)
		'dashboardComponentsLoaded',	// Fires after dashboardComonents store loaded. dashboardComponentsLoaded(Store dashboardComponentsStore)
		'layoutsLoaded',				// Fires after layouts store loaded. layoutsLoaded(Store layoutsStore)
		'componentsLoaded',				// Fires after components store loaded. componentsLoaded(Store componentsStore)

		'componentPositionChanged',		// Fires after an component position changed. componentPositionChanged(Portlet component)
		'componentAdded',				// Fires after an component is added to dashboard. componentAdded(Portlet component)
		'componentBeforeRemove',		// Fires before any component is removed from dashboard. componentBeforeRemove(Portlet component).
										// A handler can return false to cancel the remove.
		'componentRemoved',				// Fires after component is removed from dashboard.
										// componentRemoved(Portlet component).
		'componentBeforeEdit',			// Fires before any component edit. componentBeforeEdit(Portlet component, Window editWindow).
										// editWindow.items.items[0] contains Ext.grid.property.GridView which can be modified (see setSource method) or replaced.
										// A handler can return false to cancel edit action (can be useful to implement own editor).
		'componentEdit',				// Fires after component settings modified. componentEdit(Portlet component, DashboardComponentSettingsConfig settingsConfig)
		'componentCollapsed',			// Fires after component collapsed. componentCollapsed(Portlet component)
		'componentExpanded',			// Fires after component expanded. componentExpanded(Portlet component)
		'componentCreate',				// Fires when developer click a button to create component
		'componentModify',				// Fires when developer click a button to modify component
		'componentRemove'				// Fires when developer click a button to delete component
	);

	var getLoadedListener = function (eventName)
	{
		var result = function ()
		{
			var mediator = this;
			mediator[eventName] = true;
			if (mediator.allStoresLoaded() && !mediator.allDeferred)
			{
				mediator.allDeferred = true;
				Ext.defer(function ()
				{
					mediator.fireEvent("dataLoaded", mediator);
				}, 100, mediator);
			}
			mediator.un(eventName, result);
		};
		return result;
	};
	result.on('dashboardsLoaded', getLoadedListener('dashboardsLoaded'));
	result.on('layoutsLoaded', getLoadedListener('layoutsLoaded'));
	result.on('componentsLoaded', getLoadedListener('componentsLoaded'));
	result.on('dashboardComponentsLoaded', getLoadedListener('dashboardComponentsLoaded'));

	result.subscribedComponents = [];
	result.sub = function (componentID, eventName, handler)
	{
		/*
		if (result.subscribedComponents[componentID] && result.subscribedComponents[componentID][eventName])
		{
			return;
		}
		result.subscribedComponents[componentID] = result.subscribedComponents[componentID] || {};
		result.subscribedComponents[componentID][eventName] = handler;
		*/
		result.on(eventName, handler);
	};
	return result;
};