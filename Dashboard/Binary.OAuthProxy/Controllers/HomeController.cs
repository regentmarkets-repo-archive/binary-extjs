using System;
using System.IO;
using System.Net;
using System.Web.Mvc;

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

            var wr = HttpWebRequest.Create(url) as HttpWebRequest;

            wr.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            wr.Headers.Add("Authorization", "Bearer " + token);
            wr.ContentType = "application/x-www-form-urlencoded";
            wr.Method = "GET";

			string result = string.Format(HomeController.ResponseTemplate, "Server error occured", 401);
			try
			{
				HttpWebResponse response = wr.GetResponse() as HttpWebResponse;
				result = new StreamReader(response.GetResponseStream()).ReadToEnd();
			}
			catch (WebException ex)
			{
				HttpWebResponse response = ex.Response as HttpWebResponse;
				result = string.Format(HomeController.ResponseTemplate, ex.Message, (int)response.StatusCode);
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
    }
}
