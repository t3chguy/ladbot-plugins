var lastMessages = {};

module.exports =
{
	"methods":
	{
		"register": function(msg, sender, api)
		{
			if (!msg.match(/^s\/.+\/.+$/))
				lastMessages[sender] = msg;
		},

		"replace": function(msg, sender, api)
		{
			var parts = msg.split("/");
			var regex = new RegExp(parts[1], parts[3]);
			var sub = parts[2];
			var result = lastMessages[sender].replace(regex, sub);
			api.say("* "+result+" - "+sender);
		}
	}
}
