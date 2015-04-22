module.exports =
{
	"init": function(api)
	{
		require("http").createServer(function(request, response)
		{

			var dest = require("url").parse(request.url).pathname.substring(1).split("/");
			dest = [dest.shift(), dest.join("/")];
			if (dest[0] === "favicon.ico")
			{
				response.writeHeader(200, {"Content-Type": "image/x-icon"});
				response.write(api.readFileSync("favicon.ico"));
			}
			else if (dest[0] === "")
			{
				response.writeHeader(200, {"Content-Type": "text/html"});
				response.write(api.readFileSync("index.html"));
			}
			else
			{
				response.writeHeader(200, {"Content-Type": "text/plain"});
				if (dest[1] === "")
				{
					response.write("Missing Text");
				}
				else if (api.conf.httpreq.indexOf(request.connection.remoteAddress) === -1)
				{
					console.log(request.connection.remoteAddress, "Rejected");
					response.write("Not Whitelisted");
				}
				else
				{
					response.write("OK");
					api.irc.say(unescape(dest[1]), dest[0].replace("!", "#"));
				}
			}
			response.end();
		}).listen(api.conf.httpport);
	}
}