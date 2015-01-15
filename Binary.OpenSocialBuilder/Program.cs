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
			List<string> lines=File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "features.txt")).ToList();
			string osPath = lines.First(l => l.StartsWith("ospath", StringComparison.InvariantCultureIgnoreCase)).Split('=')[1];
			List<Feature> features = new List<Feature>();
			foreach(string line in lines)
			{
				if (line.StartsWith("feature", StringComparison.InvariantCultureIgnoreCase))
				{
					AddDependencies(osPath, line.Split('=')[1], features, 100);
				}
			}

			List<string> scriptKeys = new List<string>();
			StringBuilder resultScript = new StringBuilder();
			foreach (Feature feature in features.OrderBy(f=>f.Order))
			{
				foreach(Script script in feature.GetGadgetDetails().Scripts)
				{
					string key=feature.Name + ":" + script.Src;
					if (!scriptKeys.Contains(key))
					{
						resultScript.AppendLine();
						resultScript.AppendLine();
						resultScript.AppendLine("/* =============================== " + script.Src + " ============================= */");
						resultScript.AppendLine();
						resultScript.AppendLine(script.Content);
						resultScript.AppendLine();
						scriptKeys.Add(key);
					}
				}
				
				//Message("Feature: {0} ({1})", feature.Name, feature.Order);
			}

			string targetFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "os.js");
			File.WriteAllText(targetFile, resultScript.ToString());
			Console.WriteLine();
			Console.WriteLine();
			Message("Processed to: {0}", targetFile);
			
			Console.ReadKey();
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

		static void AddDependencies(string osPath, string featureName, List<Feature> features, int order)
		{
			string featureDir = Path.Combine(osPath, featureName);
			string featureFile = Path.Combine(featureDir, "feature.xml");
			Message("Processing feature {0}", featureName);
			if (File.Exists(featureFile))
			{
				Feature feature = XmlDeserialize<Feature>(File.ReadAllText(featureFile));
				feature.Order = order;
				features.Add(feature);
				foreach (Script script in feature.GetGadgetDetails().Scripts)
				{
					script.Content = File.ReadAllText(Path.Combine(featureDir, script.Src));
				}
				foreach (string dependency in feature.Dependencies)
				{
					Feature existing = features.FirstOrDefault(f => f.Name == dependency);
					if (existing!=null)
					{
						if (existing.Order >= order)
						{
							existing.Order = order - 1;
						}
					}
					else
					{
						AddDependencies(osPath, dependency, features, order - 1);
					}
				}
			}
			else
			{
				Error("Feature file does not exists: {0}", featureFile);
			}
		}

		static void Error(string message, params object[] args)
		{
			Log(message, ConsoleColor.Red, args);
		}

		static void Message(string message, params object[] args)
		{
			Log(message, Console.ForegroundColor, args);
		}

		static void Log(string message, ConsoleColor color, params object[] args)
		{
			ConsoleColor oldColor = Console.ForegroundColor;
			Console.ForegroundColor = color;
			Console.WriteLine(message, args);
			Console.ForegroundColor = oldColor;
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

		public int Order { get; set; }
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
