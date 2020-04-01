# RedditImposter
A node.js API for Reddit's 2020 april fools experiment.

**NOTE:** This project is still a work in progress.
This hasn't been uploaded to npm, so if you want to use it, download the index.js file and require it in your own project.

## Getting started

See `test.js` for some example code. (To use it, you will need to download it and run it locally with your credentials.)

There isn't much more right now.

## Contribution

I don't mind pull requests, as long as you have nothing against dealing with my shitty code. Feel free to asks questions or whatever in the issues too.

## Documentation

**Client methods:**

`login(credentials: Object)` - Logs in to your reddit account. Logging in is required for the API to work. The first argument should be a JS object with a *username* and *password* property

`getStatus()` - Gets all information Reddit shows on the results page. Returns a JS object with the following properties:
* `answer: String | null` - Your current answer to the question if you have one.
* `totalAnswers: Number | null` - The total amount of answers that have been made by all of Reddit. Can only be seen before you have guessed for the first time.
* `ìmposterDeceivesHumans: Number` - The ratio between people guessing wrong and correct. Multiply by 100 to get the percentage. Should never be null.
* `youIdentifyImposter: Number` - The ratio between you guessing correct and wrong. Multiply by 100 to get the percentage. Should never be null.
* `youDeceiveHumans: Number | null` - The ratio between people guessing you as the imposter and not. Multiply by 100 to get the percentage. Can only be seen when *totalAnswers* can't.
* `totalImposters: Number | null` - The amount of imposters you have guessed right. Can only be seen after guessing for the first time.
* `totalHumans: Number | null` - The amount of humans you have guessed wrong. Can only be seen after guessing for the first time.
