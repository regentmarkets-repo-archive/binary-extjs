using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;

namespace Binary.OAuthProxy.Controllers
{
	public class AssetIndex
	{
		public string Language { get; set; }
		public string Market { get; set; }
		public string IndexHTML { get; set; }

		static readonly string AssetIndexKey = "AssetIndex";
		public static AssetIndex GetIndex(string language, string market, string[] markets)
		{
			lock (typeof(AssetIndex))
			{
				var session = HttpContext.Current.Session;
				if (session[AssetIndexKey] == null)
				{
					session[AssetIndexKey] = new Dictionary<string, List<AssetIndex>>();
				}

				var indexes = session[AssetIndexKey] as Dictionary<string, List<AssetIndex>>;
				if (!indexes.ContainsKey(language))
				{
					List<AssetIndex> indexesForLanguage = new List<AssetIndex>();
					indexes.Add(language, indexesForLanguage);
					//string markup = HttpHelpers.GetWebResponse();
					var web = new HtmlWeb();
					HtmlDocument document = web.Load("https://www.binary.com/c/asset_index.cgi?l=" + language);
					foreach (string marketLookup in markets)
					{
						HtmlNode node = document.DocumentNode.SelectSingleNode("//*[@id='asset-" + marketLookup + "']");
						if (node != null)
						{
							indexesForLanguage.Add(new AssetIndex
							{
								IndexHTML = node.InnerHtml,
								Language = language,
								Market = marketLookup
							});
						}
					}
				}
				return indexes[language].First(i => i.Market == market);
			}
		}
	}
}
