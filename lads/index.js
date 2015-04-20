var conf;

module.exports =
{
	"methods":
	{
		"lads": function(msg, sender, api, chan)
		{
			if (chan === 0) {
				api.say("This is a Private Conversation. No Pervs Here.");
			} else {
				var names = api.getNames(chan);
				var str = "";

				var i;
				for (i in names)
				{
					if (i !== api.conf.nick && i !== sender)
						str += i+" ";
				}

				api.say(str);
			}
		}
	}
}
