var http = require("http");

module.exports =
{
	"methods":
	{
		"shorten": function(msg, sender, api)
		{
			var url = msg.split(/\s+/)[0];

			//don't shorten short links
			if (url.length < 25)
				return;

			api.request("http://xeo.la/url/?url="+url.split("#")[0], function(err, res, body)
			{
				if (err) throw err;

				api.say(body.split(/\n/)[0]);
			});
		}
	}
}
