/// <reference path="Mediator.js" />
/// <reference path="Panel.js" />
Ext.app.Dashboard = function (id, currentUserID, mode, componentsUrl)
{
	mode = mode || "server";
	/// <signature>
	/// <summary>Dashboard constructor</summary>
	/// <param name="id" type="String">id of the html tag to render dashboard</param>
	/// <param name="currentUserID" type="Number">current user ID</param>
	/// </signature>
	if (this == Ext.app) throw "Illegal function call. Please use 'new' keyword to create dashboard instance";

	var dashboard = this;
	this.LayoutFactory = new Ext.app.Dashboard.LayoutFactory(dashboard);
	Ext.util.Format.getLayoutThumbnailHtml = function (id)
	{
		return dashboard.LayoutFactory[id.toString()].getThumbnailHtml();
	};

	//ensure Mediator singleton
	var mediator = (Ext.app.Mediator = Ext.app.Mediator || Ext.app.Dashboard.CreateMediator());
	var onLoad = function ()
	{
		var currentDashboard = dashboard.getCurrentDashboard();
		dashboard.setCurrentDashboard(currentDashboard.get("ID"));
		mediator.un("dataLoaded", onLoad);
	};
	if (mediator.allStoresLoaded())
	{
		onLoad();
	}
	else
	{
		mediator.on("dataLoaded", onLoad);
	};

	var dashboardId = id;
	this.getId = function ()
	{
		/// <signature>
		/// <summary>Gets current id of HTML element where dashboard rendered</summary>
		/// </signature>
		return dashboardId;
	};

	var userId = currentUserID;
	this.getUserID = function ()
	{
		/// <signature>
		/// <summary>Gets current user ID</summary>
		/// </signature>
		return userId;
	};

	var common = Ext.app.Dashboard.Common;
	
	this.getNextStoreID = function (store)
	{
		var maxId = 0;
		store.each(function (rec)
		{
			maxId = Math.max(maxId, rec.get('ID'));
		});
		return maxId + 1;
	};

	var dashboardProxy =
	{
		writer:
		{
			type: 'json',
			allowSingle: false,
			root: ''
		},
		api:
		{
			read: 'Dashboard/GetDashboards',
			update: 'Dashboard/UpdateDashboard',
			create: 'Dashboard/CreateDashboard',
			destroy: 'Dashboard/DeleteDashboard',
		}
	};

	var dashboardComponentsProxy =
	{
		writer:
		{
			type: 'json',
			allowSingle: false,
			root: ''
		},
		api:
		{
			read: 'Dashboard/GetUserComponents',
			update: 'Dashboard/UpdateUserComponents',
			create: 'Dashboard/CreateUserComponents',
			destroy: 'Dashboard/RemoveUserComponents',
		}
	}

	var layoutsProxy =
	{
		api:
		{
			read: 'Dashboard/GetLayouts'
		}
	}

	var componentsProxy =
	{
		api:
		{
			read: 'Dashboard/GetComponents'
		}
	}

	if (mode == "local")
	{
		dashboardProxy =
		{
			type: 'localstorage',
			id: 'dashboards',
			writer:
			{
				type: 'json',
				allowSingle: false,
				root: ''
			}
		};
		dashboardComponentsProxy =
		{
			type: 'localstorage',
			id: 'dashboardComponents',
			writer:
			{
				type: 'json',
				allowSingle: false,
				root: ''
			}
		};
		layoutsProxy =
		{
			type: 'localstorage',
			id: 'layouts'
		};
		componentsProxy =
		{
			actionMethods:
			{
				read: 'GET'
			},
			url: componentsUrl
		}		
	}

	var dashboardsStore = new Ext.data.JsonStore(
	{
		storeId: 'dashboardsStore' + id,
		fields: ['Name', 'UserID', 'LayoutID', 'IsCurrent', 'ID'],
		proxy: Ext.apply(common.getDefaultProxy(), dashboardProxy),
		autoLoad: true,
		listeners:
		{
			beforeload: function ()
			{
				this.getProxy().extraParams =
				{
					userID: currentUserID
				};
			},
			load: function ()
			{
				if ((dashboardsStore.getCount() == 0) && (mode == "local"))
				{
					dashboardsStore.add(
					{
						Name: 'My new Dashboard',
						IsCurrent: true,
						UserID: dashboard.getUserID(),
						LayoutID: 1,
						ID: dashboard.getNextStoreID(dashboardsStore)
					});
					dashboardsStore.sync(
					{
						success: function ()
						{
							mediator.fireEvent("dashboardsLoaded", this);
						}
					});
					layoutsStore.add(layoutsArray);
					layoutsStore.sync(
					{
						success: function ()
						{
							mediator.fireEvent("layoutsLoaded", this);
						}
					});
				}
				else
				{
					mediator.fireEvent("dashboardsLoaded", this);
				}
			}
		}
	});
	
	var dashboardComponentsStore = new Ext.data.JsonStore(
	{
		storeId: 'dashboardComponentsStore' + id,
		fields: ['DashboardID', 'ComponentID', 'Options', 'DashletID', 'ID'],
		proxy: Ext.apply(common.getDefaultProxy(), dashboardComponentsProxy),
		autoLoad: true,
		listeners:
		{
			beforeload: function ()
			{
				this.getProxy().extraParams =
				{
					userID: currentUserID
				};
			},
			load: function ()
			{
				mediator.fireEvent("dashboardComponentsLoaded", this);
			}
		}
	});
	

	this.getDashboards = function ()
	{
		/// <signature>
		/// <summary>Gets store with user's dashboard list</summary>
		/// </signature>
		return dashboardsStore;
	};
	this.getCurrentDashboard = function ()
	{
		/// <signature>
		/// <summary>Gets currently active dashboard</summary>
		/// </signature>
		return this.getDashboards().findRecord("IsCurrent", true);
	}

	var setCurrentDashboardInternal = function (dashboardEntity)
	{
		var dashboardID=dashboardEntity.get("ID");
		dashboard.DashboardPanel.selectDashboard(dashboardID);
		dashboard.DashboardPanel.setDashboardName(dashboardEntity.get("Name"));

		var layoutID = dashboardEntity.get("LayoutID");
		dashboard.LayoutFactory.cleanup(dashboard.DashboardPanel.getPortalPanel());
		dashboard.setCurrentDashboardLayout(layoutID);
		
		var allComponents = [];
		dashboardComponentsStore.each(function (item)
		{
			if (item.get("DashboardID") == dashboardID)
			{
				dashboard.LayoutFactory[layoutID.toString()].addComponent(dashboard.DashboardPanel.getPortalPanel(), item);
			}
		});
	};
	this.setCurrentDashboard = function (dashboardID)
	{
		/// <signature>
		/// <summary>Set active dashboard</summary>
		/// <param name="dashboardID" type="Number">dashboard ID</param>
		/// </signature>
		var current = this.getCurrentDashboard();

		if (current.get("ID") != dashboardID)
		{
			current.set("IsCurrent", false);
			var dashboards = this.getDashboards();
			var selected = dashboards.findRecord("ID", dashboardID);
			selected.set("IsCurrent", true);
			dashboards.sync(
			{
				success: function ()
				{
					setCurrentDashboardInternal(selected);
				}
			});
		}
		else
		{
			setCurrentDashboardInternal(current);
		}
	};

	this.setCurrentDashboardName = function (name)
	{
		/// <signature>
		/// <summary>Set active dashboard name (title)</summary>
		/// <param name="name" type="String">dashboard title</param>
		/// </signature>
		var current = this.getCurrentDashboard();
		if (current.get("Name") != name)
		{
			current.set("Name", name);
			this.getDashboards().sync();
		}
		this.DashboardPanel.setDashboardName(name);
	};

	var layoutsStore = new Ext.data.JsonStore(
	{
		storeId: 'layoutsStore'+id,
		fields: ['Name', 'ID'],
		proxy: Ext.apply(common.getDefaultProxy(), layoutsProxy),
		autoLoad: true,
		listeners:
		{
			load: function ()
			{
				mediator.fireEvent("layoutsLoaded", this);
			}
		}
	});
	
	this.getLayouts = function ()
	{
		/// <signature>
		/// <summary>Gets layout list</summary>
		/// </signature>
		return layoutsStore;
	};
	this.getCurrentDashboardLayout = function ()
	{
		/// <signature>
		/// <summary>Gets current dashboard layout</summary>
		/// </signature>
		return this.getLayouts().findRecord("ID", this.getCurrentDashboard().get("LayoutID"));
	}

	this.setCurrentDashboardLayout = function (layoutID)
	{
		/// <signature>
		/// <summary>Change current dashboard layout by layoutID</summary>
		/// <param name="layoutID" type="Number">layout ID</param>
		/// </signature>
		var currentDashboard = this.getCurrentDashboard();
		if (currentDashboard.get("LayoutID") != layoutID)
		{
			currentDashboard.set("LayoutID", layoutID);
			this.getDashboards().sync(
			{
				success: function ()
				{
					dashboard.DashboardPanel.selectLayout(layoutID);
				}
			});
		}
		else
		{
			dashboard.DashboardPanel.selectLayout(layoutID);
		}
		this.LayoutFactory[layoutID.toString()].doDashboardLayout(dashboard.DashboardPanel.getPortalPanel());
	};

	var componentsStore = new Ext.data.JsonStore(
	{
		storeId: 'componentsStore' + id,
		fields: ['Name', 'ID', 'IconUrl', 'ComponentID', 'Options', 'DisplaySettings', 'IsOwner', 'Manifest'],
		proxy: Ext.apply(common.getDefaultProxy(), componentsProxy),
		autoLoad: true,
		listeners:
		{
			load: function ()
			{
				mediator.fireEvent("componentsLoaded", this);
			}
		}
	});
	this.getComponents = function ()
	{
		/// <signature>
		/// <summary>Gets component list</summary>
		/// </signature>
		return componentsStore;
	};

	this.addDashboard = function (name)
	{
		dashboardsStore.add(
		{
			Name: name,
			IsCurrent: false,
			UserID: dashboard.getUserID(),
			LayoutID: 1,
			ID: dashboard.getNextStoreID(dashboardsStore)
		});
		dashboardsStore.sync();
	};

	this.addComponent = function (component)
	{
		/// <signature>
		/// <summary>Add component to the current dashboard</summary>
		/// <param name="name" type="Ext.data.Model">dashboard title</param>
		/// </signature>
		var currentDashboard = this.getCurrentDashboard();
		var record = dashboardComponentsStore.add(
		{
			ComponentID: component.get("ID"),
			DashboardID: currentDashboard.get("ID"),
			DashletID: this.LayoutFactory.getNextId(this.DashboardPanel.getPortalPanel(), 0),
			Options: component.data.Options,//test
			ID: 0
		});
		dashboardComponentsStore.sync(
		{
			success: function ()
			{
				var currentLayout = dashboard.LayoutFactory[dashboard.getCurrentDashboardLayout().get("ID").toString()];
				var componentInstance = currentLayout.addComponent(dashboard.DashboardPanel.getPortalPanel(), arguments[1].operations.create[0]);
			}
		});
		return record;
	};

	this.DashboardPanel = Ext.create("Ext.app.DashboardPanel",
	{
		containerId: dashboard.getId(),
		dashboard: dashboard
	});
	mediator.on("componentPositionChanged", function (component)
	{
		dashboardComponentsStore.sync();
	});
	mediator.on("componentRemoved", function (component)
	{
		dashboardComponentsStore.remove(component.component);
		dashboardComponentsStore.sync();
	});

	var saveComponentState = function (cmp)
	{
		cmp.component.Options.ID = cmp.component.get("ID");
		Ext.Ajax.request(
		{
			url: "Dashboard/UpdateComponentSettings",
			params: cmp.component.Options,
			success: function (response)
			{
				cmp.setTitle(cmp.component.Options.Title);
			}
		});
	};

	mediator.on("componentEdit", saveComponentState);
	mediator.on("componentCollapsed", function (cmp)
	{
		cmp.component.Options.Collapsed = true;
		saveComponentState(cmp);
	});
	mediator.on("componentExpanded", function (cmp)
	{
		cmp.component.Options.Collapsed = false;
		saveComponentState(cmp);
	});
};

Ext.app.Dashboard.Common =
{
	getDefaultProxy: function ()
	{
		var proxy =
		{
			type: 'ajax',
			actionMethods:
			{
				read: 'POST',
				create: 'POST',
				update: 'POST',
				destroy: 'POST'
			},
			api: {},
			reader:
			{
				type: 'json',
				root: '',
				idProperty: 'ID'
			}
		};
		return proxy;
	}
};

