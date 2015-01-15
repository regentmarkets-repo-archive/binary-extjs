using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;

namespace Binary.OAuthProxy.Controllers
{
	public class ResouceModel
	{
		public string Market { get; set; }
		public string IndexHTML { get; set; }
		public DateTime Date { get; set; }

		static readonly string AssetIndexKey = "AssetIndex";
		static readonly string TradingTimesKey = "TradingTimes";
		static readonly string PricingTableKey = "PricingTable";
		static readonly string RiseFallKey = "RiseFall";
		static Dictionary<string, List<ResouceModel>> GetIndexes(string key)
		{
			var session = HttpContext.Current.Session;
			if (session[key] == null)
			{
				session[key] = new Dictionary<string, List<ResouceModel>>();
			}

			return session[key] as Dictionary<string, List<ResouceModel>>;
		}

		static List<ResouceModel> GetResource(string url, string selectorFormat, string[] markets)
		{
			List<ResouceModel> indexesForLanguage = new List<ResouceModel>();
			//string markup = HttpHelpers.GetWebResponse();
			var web = new HtmlWeb();
			HtmlDocument document = web.Load(url);
			foreach (string marketLookup in markets)
			{
				HtmlNode node = document.DocumentNode.SelectSingleNode(string.Format(selectorFormat, marketLookup));
				if (node != null)
				{
					indexesForLanguage.Add(new ResouceModel
					{
						IndexHTML = node.InnerHtml,
						Market = marketLookup
					});
				}
			}
			return indexesForLanguage;
		}

		public static ResouceModel GetAssetIndex(string language, string market, string[] markets)
		{
			lock (typeof(ResouceModel))
			{
				Dictionary<string, List<ResouceModel>> indexes = GetIndexes(AssetIndexKey);
				if (!indexes.ContainsKey(language))
				{
					List<ResouceModel> indexesForLanguage = GetResource(
						string.Format("https://www.binary.com/c/asset_index.cgi?l={0}", language),
						"//*[@id='asset-{0}']",
						markets);
					indexes.Add(language, indexesForLanguage);
				}
				return indexes[language].First(i => i.Market == market);
			}
		}

		public static ResouceModel GetTradingTimes(string language, string market, string[] markets, DateTime date)
		{
			List<ResouceModel> indexesForLanguage = GetResource(
				string.Format("https://www.binary.com/c/trading_times.cgi?l={0}&date={1}", language, date.ToString("yyyy-mm-dd")),
				"//*[@id='tradingtimes-{0}']",
				markets);
			return indexesForLanguage.First(i => i.Market == market);
			/*
			lock (typeof(ResouceModel))
			{
				Dictionary<string, List<ResouceModel>> indexes = GetIndexes(TradingTimesKey);
				bool hasLanguage = indexes.ContainsKey(language);
				if (!hasLanguage || indexes[language].Any(r => r.Date.Date == date.Date))
				{
					List<ResouceModel> indexesForLanguage = GetResource(
						string.Format("https://www.binary.com/c/trading_times.cgi?l={0}&date={1}", language, date.ToString("YYYY-mm-dd")),
						"//*[@id='tradingtimes-{0}']",
						markets);
					indexesForLanguage.ForEach(i => i.Date = date);
					if (hasLanguage)
					{
						indexes[language].AddRange(indexesForLanguage);
					}
					else
					{
						indexes.Add(language, indexesForLanguage);
					}
				}
				return indexes[language].First(i => i.Market == market && i.Date.Date == date.Date);
			}
			 */
		}

		public static ResouceModel GetPricingTable(string language,
			string bet_type, string underlying, string currency, string low_strike,
			string strike_step, string strike_type, string from_strike, string expiry_step,
			string from_expiry, string action)
		{
			string url = string.Format(
				"https://www.binary.com/d/pricing_table.cgi?bet_type={0}&underlying={1}&currency={2}&low_strike={3}&strike_step={4}&strike_type={5}&from_strike={6}&expiry_step={7}&from_expiry={8}&action={9}&l={10}",
				bet_type,
				underlying,
				currency,
				low_strike,
				strike_step,
				strike_type,
				from_strike,
				expiry_step,
				from_expiry,
				action = "price",
				language);
			//pricing_table_prices_div
			var web = new HtmlWeb();
			HtmlDocument document = web.Load(url);
			HtmlNode node = document.DocumentNode.SelectSingleNode("//*[@id='pricing_table_prices_div']");
			string result = "";
			if (node == null)
			{
				node = document.DocumentNode.SelectSingleNode("//*[@id='client_message']");
				result = "<div id=\"client_message\" class=\"rbox errorbox\" style=\"height: 60px; padding-top: 30px;\">" + node.InnerHtml + "</div>";
			}
			else result = node.InnerHtml;
			return new ResouceModel
			{
				IndexHTML = result
			};
		}

		public static ResouceModel GetRiseFall(string language,
			string date_start, string duration_amount, string duration_units, string currency,
			string table_action)
		{
			string url = string.Format(
				"https://www.binary.com/d/rise_fall_table.cgi?date_start={0}&duration_amount={1}&duration_units={2}&currency={3}&table_action={4}&l={5}",
				date_start,
				duration_amount,
				duration_units,
				currency,
				table_action = "price",
				language);
			//pricing_table_prices_div
			var web = new HtmlWeb();
			HtmlDocument document = web.Load(url);
			HtmlNode node = document.DocumentNode.SelectSingleNode("//*[@id='rise_fall_prices_div']");
			string result = "";
			if (node == null)
			{
				node = document.DocumentNode.SelectSingleNode("//*[@id='client_message']");
				result = "<div id=\"client_message\" class=\"rbox errorbox\" style=\"height: 60px; padding-top: 30px;\">" + node.InnerHtml + "</div>";
			}
			else result = node.InnerHtml;
			return new ResouceModel
			{
				IndexHTML = result
			};
		}
	}
}
