var users;
var modifyTimeouts = {};

module.exports =
{
	"methods":
	{
		"prefix": function(msg, sender, api)
		{
			var command = msg.replace(/ladpoints(.+)?/i, "");
			var rest = msg.replace(/.+ladpoints\s+/i, "");
			var tokens = rest.split(/\s/i);
			var nick = tokens[0];

			api.lookup(nick, function(account)
			{
				ladCommands(command, nick, account, sender, api);
			});
		}
	},

	"init": function(api)
	{
		try {
			users = JSON.parse(api.readFileSync("users.json"));
		}
		catch (e)
		{
			users = {};
		}

		//build list of currently online people
		api.on("names", function(channel, names)
		{
			var i;
			for (i in names)
			{
				api.lookup(i, function(account)
				{
					if (account !== undefined || users[account] === undefined)
						users[account] = 0;
				});
			}
		});

		//handle new joins
		api.on("join", function(channel, name)
		{
			api.lookup(name, function(account)
			{
				if (account !== undefined || users[account] === undefined)
					users[account] = 0;
			});
		});
	}
}

function ladCommands(command, nick, account, sender,  api)
{
	if (account)
	{
		switch (command)
		{
		case "?":
			api.randomMessage("points",
			{
				"nick": nick,
				"points": (users[account] || 0)
			});
			break;
		case "++":
			modifyPointCount("goodLad", nick, account, sender, 1, api);
			break;
		case "--":
			modifyPointCount("badLad", nick, account, sender, -1, api);
		}
	}
	else
	{
		api.randomMessage("unknownLad",
		{
			"nick": nick
		});
	}
}

function modifyPointCount(operation, nick, account, sender, amount, api)
{
	if (modifyTimeouts[sender] && modifyTimeouts[sender].indexOf(nick) !== -1)
	{
		api.randomMessage(operation+"CantModify",
		{
			"nick": nick,
			"sender": sender
		});
	}
	else if (nick !== sender)
	{
		if (users[account] === undefined)
			users[account] = 0;

		users[account] += amount;

		api.randomMessage(operation,
		{
			"nick": nick,
			"sender": sender
		});
		writeUsers(api);

		if (modifyTimeouts[sender] === undefined)
			modifyTimeouts[sender] = [];

		modifyTimeouts[sender].push(nick);
		setTimeout(function()
		{
			var i = modifyTimeouts[sender].indexOf(nick);
			if (i !== -1)
				modifyTimeouts[sender].splice(i, 1);
		}, 60*1000);
	}
	else
	{
		api.randomMessage("modifySelf",
		{
			"nick": nick
		});
	}
}

function writeUsers(api)
{
	api.writeFile("users.json",
	              JSON.stringify(users));
}
