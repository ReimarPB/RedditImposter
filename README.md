# RedditImposter
A node.js API for Reddit's 2020 april fools experiment.

**NOTE:** This project is still a work in progress.

This hasn't been uploaded to npm, so if you want to use it, download the index.js file and require it in your own project.

## Getting started

See `test.js` for some example code. (To use it, you will need to download it and run it locally with your credentials.)

There isn't much more right now.

## Contribution

I don't mind pull requests, as long as you have nothing against dealing with my shitty code. Feel free to ask questions or whatever in the issues too.

## Documentation

**Client methods:**

`login(credentials: Object) -> Promise<undefined | String>` - Logs in to your reddit account and returns the error data upon failure. Logging in is required for the API to work. The first argument should be a JS object with a *username* and *password* property.

`getStatus() -> Promise<Object>` - Gets all information Reddit shows on the results page. Returns a JS object with the following properties:
* `answer: String | null` - Your current answer to the question if you have one.
* `totalAnswers: Number | null` - The total amount of answers that have been made by all of Reddit. Can only be seen before you have guessed for the first time.
* `ìmposterDeceivesHumans: Number` - The ratio between people guessing wrong and correct. Multiply by 100 to get the percentage. Should never be null.
* `youIdentifyImposter: Number` - The ratio between you guessing correct and wrong. Multiply by 100 to get the percentage. Should never be null.
* `youDeceiveHumans: Number | null` - The ratio between people guessing you as the imposter and not. Multiply by 100 to get the percentage. Can only be seen when *totalAnswers* can't.
* `totalImposters: Number | null` - The amount of imposters you have guessed right. Can only be seen after guessing for the first time.
* `totalHumans: Number | null` - The amount of humans you have guessed wrong. Can only be seen after guessing for the first time.

`setAnswer(answer: String) -> Promise<String>` - Sets your own answer to the question and returns the ID upon success and error data upon failure. A CSRF token is required for this to work so you must call any method first.

`setFlair(flair: String) -> Promise<undefined | String>` - Sets the user flair to one of the four possible flairs and returns error data upon failure. These are the possible flair types:
* `RedditImposter.flairs.IMPOSTER` - Track how often your answer is identified by other players.
* `RedditImposter.flairs.HUMAN` - Track how often your answer is not identified by other players.
* `RedditImposter.flairs.IMPOSTER_IDENTIFIER` - Track how often you identify the imposter's answer.
* `RedditImposter.flairs.HUMAN_IDENTIFIER` - Track how often you identify a human's answer.

## Footnotes
* Reddit seems to (as of Apr 2, 13:00 GMT) no longer tell how many total answers have been made so `totalAnswers` in `getStatus()` will be NaN for now. I don't know if this change is permanent.
* You can login directly with your CSRF token (which is always visible in the source of the page) by using `client.csrf = "YOUR_TOKEN"`
* getStatus() automatically sets your CSRF token. There are more methods to come that do this.
