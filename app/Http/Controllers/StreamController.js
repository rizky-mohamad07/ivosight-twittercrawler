'use strict'
//connecting DB
const {Database, Model} = require('mongorito');
const db = new Database('localhost/twittercrawler');
db.connect();
class Streams extends Model {
	collection() {
		return 'tweets';
	}
}
db.register(Streams);


class StreamController {
* index (request,response) {
	//const streams = new Streams();
	var results = yield Streams.find();
	//const posts = yield Post.all()
    results = JSON.stringify(results,null,2);
    console.log(results);
		yield response.sendView('stream',{result:results})

}
}
module.exports = StreamController
