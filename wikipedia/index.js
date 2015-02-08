module.exports =
{
	"methods":
	{
		"wiki": function(msg, sender, api)
		{
			var query = msg.match(/\".+\"/)[0];
			query = query.substring(1, query.length-1);
			
			var base = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&rawcontinue&redirects&titles="+encodeURIComponent(query);
			
			api.request(base, function(err, res, body)
			{
				var info = JSON.parse(body);

				var page;
				for (f in info.query.pages)
				{
					page = info.query.pages[f];
				}
				if (page.missing === undefined)
				{
					var text;
					
					var testpos = 0;
					while (true)
					{
						var pos = page.extract.indexOf(".", testpos);
						if (pos === -1)
						{
							api.randomMessage("oddresult", {"query": query});
							return;
						}
						text = page.extract.substr(0, pos+1);

						var bstart = text.lastIndexOf("<b>");
						var bend = text.lastIndexOf("</b>");
						if (bstart < bend || (bstart === -1 && bend === -1))
							break;
						testpos = pos + 1;
					}

					text = text.replace(/<\/?[^>]+(>|$)/g, "");
					if (text.indexOf("\n") > 0)
						text = text.substr(0, text.indexOf("\n"));
					else if (text.indexOf("\n") === 0)
						text = text.substr(1);

					if (text.length === text.lastIndexOf("may refer to:") + 13)
					{
						api.randomMessage("oddresult", {"query": query});
						return;
					}
					api.say(text);
				}
				else
				{
					api.randomMessage("nodefs", {"query": query});
				}
			});
		}
	}
}
