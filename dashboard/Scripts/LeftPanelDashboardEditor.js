Ext.app.Dashboard.ApplyLeftPanelDashboardEditor = function (dashboard)
{
	var panel = dashboard.DashboardPanel.getPortalPanel().up();
	var mediator = Ext.app.Mediator;
	dashboard.DashboardPanel.selectDashboard = function (dashboardID)
	{
		var dashboardsPanel = this.down("[name='dashboardsPanel']");
		var currentDashboard = dashboardsPanel.store.findRecord("ID", dashboardID);
		dashboardsPanel.suspendEvents(false);
		dashboardsPanel.getSelectionModel().select(currentDashboard);
		dashboardsPanel.resumeEvents();
	};

	dashboard.DashboardPanel.selectLayout = function (layoutID)
	{
		var layoutsPanel = this.down("[name='layoutsPanel']");
		var layout = layoutsPanel.store.findRecord("ID", layoutID);
		layoutsPanel.suspendEvents(false);
		layoutsPanel.getSelectionModel().select(layout);
		layoutsPanel.resumeEvents();
	};

	panel.insert(0,
	{
		title: 'Options',
		region: 'west',
		animCollapse: true,
		width: 250,
		minWidth: 200,
		maxWidth: 400,
		split: true,
		collapsible: true,
		layout:
		{
			type: 'accordion',
			animate: true
		},
		items:
		[
			{
				title: 'My Dashboards',
				autoScroll: true,
				border: false,
				iconCls: 'nav',
				items:
				[
					{
						xtype: 'grid',
						name: 'dashboardsPanel',
						border: false,
						hideHeaders: true,
						store: dashboard.getDashboards(),
						selModel:
						{
							allowDeselect: false,
							mode: 'SINGLE'
						},
						columns:
						[
							{
								text: 'Name',
								dataIndex: 'Name',
								flex: 1
							}
						],
						listeners:
						{
							afterrender: function (dashboardsPanel)
							{
								dashboardsPanel.store.on("beforesync", function ()
								{
									dashboardsPanel.setLoading(true);
								});

								dashboardsPanel.store.on("refresh", function ()
								{
									dashboardsPanel.setLoading(false);
								});
							},
							selectionchange: function (view, selectedItems)
							{
								var dashboardID = selectedItems[0].get("ID");
								dashboard.setCurrentDashboard(dashboardID);
							}
						}
					},
					{
						xtype: 'button',
						text: 'Add Dashboard',
						style: 'margin-top:10px; float:right',
						handler: function ()
						{
							dashboard.addDashboard('My Dashboard');
						}
					}
				]
			},
			{
				title: 'Components',
				border: false,
				autoScroll: true,
				hideHeaders: true,
				iconCls: 'settings',
				selModel:
				{
					allowDeselect: false,
					mode: 'SINGLE'
				},
				items:
				[
					{
						xtype: 'grid',
						hideHeaders: true,
						store: dashboard.getComponents(),
						columns:
						[
							{
								dataIndex: 'IconUrl',
								width: 26,
								renderer: function (val)
								{
									return val ? ("<img src='" + val + "' style='width:16px;height:16px' />") : '';
								}
							},
							{
								dataIndex: 'Name',
								flex: 1
							},
						],
						listeners:
						{
							selectionchange: function (view, selectedItems)
							{
								dashboard.addComponent(selectedItems[0]);
							}
						}
					},
					{
						xtype: 'container',
						html: '<i style="font-size:11px">Click on component<br/> to add to the current dashboard</i>',
						style: 'margin-top:10px; float:right'
					}
				]
			},
			{
				title: 'Layouts',
				border: false,
				autoScroll: true,
				iconCls: 'settings',
				items:
				{
					xtype: 'dataview',
					name: 'layoutsPanel',
					store: dashboard.getLayouts(),
					trackOver: true,
					overItemCls: 'layout-thumbnail-container-over',
					selectedItemCls: 'layout-thumbnail-container-selected',
					itemSelector: '.layout-thumbnail-container',
					tpl:
					[
						'<tpl for=".">',
						'<span id="Layout_{ID}" class="layout-thumbnail-container" title="{Name}">',
						'{ID:getLayoutThumbnailHtml}',
						'<p class="layout-name">{Name}</p>',
						'</span>',
						'</tpl>',
						'<div class="x-clear"></div>'
					],
					listeners:
					{
						selectionchange: function (view, selectedItems)
						{
							var layoutID = selectedItems[0].get("ID");
							dashboard.setCurrentDashboardLayout(layoutID);
						}
					}
				}
			}
		]
	});
};