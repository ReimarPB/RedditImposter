const RedditImposter = require("./index.js"); // Change this when testing
const credentials = require("./credentials.js");
// When testing this, type your own creds like so:
/*

const credentials = {
	username: "YOUR_USERNAME",
	password: "YOUR_PASSWORD"
};

*/

// Everything is in an async function because javascript
(async () => {

	const client = new RedditImposter.Client;

	await client.login(credentials);

	let status = await client.getStatus().catch(console.error);

	console.log(status);

	await client.setAnswer("The atoms that make up my body.").catch(console.error);

	await client.setFlair(RedditImposter.flairs.IMPOSTER_IDENTIFIER).catch(console.error);

})();