var Cleverbot = require("./libs/cleverbot-node");

var bot = new Cleverbot;

module.exports =
{
	"methods":
	{
		"chat": function(msg, sender, api)
		{
			if (msg.toLowerCase().indexOf(api.conf.nick.toLowerCase()) == 0)
			{
				bot.write(msg.substring(api.conf.nick.length+1), function(resp)
				{
					api.say(sender+": "+resp.message);
				});
			}
		}
	}
}
