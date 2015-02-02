var args = {};
var forReg = /(yes|true|truth)/i;
var againstReg = /(no|false|lies)/i;

function send(api, stance)
{
	setTimeout(function()
	{
		api.randomMessage(stance);
	}, 1000*2);
}

module.exports =
{
	"methods":
	{
		"start": function(msg, sender, api)
		{
			var name = msg.replace(/argue\s+/, "").replace(/\s+.+/, "");
			var stance = msg.replace(/argue\s+[^\s]+\s+/, "").trim();

			api.randomMessage(stance+"Argue",
			{
				"nick": name
			});

			args[name] = stance;

			setTimeout(function()
			{
				delete args[name];
			}, 1000*60*10);
		},

		"argue": function(msg, sender, api)
		{
			if (args[sender] === "for" && msg.match(againstReg))
				send(api, "for");
			else if (args[sender] === "against" && msg.match(forReg))
				send(api, "against");
		},

		"stop": function(msg, sender, api)
		{
			var name = msg.replace(/argue\s+/, "").replace(/\s+.+/, "");

			delete args[name];
		}
	}
}
