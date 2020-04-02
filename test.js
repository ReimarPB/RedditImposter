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

	// Login
	await client.login(credentials);

	// Get current stats
	const status = await client.getStatus();

	console.log(status);

	// Set own answer
	await client.setAnswer("The atoms that make up my body.")

	// Set flair to imposter identifier
	await client.setFlair(RedditImposter.flairs.IMPOSTER_IDENTIFIER);

	// Get 5 random answers
	const answers = await client.getAnswers();

	console.log(answers);

	// Guess the first answer
	const guess = await client.submitGuess(answers[0]);

	if (guess) console.log("You guessed right!");
	else console.log("You guessed wrong.");

})();