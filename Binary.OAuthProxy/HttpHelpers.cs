using System;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace Binary
{
    public static class HttpHelpers
    {
        public static void WritePOSTBody(this HttpWebRequest request, string postData)
        {
            request.Method = "POST";
            // Set the content type of the data being posted.
            request.ContentType = "application/x-www-form-urlencoded";

            var encoding = new ASCIIEncoding();
            var bodyData = encoding.GetBytes(postData);

            // Set the content length of the string being posted.
            request.ContentLength = bodyData.Length;

            request.GetRequestStream().Write(bodyData, 0, bodyData.Length);
        }

        public static string GetSHA1Hash(string value)
        {
            var sha1 = new SHA1Managed();
            var hash = sha1.ComputeHash(new ASCIIEncoding().GetBytes(value));
            var sha1Result = BitConverter.ToString(hash).Replace("-", String.Empty);

            return sha1Result;
        }

        public static string GetSHA256Hash(string value)
        {
            var sha = new SHA256Managed();
            var hash = sha.ComputeHash(new ASCIIEncoding().GetBytes(value));
            var result = BitConverter.ToString(hash).Replace("-", String.Empty);

            return result;
        }

        public static string GetMD5Hash(string value)
        {
            var md5 = MD5.Create();
            var hash = md5.ComputeHash(new ASCIIEncoding().GetBytes(value));
            var result = BitConverter.ToString(hash).Replace("-", String.Empty);

            return result;
        }

        public static string GetHMACSHA256Hash(string value, string key)
        {
            if (String.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }

            var encoding = Encoding.UTF8;
            var hsha256 = new HMACSHA256(encoding.GetBytes(key));
            var hash = hsha256.ComputeHash(encoding.GetBytes(value));
            //var sha256Result = BitConverter.ToString(hash);
            var sha256Result = Convert.ToBase64String(hash);

            return sha256Result;
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            return Convert.ToBase64String(plainTextBytes);
        }

		public static string GetWebResponse(string url)
		{
			var wr = HttpWebRequest.Create(url) as HttpWebRequest;
			string result = string.Empty;
			try
			{
				var response = wr.GetResponse() as HttpWebResponse;
				result = new StreamReader(response.GetResponseStream()).ReadToEnd();
			}
			catch
			{
			}
			return result;
		}

        public static string GetPostResponse(string url, string data)
        {
            var wr = HttpWebRequest.Create(url) as HttpWebRequest;

            wr.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            wr.Headers.Add("Authorization", "Basic " + Base64Encode("gA6I9xiRgtW4xHBVK4sJ3T8aOomm99Pk" + ":" + "CR4zFn9ED8GlvAZi"));
            wr.ContentType = "application/x-www-form-urlencoded";
            wr.WritePOSTBody(data);

            try
            {
                var response = wr.GetResponse() as HttpWebResponse;
                var responseStream = response.GetResponseStream();
                var responseReader = new StreamReader(responseStream);
                var responseResult = responseReader.ReadToEnd();

                return responseResult;
            }
            catch (Exception)
            {
                //VB: WTF???
            }

            return string.Empty;
        }


        public static T XmlDeserialize<T>(string xml) where T : class
        {
            var result = null as T;
            var serializer = new XmlSerializer(typeof(T));

            using (var reader = new StringReader(xml))
            {
                result = serializer.Deserialize(reader) as T;
            }

            return result;
        }

        public static string XmlSerialize(object toSerialize)
        {
            var result = null as string;
            var serializer = new XmlSerializer(toSerialize.GetType());
            var settings = new XmlWriterSettings
            {
                Encoding = new UnicodeEncoding(false, false),
                Indent = true,
                OmitXmlDeclaration = true,
            };

            var serializerNamespaces = new XmlSerializerNamespaces();
            serializerNamespaces.Add(String.Empty, String.Empty);

            using (var textWriter = new StringWriter())
            {
                using (var xmlWriter = XmlWriter.Create(textWriter, settings))
                {
                    serializer.Serialize(xmlWriter, toSerialize, serializerNamespaces);
                }

                result = textWriter.ToString();
            }

            return result;
        }

        public static string IfEmpty(this string value, string anotherValue)
        {
            return string.IsNullOrWhiteSpace(value) ? anotherValue : value;
        }

        public static T ToEnum<T>(this string value) where T : struct
        {
            T result;

            if (!Enum.TryParse<T>(value, true, out result))
            {
                result = default(T);
            }

            return result;
        }
    }
}
