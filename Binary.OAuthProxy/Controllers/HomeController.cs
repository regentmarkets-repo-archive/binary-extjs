using Ext.Dashboard;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Binary.OAuthProxy.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return View();
        }

		static readonly string ResponseTemplate = "{{ message: '{0}', code: {1} }}";
        public string APICall(string method, string token, string callback)
        {
            string url = "http://rmg-prod.apigee.net/v1/binary" + method;
			string requestMethod="GET";
			if (method.IndexOf("callType=buy")>0)
			{
				requestMethod="POST";
			}
            var wr = HttpWebRequest.Create(url) as HttpWebRequest;

            wr.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            wr.Headers.Add("Authorization", "Bearer " + token);
            wr.ContentType = "application/x-www-form-urlencoded";
			wr.ContentLength = 0;
            wr.Method = requestMethod;

			string result = string.Format(HomeController.ResponseTemplate, "Server error occured", 401);
			try
			{
				HttpWebResponse response = wr.GetResponse() as HttpWebResponse;
				result = new StreamReader(response.GetResponseStream()).ReadToEnd();
			}
			catch (WebException ex)
			{
				HttpWebResponse response = ex.Response as HttpWebResponse;
				result = string.Format(HomeController.ResponseTemplate, ex.Message, response == null ? 500 : (int)response.StatusCode);
			}

            return string.Format("{0}({1})", callback, result);
        }

        public ActionResult oauth2CodeCallback()
        {
            //Response.Headers.Add("Authorization", "Basic " + Base64Encode("gA6I9xiRgtW4xHBVK4sJ3T8aOomm99Pk" + ":" + "CR4zFn9ED8GlvAZi"));

            var authType = Request.QueryString["state"];
            var authResult = String.Empty;

            if (authType == "authcodeflow")
            {
                Response.AddHeader("Authorization", "Basic " + HttpHelpers.Base64Encode("gA6I9xiRgtW4xHBVK4sJ3T8aOomm99Pk" + ":" + "CR4zFn9ED8GlvAZi"));

                var data = "code=" + Request.QueryString["code"] +
                        "&scope=" + Request.QueryString["scope"] +
                    //"&redirect_uri=http://localhost:38139/ready" +
                        "&grant_type=authorization_code";

                authResult = HttpHelpers.GetPostResponse("http://rmg-prod.apigee.net/v1/binary/oauth/accesstoken_authcode", data);
            }

			return View((object)authResult);
        }

		public ActionResult AssetIndex(string language, string market, string[] markets)
		{
			return View(Controllers.ResouceModel.GetAssetIndex(language, market, markets));
		}
		public ActionResult TradingTimes(string language, string market, string[] markets, DateTime? date)
		{
			return View(Controllers.ResouceModel.GetTradingTimes(language, market, markets, date ?? DateTime.Now));
		}

		public ActionResult RiseFall(string language,
			string date_start, string duration_amount, string duration_units, string currency,
			string table_action)
		{
			return View(Controllers.ResouceModel.GetRiseFall(language,
				date_start,
				duration_amount,
				duration_units,
				currency,
				table_action));
		}

		public ActionResult PricingTable(string language,
			string bet_type, string underlying, string currency, string low_strike,
			string strike_step, string strike_type, string from_strike, string expiry_step,
			string from_expiry, string action)
		{
			return View(Controllers.ResouceModel.GetPricingTable(language,
				bet_type, underlying, currency, low_strike, strike_step, strike_type, from_strike, expiry_step, from_expiry, action));
		}

		[ValidateInput(false)]
		public string ValidateWidget(string widgetXml)
		{
			GadgetModel model = new GadgetModel();
			bool validationResult=true;
			List<string> messages=new List<string>();
			try
			{
				validationResult = GadgetModel.Validate(widgetXml, messages);
				if (validationResult)
				{
					model = HttpHelpers.XmlDeserialize<GadgetModel>(widgetXml);
				}
			}
			catch (Exception ex)
			{
				validationResult = false;
				messages.Add(ex.Message);
			}

			return string.Format(
				@"<body><script>
				var message=JSON.stringify({0});
				top.postMessage('BinaryApiCall' + message, '*');
				</script></body>",
				new JavaScriptSerializer().Serialize(new
				{
					ID = Guid.NewGuid(),
					widget = model,
					manifest = widgetXml,
					validationResult = validationResult,
					messages = messages
				}));
		}
	}
}
