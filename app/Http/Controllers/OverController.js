'use strict'
/*
var mongo = require('mongodb');
var assert = require('assert');

var MongoClient = mongo.MongoClient;

var url = 'mongodb://localhost:27017/twittercrawler';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  var results = (db, callback) =>{
		var agr = [
    {
        "$project": {
            "formattedDate": {
                "$dateToString": {
                    "format": "%Y-%m-%d",
                    "date": { "$add": ["$date_unix", new Date(0)] }
                }
            }
        }
    },
    {
        "$group": {
            "_id": "$formattedDate",
            "count": { "$sum": 1 }
        }
    }
];
           
	    var cursor = db.collection('tweets').aggregate(agr).toArray ( (err, res) => {
			       assert.equal(err, null);
					console.log("now getting result");
			       console.log(JSON.stringify(res));
       
			       callback(res);        
		    });
	};
console.log("end");
//console.log(JSON.stringify(results,null,2));
  //db.close();
});
*/

//connecting DB
const {Database, Model} = require('mongorito');
const db = new Database('localhost/twittercrawler');
db.connect();
class Overs extends Model {
	collection() {
		return 'tweets';
	}
}
db.register(Overs);

class OverController {
* index (request,response) {
	var tweet = yield Overs.find();
	var tweets = JSON.stringify(tweet);
 	var tweeto = JSON.parse(tweets);
	var results = {}, rarr = [], i, date;
	for(i=0; i<tweeto.length;i++){
		console.log(tweeto[i]);
		var tdate = new Date(tweeto[i].date);
		date = [tdate.getFullYear(),tdate.getMonth(),tdate.getDate()].join("-");
  		results[date] = results[date] || 0;
  		results[date]++;
	}
for (i in results) {
 if (results.hasOwnProperty(i)) {
   rarr.push({date:i,counts:results[i]});
}
}
	console.log(rarr);
    var results2 = JSON.stringify(rarr,null,2);
    console.log(results2);
	yield response.sendView('over',{result:results2})
    
	
}
}
module.exports = OverController
