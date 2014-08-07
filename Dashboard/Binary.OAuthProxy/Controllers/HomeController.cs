using Binary.Models;
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

        public string APICall(string method, string token, string callback)
        {
            string url = "http://rmg-prod.apigee.net/v1/binary" + method;

            var wr = HttpWebRequest.Create(url) as HttpWebRequest;

            wr.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            wr.Headers.Add("Authorization", "Bearer " + token);
            wr.ContentType = "application/x-www-form-urlencoded";
            wr.Method = "GET";

            //wr.WritePOSTBody(string.Empty);

            var response = wr.GetResponse() as HttpWebResponse;
            var result = new StreamReader(response.GetResponseStream()).ReadToEnd();

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
            //Response.ContentType = "application/x-www-form-urlencoded";
            var model = new oauth2CodeCallbackModel
            {
                Res = authResult
            };

            return View(model);
        }
    }
}
