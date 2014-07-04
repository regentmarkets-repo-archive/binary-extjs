Ext.app.Dashboard.ApplyToolbarDashboardEditor = function (dashboard)
{
	var tbar = window.Dashboard.DashboardPanel.getToolbar();
	tbar.showEditWindow = function (title, windowItems, buttons)
	{
		var w = new Ext.window.Window(
		{
			title: title,
			layout: 'fit',
			modal: true,
			width: 800,
			height: 400,
			bodyBorder: true,
			items: windowItems,
			bbar:
			{
				height: 40,
				items: buttons.slice(0).concat(
				[
					'->',
					{
						text: 'Close',
						width: 100,
						handler: function ()
						{
							w.close();
						}
					}
				])
			}
		}).show();
	};
	tbar.add(
	[
		{
			xtype: 'button',
			text: 'Add Gadget',
			iconCls: 'add-gadget-icon',
			width: 110,
			handler: function ()
			{
				this.up().showEditWindow(
				"Add Gadget",
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
					}
				], []);
			}
		},
		{
			xtype: 'button',
			text: 'Edit Layout',
			width: 110,
			iconCls: 'edit-layout-icon',
			handler: function ()
			{
				this.up().showEditWindow(
				"Layouts",
				[
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
				], []);
			}
		},
		{
			xtype: 'button',
			text: 'My Dashboards',
			width: 130,
			iconCls: 'edit-dashboards-icon',
			handler: function ()
			{
				this.up().showEditWindow(
				"My Dashboards",
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
							selectionchange: function (view, selectedItems)
							{
								if (selectedItems.length > 0)
								{
									var dashboardID = selectedItems[0].get("ID");
									dashboard.setCurrentDashboard(dashboardID);
								}
							}
						}
					}
				],
				[
					{
						xtype: 'button',
						text: 'Create Dashboard',
						handler: function ()
						{
							dashboard.addDashboard('My new Dashboard');
						}
					},
					{
						xtype: 'button',
						text: 'Delete Dashboard',
						handler: function ()
						{
							var selection = this.up('window').down('grid').getSelectionModel().getSelection();
							if (selection.length > 0)
							{
								var dashboards = dashboard.getDashboards();
								if (dashboards.getCount() == 1)
								{
									Ext.MessageBox.show(
									{
										buttons: Ext.MessageBox.OK,
										title: "Error",
										msg: "You can not delete all dashboards that you have",
										height: 160,
										width: 400,
										icon: Ext.MessageBox.ERROR
									});
								}
								else
								{
									Ext.MessageBox.show(
									{
										buttons: Ext.MessageBox.YESNO,
										title: "Warning",
										msg: "Please confirm that you want to delete '" + selection[0].data.Name + "'?",
										height: 160,
										width: 450,
										icon: Ext.MessageBox.QUESTION,
										fn: function (buttonId)
										{
											if (buttonId == "yes")
											{
												var otherIndex = dashboards.findBy(function (rec) { return rec.get("ID") != selection[0].get("ID"); });
												dashboard.setCurrentDashboard(dashboards.getAt(otherIndex).data.ID);
												dashboards.removeAt(dashboards.indexOf(selection[0]));
												dashboards.sync();
											}
										}
									});
								}
							}
							else
							{
								Ext.MessageBox.show(
								{
									buttons: Ext.MessageBox.OK,
									title: "Error",
									msg: "Please select Dashboard to delete.",
									height: 160,
									width: 400,
									icon: Ext.MessageBox.ERROR
								});
							}
						}
					}
				]);
			}
		},
		{ xtype: 'tbspacer', width: 20 }
	]);
};