module.exports =
{
	"methods":
	{
		"define": function(msg, sender, api)
		{
			var word = msg.match(/\".+\"/)[0];
			word = word.substring(1, word.length-1);

			var base = "http://api.wordnik.com:80/v4/word.json/"+encodeURIComponent(word)+"/definitions";
			var options = "?limit=200&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

			api.request(base+options, function(err, res, body)
			{
				var defs = JSON.parse(body);

				if (defs.length > 0)
				{
					var def;
					for (def in defs)
					{
						var use = true;
						
						var label;
						for (label in defs[def].labels)
						{
							if (defs[def].labels[label].text === "obsolete")
								use = false;
						}
						if (use)
						{
							api.say(defs[def].text);
							return;
						}
					}
					api.say(defs[0].text);
				}
				else
				{
					api.randomMessage("nodefs", {"word": word});
				}
			});
		}
	}
}
