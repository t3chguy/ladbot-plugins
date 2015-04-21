var conf;

module.exports =
{
	"methods":
	{
		"lads": function(msg, sender, api, chan)
		{
			if (typeof chan === 'undefined')
			{
				api.randomMessage("private");
			}
			else
			{
				var str = "";

				var i;
				for (i in api.getNames(chan))
				{
					if (i !== api.conf.nick && i !== sender)
						str += i+" ";
				}

				api.say(str);
			}
		}
	}
}
