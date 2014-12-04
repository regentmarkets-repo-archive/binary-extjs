using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace Binary.OpenSocialBuilder
{
	class Program
	{
		static void Main(string[] args)
		{
			//Dictionary<string, string> arguments = args.ToDictionary(a => a.Split('=')[0], v => v.Split('=')[1]);
			List<string> lines=File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "files.txt")).ToList();
			string osPath = lines.First(l => l.StartsWith("ospath", StringComparison.InvariantCultureIgnoreCase)).Split('=')[1];
			List<Feature> files = new List<Feature>();
			foreach(string line in lines)
			{
				if (line.StartsWith("file", StringComparison.InvariantCultureIgnoreCase))
				{
					AddDependencies(osPath, line.Split('=')[1], files);
				}
			}
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

		static void AddDependencies(string osPath, string file, List<Feature> files)
		{
			string featureDir = Path.Combine(osPath, Path.GetDirectoryName(file));
			string featureFile = Path.Combine(featureDir, "feature.xml");
			Feature feature = XmlDeserialize<Feature>(File.ReadAllText(featureFile));
			foreach (Script script in feature.GetGadgetDetails().Scripts)
			{
				script.Content = File.ReadAllText(Path.Combine(featureDir, script.Src));
			}
		}
	}

	[XmlRoot("feature")]
	public class Feature
	{
		[XmlElement("name")]
		public string Name { get; set; }

		[XmlElement("dependency")]
		public List<string> Dependencies { get; set; }

		[XmlElement("gadget")]
		public Gadget Gadget { get; set; }

		[XmlElement("all")]
		public Gadget All { get; set; }

		public Gadget GetGadgetDetails()
		{
			return this.Gadget ?? this.All;
		}
	}

	public class Dependency
	{
		[XmlText]
		public string Name { get; set; }
	}

	public class Gadget
	{
		[XmlElement("script")]
		public List<Script> Scripts { get; set; }
	}

	public class Script
	{
		[XmlAttribute("src")]
		public string Src { get; set; }

		public string Content { get; set; }
	}
}
