var conf;

module.exports =
{
	"methods":
	{
		"lads": function(msg, sender, api)
		{
			if (("&#").indexOf(api.dest.substr(0,1)) === -1)
			{
				api.randomMessage("private");
			}
			else
			{
				var str = "";

				var i;
				for (i in api.getNames())
				{
					if (i !== api.conf.nick && i !== sender)
						str += i+" ";
				}

				api.say(str);
			}
		}
	}
}
