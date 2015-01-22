//Using ScriptCS

using System.Yaml.Serialization;	//https://yamlserializer.codeplex.com/
using System.IO;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.SelfHost;
using System.Web.Http.Dispatcher;

public class ControllerResolver : DefaultHttpControllerTypeResolver
{
    public override ICollection<Type> GetControllerTypes(IAssembliesResolver assembliesResolver)
    {
        return Assembly.GetExecutingAssembly().GetTypes()
            .Where(x => typeof(System.Web.Http.Controllers.IHttpController).IsAssignableFrom(x)).ToList();
    }
}

public class TestController : ApiController
{
    public string POST(int start, int count, string filter, int sortColumn, bool ascending)
    {
        //get data
         var text = File.ReadAllText("testRead.yaml");
         var serializer = new YamlSerializer();
         var table = serializer.Deserialize(text);

        //filter data
        var result = table.ToList();
        if (!string.IsNullOrEpmty(filter)) {
        	result = new List<string[]>();
        	var filters = filter.Split(' ');
	        foreach (var row in table) {
	        	foreach (var field in row) {
	        		var found = false;
	        		foreach(var search in filters) {
	        			if (field.Contains(search)) {
	        				result.Add(row);
	        				found = true;
	        				break;
	        			}
	        		}
	        		if (found) {
	        			break;
	        		}
	        	}
	        }
	    }

        //sort data
        if (sortColumn > -1) {
        	results.Sort((a, b) => a[sortColumn].CompareTo(b[sortColumn]));
        	if (!ascending) {
        		results = results.Reverse();
        	}
        }

        //return data
        var serializer = new JavascriptSerializer();
        return serializer.Serialize(new {
        	rows = results.ToArray(),
        	includedRowCount = results.Length,
        	rowCount = data.Length
        });
    }
}

var config = new HttpSelfHostConfiguration(new Uri("http://localhost:8080"));
config.Services.Replace(typeof(IHttpControllerTypeResolver), new ControllerResolver());
config.Routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}");

new HttpSelfHostServer(config).OpenAsync().Wait();
Console.WriteLine("Listening...");
Console.ReadKey();