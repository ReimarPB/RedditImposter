const https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = {

	Client: class {

		constructor() {
			this.cookies = {};
		}

		// Logs in to a reddit account and saves cookies in this.cookies
		login(credentials) {

			return new Promise((resolve, reject) => {

				// Send login request
				const data = `user=${credentials.username}&passwd=${credentials.password}&api_type=json`;

				const options = {
					hostname: "ssl.reddit.com",
					path: "/api/login",
					method: "POST",
					headers: {
						"Content-Length": data.length
					}
				};

				const req = https.request(options, res => {

					// Save cookies
					if (res.headers["set-cookie"]) res.headers["set-cookie"].forEach(cookie => {

						const cookieRegex = /(\w+)=(\S+?);/;
						const name = cookie.match(cookieRegex)[1];
						const value = cookie.match(cookieRegex)[2];

						this.cookies[name] = value;

					});

					let data = "";
					res.on("data", chunk => data += chunk);

					res.on("end", () => {
						
						if (res.statusCode !== 200) reject(data);

						resolve();

					});

				});

				// Reject on error
				req.on("error", err => {
					console.error(err)
					reject(err);
				});

				req.write(data);
				req.end();

			});

		}

		getStatus() {

			return new Promise((resolve, reject) => {

				// Get the results page
				const options = {
					hostname: "gremlins-api.reddit.com",
					path: "/results",
					method: "GET",
					headers: {
						Cookie: toCookieString(this.cookies)
					}
				};

				const req = https.request(options, res => {

					let data = "";
					res.on("data", chunk => data += chunk);

					res.on("end", () => {

						if (res.statusCode !== 200) reject(data);

						// Parse the data
						const dom = JSDOM.fragment(data);

						// Save CSRF token
						this.csrf = dom.querySelector("gremlin-app").getAttribute("csrf");

						const editballoon = dom.querySelector("gremlin-editballoon");
						const numberStat = dom.querySelector("gremlin-numberstat");
						const gremlinStats = dom.querySelector("gremlin-stats").querySelectorAll("gremlin-avatarmeter");
						const gremlinMeta = dom.querySelector("gremlin-meta").querySelectorAll("span");

						resolve({

							// Misc
							answer: editballoon ? editballoon.textContent.trim() : null,
							totalAnswers: numberStat ? parseInt(numberStat.getAttribute("value")) : null,
							// Gremlin stats (percentage)
							imposterDeceivesHumans: gremlinStats[0] ? parseFloat(gremlinStats[0].getAttribute("value")) : null,
							youIdentifyImposter: gremlinStats[1] ? 1 - parseFloat(gremlinStats[1].getAttribute("value")) : null,
							youDeceiveHumans: gremlinStats[2] ? parseFloat(gremlinStats[2].getAttribute("value")) : null,
							// Totals
							totalImposters: gremlinMeta[0] ? parseInt(gremlinMeta[0].textContent.replace(/Total Imposters: /i, "")) : null,
							totalHumans: gremlinMeta[1] ? parseInt(gremlinMeta[2].textContent.replace(/Total Humans: /i, "")) : null

						});

					});

				});

				req.on("error", err => {
					reject(err);
				});

				req.end();

			});

		}

		setAnswer(answer) {

			return new Promise((resolve, reject) => {

				if (!this.csrf) {
					console.error("[RedditImposter] ERROR: A CSRF token must be set before you can update your answer. Try calling setStatus() first.");
					return "No CSRF token set";
				}

				// POST the new answer
				const data = `note=${encodeURIComponent(answer)}&csrf_token=${this.csrf}`;

				const options = {
					hostname: "gremlins-api.reddit.com",
					path: "/create_note",
					method: "POST",
					headers: {
						Cookie: toCookieString(this.cookies),
						"Content-Length": data.length
					}
				};

				const req = https.request(options, res => {

					let data = "";
					res.on("data", chunk => data += chunk);

					res.on("end", () => {

						console.log(data);

						if (res.statusCode !== 200) reject(data);

						try {

							data = JSON.parse(data);

							if (!data.success) reject(JSON.stringify(data));

							resolve(data.note_id);

						} catch(e) {
							reject(data);
						}

					});

				});
				
				req.write(data);
				req.end();

			});

		}

	}

}

// Converts cookie object to string
function toCookieString(cookies) {
	let str = "";
	for (name in cookies) {
		str += `${name}=${cookies[name]}; `
	}
	return str;
}