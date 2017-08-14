'use strict'

/*
|--------------------------------------------------------------------------
| HTTP Server Setup
|--------------------------------------------------------------------------
|
| Here we join different pieces and start the HTTP server. It will be
| a matter of seconds to start your shiny Adonis application.
|
*/

const app = require('./app')
const fold = require('adonis-fold')
const path = require('path')
const packageFile = path.join(__dirname, '../package.json')
require('./extend')

module.exports = function (callback) {
  fold.Registrar
    .register(app.providers)
    .then(() => {
      /*
      |--------------------------------------------------------------------------
      | Register Aliases
      |--------------------------------------------------------------------------
      |
      | After registering all the providers, we need to setup aliases so that
      | providers can be referenced with short sweet names.
      |
      */
      fold.Ioc.aliases(app.aliases)

      /*
      |--------------------------------------------------------------------------
      | Register Package File
      |--------------------------------------------------------------------------
      |
      | Adonis application package.json file has the reference to the autoload
      | directory. Here we register the package file with the Helpers provider
      | to setup autoloading.
      |
      */
      const Helpers = use('Helpers')
      const Env = use('Env')
      Helpers.load(packageFile, fold.Ioc)

      /*
      |--------------------------------------------------------------------------
      | Register Events
      |--------------------------------------------------------------------------
      |
      | Here we require the event.js file to register events defined inside
      | events.js file.
      |
      */
      require('./events')

      /*
      |--------------------------------------------------------------------------
      | Load Middleware And Routes
      |--------------------------------------------------------------------------
      |
      | Middleware and Routes are required to oil up your HTTP server. Here we
      | require defined files for same.
      |
      */
      use(Helpers.makeNameSpace('Http', 'kernel'))
      use(Helpers.makeNameSpace('Http', 'routes'))

      /*
      |--------------------------------------------------------------------------
      | Load Websocket Channels And Middleware
      |--------------------------------------------------------------------------
      |
      | Websocket channels defination should be loaded before firing the Http
      | server.
      |
      */
      use(Helpers.makeNameSpace('Ws', 'kernel'))
      use(Helpers.makeNameSpace('Ws', 'socket'))

      /*
      |--------------------------------------------------------------------------
      | Load Database Factory
      |--------------------------------------------------------------------------
      |
      | All database/model blueprints are defined inside the below file. We
      | autoload it to be used inside the entire application.
      |
      */
      use(Helpers.databasePath('factory'))

      /*
      |--------------------------------------------------------------------------
      | Start Http Server
      |--------------------------------------------------------------------------
      |
      | We are all set to fire the Http Server and start receiving new requests.
      |
      */
      const Server = use('Adonis/Src/Server')
      Server.listen(Env.get('HOST'), Env.get('PORT'))
      if (typeof (callback) === 'function') {
        callback()
      }
    })
    .catch((error) => console.error(error.stack))
	console.log("Starting Twitter Crawler")
	//add required monggo and twitter coding here
	//Starting Twit API
	var Twit = require('twit')
	var T = new Twit({
			  consumer_key:         '8FNDwuKYaezU0qMCpJ6mbllbp',
  			consumer_secret:      '6lP7wmloIQOaPNSE0GIn6Cay3Ru66lPz7crZ20HwjUfRls1KVg',
  access_token:         '894830949875064832-Xo6w0J1XJNvRGkYoLhEHoMrnGhyh2dS',
  access_token_secret:  '3PwQKrLO6hg04veV5hnaVlUH5OQ45iHyqgFJRMWTb2N11',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})
//starting monggo connection
const {Database, Model} = require('mongorito');

//const db = new Database('mongodb://rizkymohamad:codechalange1!@ivosightcodechalange-shard-00-00-vlavo.mongodb.net:27017,ivosightcodechalange-shard-00-01-vlavo.mongodb.net:27017,ivosightcodechalange-shard-00-02-vlavo.mongodb.net:27017/ivosight?ssl=true&replicaSet=ivosightcodechalange-shard-0&authSource=admin');
const db = new Database('localhost/twittercrawler');
db.connect();

class Tweets extends Model {}
db.register(Tweets);

//streaming Twitter
var stream = T.stream('statuses/filter', { track: 'indomie' })
stream.on('tweet', function (tweet) {
  //processing tweet data for Monggo Input
  var idVal = tweet.id_str;
  var sourceVal = tweet.source;
  var textVal = tweet.text;
  var serviceVal = "twitter";
  var dateVal = new Date();
  dateVal = tweet.created_at;
  var date_unixVal = tweet.timestamp_ms;
  var imageVal = "";
  var is_bookmarkVal = 0;
  var sentimentVal = {positif: true, negatif: false, netral: true};
  var userVal = {
		avatar : tweet.user.name, 
		name: tweet.user.profile_image_url
  }
  /*
  console.log("id : "+idVal);
  console.log("source : "+sourceVal);
  console.log("text : "+textVal);
  console.log("service : "+serviceVal);
  console.log("date : "+dateVal);
  console.log("date_unix : "+date_unixVal);
  console.log("image : "+imageVal);
  console.log("is_bookmark : "+is_bookmarkVal);
  console.log("sentiment : ");
  console.log(sentimentVal);	
  console.log("user : ");
  console.log(userVal);
  */
  //saving to database
  const tweets = new Tweets({
  	id: idVal,
	source: sourceVal,
	text: textVal,
	service:serviceVal,
	date:dateVal,
	date_unix:parseInt(date_unixVal),
	image:imageVal,
	is_bookmark:is_bookmarkVal,
	sentiment:sentimentVal,
	user:userVal
  });
  tweets.save();
  console.log("-----Save Success-----");
  //var dateFormat = require('dateformat');
  //var d = new Date();
  //d = tweet.created_at;
  //console.log(dateFormat(d,"mmm dd, yyyy HH:MM:ss"))
  //console.log(tweet);
})

}
