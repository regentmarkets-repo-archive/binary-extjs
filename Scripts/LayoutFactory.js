Ext.app.Dashboard = Ext.app.Dashboard || {};

var layoutsArray =
[
	{
		Name: '1-Column',
		ID: 1
	},
	{
		Name: '2-Column',
		ID: 2
	},
	{
		Name: '3-Column',
		ID: 3
	}
];

Ext.app.Dashboard.LayoutFactory = function (dashboard)
{
	var idFormat = "column-{0}-order-{1}";
	
	var doLayout = function (portalPanel, columnsCount)
	{
		var allPortlets = portalPanel.query("portlet");
		Ext.each(allPortlets, function (item)
		{
			item.up().remove(item, false);
		});
		var allColumns = portalPanel.query("portalcolumn");
		Ext.each(allColumns, function (item)
		{
			item.up().remove(item, true);
		});

		for (var i = 0; i < columnsCount; i++)
		{
			portalPanel.add(new Ext.app.PortalColumn(
			{
				columnIndex: i,
				items: allPortlets.slice(i * ((allPortlets.length / columnsCount)), (i + 1) * ((allPortlets.length / columnsCount))),
				listeners:
				{
					add: function (column, dashlet, index)
					{
						var allDashlets = column.query('portlet');
						for (var order = 0; order < allDashlets.length; order++)
						{
							allDashlets[order].component.set("DashletID", Ext.String.format(idFormat, column.columnIndex, order));
						}
						Ext.app.Mediator.fireEvent("componentPositionChanged", dashlet, column);
					},
					beforeremove: function (column, portlet)
					{
						Ext.app.Mediator.fireEvent("componentBeforeRemove", portlet);
					}
				}
			}));
		};
		var s = "";
	};

	var parseId = function(id)
	{
		return id.match(/column-(\d*)-order-(\d*)/);
	}
	//column-xxx-order-xxx
	this.getNextId = function(portalPanel, columnIndex)
	{
		var portlets=portalPanel.query("portalcolumn")[columnIndex].query("portlet");
		var maxId=0;
		Ext.each(portlets, function(item)
		{
			var portletNumber = parseId(item.component.get("DashletID"))[2];
			if (maxId < portletNumber) maxId = parseInt(portletNumber);
		});
		return Ext.String.format(idFormat, columnIndex, maxId+1);
	};

	this.addComponentInternal = function (portalPanel, component)
	{
		var componentInstance = null;
		var id=component.get("DashletID");
		var isNewComponent = !id;
		if (isNewComponent)
		{
			id = this.getNextId(portalPanel, 0);
			component.set("DashletID", id);
		}
		
		var parsedId = parseId(id);
		var column = portalPanel.query("portalcolumn")[parsedId[1]];
		component.Options = component.data.Options || component.data.Options;

		var componentConfig =
		{
			title: component.Options.Title,
			xtype: 'portlet',
			component: component,
			collapsed: component.Options.Collapsed,
			tools:
			[
				{
					xtype: 'tool',
					type: 'gear',
					handler: function (e, target, panelHeader, tool)
					{
						var cmp = this.up("portlet");
						var sourceConfig = dashboard.getComponents().findRecord("ID", cmp.component.get("ComponentID")).data.DisplaySettings;
						//dashboard.getComponents().findRecord("ComponentID", cmp.component.get("ComponentID"))
						var settingsCopy = Ext.clone(cmp.component.Options);
						var w = new Ext.window.Window(
						{
							modal: true,
							width: 400,
							height: 300,
							title: 'Edit component properties',
							items:
							[
								{
									xtype: 'propertygrid',
									source: cmp.component.Options,
									sourceConfig: sourceConfig
								}
							],
							buttons:
							[
								{
									text: 'Save',
									handler: function ()
									{
										Ext.app.Mediator.fireEvent('componentEdit', cmp, sourceConfig);
										this.up("window").close();
									}
								},
								{
									text: 'Cancel',
									handler: function ()
									{
										cmp.component.Options = settingsCopy;
										this.up("window").close();
									}
								}
							]
						});
						w.down("propertygrid").getStore().filterBy(function(rec)
						{
							return !!(sourceConfig[rec.data.name]);
						});
						if (Ext.app.Mediator.fireEvent("componentBeforeEdit", this.up("portlet"), w))
						{
							w.show();
						}
					}
				}
			],
			listeners:
			{
				collapse: function()
				{
					Ext.app.Mediator.fireEvent("componentCollapsed", this);
				},
				expand: function()
				{
					Ext.app.Mediator.fireEvent("componentExpanded", this);
				},
				beforeclose: function ()
				{
					return Ext.app.Mediator.fireEvent("componentBeforeRemove", this);
				},
				close: function (dashlet)
				{
					Ext.app.Mediator.fireEvent("componentRemoved", this);
				}
			},
			html: ''
		};
		column.suspendEvents(false);
		componentInstance = column.add(componentConfig);
		column.resumeEvents();

		var componentUrl = component.Options.Url;
		if (componentUrl.indexOf('?') == -1) componentUrl += '?';
		componentUrl += Ext.Object.toQueryString(Ext.applyIf({ Options: null }, component.data));

		if (component.Options.IFrame)
		{
			var html = Ext.String.format('<iframe src="{0}" style="width:100%;height:{1}; border:0" onload="Ext.app.Dashboard.LayoutFactory.IFrameLoaded(\'{2}\')"></iframe>',
				componentUrl,
				component.Options.Height,
				componentInstance.id);
			componentInstance.update(html);
		}
		else
		{
			Ext.Ajax.request(
			{
				url: componentUrl,
				success: function (response)
				{
					componentInstance.update(response.responseText, true);
					componentInstance.doLayout();
					if (isNewComponent)
					{
						Ext.app.Mediator.fireEvent("componentAdded", componentInstance);
					}
				}
			});
		}
		return componentInstance;
	};
	
	this.cleanup = function (portalPanel)
	{
		var allColumns = portalPanel.query("portalcolumn");
		Ext.each(allColumns, function (column)
		{
			Ext.each(column.query("portlet"), function (portlet)
			{
				portlet.up().remove(portlet);
			});
			column.up().remove(column, true);
		});
	};

	var me = this;
	this["1"] =
	{
		getThumbnailHtml: function ()
		{
			return '<table class="layout-thumbnail"><tr><td>&nbsp;</td></tr></table>';
		},
		doDashboardLayout: function (portalPanel)
		{
			doLayout(portalPanel, 1);
		},
		addComponent: function (portalPanel, component)
		{
			return me.addComponentInternal(portalPanel, component);
		}
	};
	this["2"] =
	{
		getThumbnailHtml: function ()
		{
			return '<table class="layout-thumbnail"><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table>';
		},
		doDashboardLayout: function (portalPanel)
		{
			doLayout(portalPanel, 2);
		},
		addComponent: function (portalPanel, component)
		{
			return me.addComponentInternal(portalPanel, component);
		}
	};
	this["3"] =
	{
		getThumbnailHtml: function ()
		{
			return '<table class="layout-thumbnail"><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>';
		},
		doDashboardLayout: function (portalPanel)
		{
			doLayout(portalPanel, 3);
		},
		addComponent: function (portalPanel, component)
		{
			return me.addComponentInternal(portalPanel, component);
		}
	};
	this.getDefaultLayoutID = function ()
	{
		return 1;
	};
};

Ext.app.Dashboard.LayoutFactory.IFrameLoaded = function (id)
{
	Ext.app.Mediator.fireEvent("componentAdded", Ext.getCmp(id));
}