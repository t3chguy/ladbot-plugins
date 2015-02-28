module.exports =
{
	"methods":
	{
		"urban": function(msg, sender, api)
		{
			var word = msg.match(/\".+\"/)[0];
			word = word.substring(1, word.length-1);

			var base = "http://api.urbandictionary.com/v0/define";
			var options = "?term="+encodeURIComponent(word);

			api.request(base+options, function(err, res, body)
			{
				var defs = JSON.parse(body);

				if (defs.result_type === "no_results")
				{
					api.randomMessage("nodefs", {"word": word});
				}
				else
				{
					api.say(defs.list[0].definition);
				}
			});
		}
	}
}
