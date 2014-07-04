Ext.app.Dashboard = Ext.app.Dashboard || {};
Ext.app.Dashboard.Common = Ext.app.Dashboard.Common || {};


Ext.define('Ext.app.DashboardPanel',
{
	extend: 'Ext.panel.Panel',
	layout: 'fit',
	autoResuze: true,
	constructor: function(config)
	{
		config = config || {};

		this.id = 'dashboard-' + (config.containerId || Ext.id());
		config.renderTo = config.containerId;
		config.items = config.items || [];
		this.callParent(arguments);
	},
	initComponent: function()
	{
		this.items.push(
		{
			xtype: 'container',
			layout: 'border',
			items:
			[
				{
					xtype: 'portalpanel',
					region: 'center',
					flex: 1,
					autoScroll: true,
					bodyStyle: 'padding:0px 10px 10px 10px',
					tbar:
					{
						name: 'portalpanel-toolbar',
						style:
						{
							marginTop: '5px'
						},
						items:
						[
							{
								xtype: 'label',
								name: 'dashboardName',
								cls: 'dashboard-name',
								value: '',
								listeners:
								{
									afterrender: function (label)
									{
										label.getEl().set({ "title": "Click to edit dashboard name" });
										label.getEl().on("click", function ()
										{
											label.hide();
											var width = label.up().down("tbfill").getWidth();
											var editor = label.up().down("[name='dashboardNameEditor']");
											editor.setWidth(width);
											editor.setValue(label.text);
											editor.show();
											editor.focus();
										});
									}
								}
							},
							{
								xtype: 'textfield',
								cls: 'dashboard-name',
								name: 'dashboardNameEditor',
								value: '',
								hidden: true,
								listeners:
								{
									blur: function ()
									{
										this.save();
									},
									specialkey: function (tb, e)
									{
										var key = e.getKey();
										if (key == e.ENTER || key == e.TAB)
										{
											tb.hide();
										}
									}
								},
								save: function ()
								{
									var newName = this.getValue();
									this.hide();
									var dashboard = this.up('[setDashboardName]').dashboard;
									dashboard.setCurrentDashboardName(newName);
									var label = this.up().down("[name='dashboardName']");
									label.setText(newName);
									label.show();
								}
							}
						]
					}
				}
			]
		});
		this.on("afterrender", function ()
		{
			var me = this;
			me.fit();
			if (me.autoResize === true)
			{
				Ext.EventManager.onWindowResize(function ()
				{
					me.fit();
				});
			}
		});
		this.callParent(arguments);
	},
	fit: function ()
	{
		var me = this;
		var parentElement = Ext.get(me.containerId);
		me.setHeight(parentElement.getHeight());
		me.setWidth(parentElement.getWidth());
		me.doLayout();
	},
	setDashboardName: function (name)
	{
		this.down("[name='dashboardName']").setText(name);
	},
	getToolbar: function()
	{
		return this.getPortalPanel().down("[name='portalpanel-toolbar']");
	},
	getPortalPanel: function ()
	{
		return this.down("portalpanel");
	},
	selectLayout: function (layoutID)
	{
	},
	selectDashboard: function (dashboardID)
	{
	}
});
