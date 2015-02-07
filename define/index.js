module.exports =
{
	"methods":
	{
		"define": function(msg, sender, api)
		{
			var word = msg.match(/\".+\"/)[0];
			word = word.substring(1, word.length-1);

			var base = "http://api.wordnik.com:80/v4/word.json/"+encodeURIComponent(word)+"/definitions";
			var options = "?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

			api.request(base+options, function(err, res, body)
			{
				var def = JSON.parse(body);

				if (def.length > 0)
				{
					api.say(def[0].text);
				}
				else
				{
					api.randomMessage("nodefs", {"word": word});
				}
			});
		}
	}
}
