module.exports =
{
	"methods":
	{
		"wiki": function(msg, sender, api)
		{
			var query = msg.match(/\".+\"/)[0];
			query = query.substring(1, query.length-1);

			var base = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&rawcontinue&titles="+encodeURIComponent(query)+"&exsentences=";

			api.request(base+1, function(err, res, body)
			{
				var info = JSON.parse(body);

				var page;
				for (f in info.query.pages)
				{
					page = info.query.pages[f];
				}
				if (page.missing === undefined)
				{
					var text = page.extract.match("<p>(.*)</p>")[1];
					api.request(base+2, function(err, res, body)
					{
						var info = JSON.parse(body);

						var page;
						for (f in info.query.pages)
						{
							page = info.query.pages[f];
						}
						var moretext = page.extract.match("<p>(.*)</p>")[1];
						if (moretext.indexOf(text) === -1)
							api.say(moretext.replace(/<\/?[^>]+(>|$)/g, ""));
						else
							api.say(text.replace(/<\/?[^>]+(>|$)/g, ""));
					});
				}
				else
				{
					api.randomMessage("nodefs", {"query": query});
				}
			});
		}
	}
}
