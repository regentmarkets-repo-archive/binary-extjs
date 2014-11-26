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

	var leftPanel = panel.insert(0,
	{
		title: 'Options',
		region: 'west',
		animCollapse: true,
		width: 250,
		minWidth: 200,
		maxWidth: 400,
		split: true,
		collapsible: true,
		getComponentList: function()
		{
			return this.down('[name="ComponentList"]');
		},
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
				name: 'ComponentList',
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
						cls: 'left-panel-components-list',
						store: dashboard.getComponents(),
						columns:
						[
							{
								dataIndex: 'IconUrl',
								width: 26,
								renderer: function (value, metaData, record, rowIdx, colIdx, store, view)
								{
									return record.get('Options').IconUrl ? ("<img src='" + record.get('Options').IconUrl + "' style='width:16px;height:16px' />") : '';
								}
							},
							{
								dataIndex: 'Name',
								renderer: function (value, metaData, record, rowIdx, colIdx, store, view)
								{
									return (record.get('Options').Title || "") +
										(record.get('IsOwner') ?
										"&nbsp;<div class='owner-gadget-functions'><img src='Scripts/Images/application_delete.png' />&nbsp;<img src='Scripts/Images/application_delete.png' /></div>" :
										"");
								},
								flex: 1
							},
							{
								dataIndex: 'IsOnwer',
								width: 20,
								renderer: function (value, metaData, record, rowIdx, colIdx, store, view)
								{
									return record.get('IsOwner') ? "<img src='Scripts/Images/application_edit.png' />" : "";
								}
							},
							{
								dataIndex: 'IsOnwer',
								width: 20,
								renderer: function (value, metaData, record, rowIdx, colIdx, store, view)
								{
									return record.get('IsOwner') ? "<img src='Scripts/Images/application_delete.png' />" : "";
								}
							}
						],
						listeners:
						{
							cellclick: function (view, cellEl, colIndex, record, rowEl, rowIndex, e)
							{
								if (colIndex == 0 || colIndex == 1)
								{
									dashboard.addComponent(record);
								}
								if (colIndex == 2 && record.get('IsOwner'))
								{
									alert("edit" + record.data.Manifest);
								}
								if (colIndex == 3 && record.get('IsOwner'))
								{
									alert("delete" + record.data.ID);
								}
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
	return leftPanel;
};