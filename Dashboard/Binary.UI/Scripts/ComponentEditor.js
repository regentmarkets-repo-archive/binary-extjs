Ext.app.ComponentEditor = function (componentStore, localDeveloperStore, validateWidgetUrl)
{
	var mediator = Ext.app.Mediator;
	var createOrEditGadget = function (record)
	{
		Ext.app.ComponentEditor.gadgetWindow = new Ext.window.Window(
		{
			width: 600,
			height: 400,
			title: 'Add new gadget',
			modal: true,
			closable: false,
			processGadgetSubmit: function (e)
			{
				var result = $.parseJSON(e.originalEvent.data);
				if (!result.apiMethod)
				{
					$(window).unbind("message", Ext.app.ComponentEditor.gadgetWindow.processGadgetSubmit);
					if (result.validationResult)
					{
						var widget =
						{
							ID: result.ID,
							Manifest: result.manifest,
							Name: result.widget.ModulePrefs.Title,
							IconUrl: result.widget.ModulePrefs.ThumbnailUrl,
							IsOwner: true,
							Options:
							{
								Height: result.widget.ModulePrefs.Height || "300px",
								Collapsed: false,
								Title: result.widget.ModulePrefs.Title,
								IFrame: true,
								Url: result.widget.Content.Href,
								PreventExpandable: false,
								IconUrl: result.widget.ModulePrefs.ThumbnailUrl
							}
						};
						if (record)
						{
							var index = componentStore.find("ID", record.get("ID"));
							componentStore.removeAt(index);
							if (localDeveloperStore)
							{
								index = localDeveloperStore.find("ID", record.get("ID"));
								localDeveloperStore.removeAt(index);
							}
						}

						if (localDeveloperStore)
						{
							localDeveloperStore.add(widget);
							localDeveloperStore.sync();
						}
						componentStore.add(widget);
						componentStore.sync();

						Ext.Msg.alert("Status", "Widget succesfully created");
					}
					else
					{
						Ext.Msg.show(
						{
							title: "Error",
							msg: result.messages.join('<br/>'),
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
				}
			},
			closeAndCleanup: function()
			{
				$(window).unbind("message", Ext.app.ComponentEditor.gadgetWindow.processGadgetSubmit);
				Ext.app.ComponentEditor.gadgetWindow.close();
				Ext.app.ComponentEditor.gadgetWindow = null;
			},
			items:
			[
				{
					xtype: 'form',
					layout: 'fit',
					standardSubmit: true,
					url: validateWidgetUrl,
					items:
					[
						{
							xtype: 'textarea',
							hideLabel: true,
							style: 'width:100%;',
							height: 350,
							name: 'widgetXml'
						}
					]
				},
				{
					xtype: 'container',
					width: 0,
					height: 0,
					html: '<iframe id="widgetSumbitFrame" name="widgetSumbitFrame"></iframe>'
				}
			],
			buttons:
			[
				{
					text: 'Validate & Add',
					handler: function ()
					{
						$(window).bind("message", Ext.app.ComponentEditor.gadgetWindow.processGadgetSubmit);
						this.up().up().down('form').submit({ target: 'widgetSumbitFrame' });
					}
				},
				{
					text: 'Cancel',
					handler: function ()
					{
						Ext.app.ComponentEditor.gadgetWindow.closeAndCleanup();
					}
				}
			]
		});
		window.gadgetWindow.show();
	};
	mediator.on("componentCreate", createOrEditGadget);
	mediator.on("componentModify", createOrEditGadget);

	var componentRemove = function (record)
	{

	};
	mediator.on("componentRemove", componentRemove);

	this.destroy = function ()
	{
		mediator.un("componentCreate", componentCreate);
		mediator.un("componentModify", createOrEditGadget);
		mediator.on("componentRemove", componentRemove);
		if (Ext.app.ComponentEditor.gadgetWindow)
		{
			Ext.app.ComponentEditor.gadgetWindow.close();
			$(window).unbind("message", Ext.app.ComponentEditor.gadgetWindow.processGadgetSubmit);
			Ext.app.ComponentEditor.gadgetWindow = null;
		}
	};
};