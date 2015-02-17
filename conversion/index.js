var http = require("http");

module.exports =
{
	"methods":
	{
		"base": function(msg, sender, api)
		{
			var parsed = parseBase(msg);

			try
			{
				var result = toBase(parsed.fromBase, parsed.toBase, parsed.number);
			}
			catch (e)
			{
				api.randomMessage("badBaseConvert",
				{
					"nick": sender,
					"number": parsed.number,
					"fromBase": parsed.fromBase,
					"toBase": parsed.toBase
				});
			}

			api.say(result);
		},

		"currency": function(msg, sender, api)
		{
			var tokens = msg.split(/\s+/);

			var fromCurrencyNext = true;

			var fromCurrency;
			var toCurrency;
			var amount = 1;
			tokens.forEach(function(token)
			{
				if (token.match(/[A-Z]{1,4}/))
					if (fromCurrencyNext)
						fromCurrency = token;
					else
						toCurrency = token;
				else if (token.match("to"))
					fromCurrencyNext = false;
				else if (token.match(/[0-9]+(\.[0-9]+)?/))
					amount = parseFloat(token);
			});

			var host = "http://www.freecurrencyconverterapi.com";
			var path = "/api/convert?q="+fromCurrency+"-"+toCurrency+"&compact=y";

			api.request(host+path, function(err, res, body)
			{
				if (err) throw err;

				var result = amount*JSON.parse(body)[fromCurrency+"-"+toCurrency].val;
				api.randomMessage("currencyConvert",
				{
					"from": fromCurrency,
					"to": toCurrency,
					"input": amount,
					"result": parseFloat(result).toFixed(2)
				});
			});
		}
	}
}

function parseBase(str)
{
	var nextBase = "";
	var next = "";

	var tokens = str.split(/\s+/);
	var fromBase = 10;
	var toBase = 10;
	var num = 0;

	var i;
	for (i in tokens)
	{
		var token = tokens[i];

		if (token.match(/^\d+$/) && nextBase == "from")
		{
			fromBase = +token;
		}
		else if (token.match(/^\d+$/) && nextBase == "to")
		{
			toBase = +token;
		}
		else if (token.match(/^from$/i))
		{
			next = "from";
		}
		else if (token.match(/^to$/i))
		{
			next = "to";
		}
		else if (token.match(/^base$/i))
		{
			if (next == "from")
				nextBase = "from";
			else if (next == "to")
				nextBase = "to";
		}
		else
		{
			num = token;
		}
	}

	var ret =
	{
		"fromBase": fromBase,
		"toBase": toBase,
		"number": num
	}

	return ret;
}

function toBase(fromBase, toBase, num)
{
	num = parseInt(num, fromBase);

	if (toBase > 36 || toBase < 2)
		throw new Error("Base out of bounds");
	else if (isNaN(num))
		throw new Error("Not a Number");

	return num.toString(toBase).toUpperCase();
}
