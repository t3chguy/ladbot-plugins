module.exports =
{
	"methods":
	{
		"define": function(msg, sender, api)
		{
			var word = msg.match(/\".+\"/)[0];
			word = word.substring(1, word.length-1);

			var base = "http://thesaurus.altervista.org/thesaurus/v1";
			var options = "?output=json&language=en_US&key=7wgHKQcnJlRt2GQfcE5T&word="+encodeURIComponent(word);

			api.request(base+options, function(err, res, body)
			{
				var defs = JSON.parse(body).response;

				if (defs)
				{
					defs.forEach(function(def, i)
					{
						api.say(def.list.category+" "+def.list.synonyms.replace(/\|/g, ", ").replace(/\-/g, " "));
					});
				}
				else
				{
					api.randomMessage("nodefs", {"word": word});
				}
			});
		}
	}
}
