fs = require("fs");
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
		console.log("About to define Logger");
//console.log("Export:", api.irc._client.on.toString() == api.on.toString());
		var i, chan, fso = {};
		for (i in api.conf.options.channels)
		{
			chan = api.conf.options.channels[i];
			fso[chan] = fs.createWriteStream(chan + ".log", { flags: "a" });
		};
		api.irc._client.on('message#', function(from, to, msg)
		{
			logger(fso[to], " <" + from + "> " + msg);
		});
		api.irc._client.on('selfMessage', function(to, msg)
		{
			setTimeout(function()
			{
				logger(fso[to], " <" + this.nick + "> " + msg);
			}.bind(this), 1);
		});
		api.irc._client.on('topic', function(to, topic, nick)
		{
			logger(fso[to], " Topic: " + topic + " set by " + nick);
		});
		api.irc._client.on('join', function(to, nick)
		{
			logger(fso[to], nick + " has Joined " + to);
		});
		api.irc._client.on('part', function(to, nick, reason)
		{
			logger(fso[to], nick + " has Parted " + to + " (" + (reason || "Unspecified") + ")")
		});
		//api.irc._client.on('quit', function(nick, reason, channels)
		//{
		//	logger(fso[])
		//});
		api.irc._client.on('kick', function(to, nick, by, reason)
		{
			logger(fso[to], nick + " has been kicked by " + by + " for " + reason);
		});
	}
}

function logger(file, message)
{
	file.write(Date.now() + " " + message + "\n");
}