var configured_livechart = false;
var configure_livechart = function ()
{
	var text = {};
	text.localize = function (param)
	{
		return param;
	};// TODO : replace this mock method with localization

	if (!configured_livechart)
	{
		Highcharts.setOptions(
		{
			lang: {
				loading: text.localize('loading...'),
				printChart: text.localize('Print chart'),
				downloadJPEG: text.localize('Save as JPEG'),
				downloadPNG: text.localize('Save as PNG'),
				downloadSVG: text.localize('Save as SVG'),
				downloadPDF: text.localize('Save as PDF'),
				downloadCSV: text.localize('Save as CSV'),
				rangeSelectorFrom: text.localize('From'),
				rangeSelectorTo: text.localize('To'),
				rangeSelectorZoom: text.localize('Zoom'),
				months: [
					text.localize('January'), text.localize('February'), text.localize('March'), text.localize('April'), text.localize('May'), text.localize('June'),
					text.localize('July'), text.localize('August'), text.localize('September'), text.localize('October'), text.localize('November'), text.localize('December')
				],
				shortMonths: [
					text.localize('Jan'), text.localize('Feb'), text.localize('Mar'), text.localize('Apr'), text.localize('May'), text.localize('Jun'),
					text.localize('Jul'), text.localize('Aug'), text.localize('Sep'), text.localize('Oct'), text.localize('Nov'), text.localize('Dec')
				],
				weekdays: [
					text.localize('Sunday'), text.localize('Monday'), text.localize('Tuesday'), text.localize('Wednesday'),
					text.localize('Thursday'), text.localize('Friday'), text.localize('Saturday')
				],
			},
			navigator:
			{
				series:
				{
					includeInCSVExport: false
				}
			}
		});
	}
	configured_livechart = true;
};