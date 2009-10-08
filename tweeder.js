document.observe("dom:loaded", function() {
	$$('div[data-tweeder]').each(function(tweeder, index) {
		var config = tweeder.readAttribute('data-tweeder').evalJSON();
		
		var queryString = '';
		if(config.query.fromUser)
			queryString += '+from:' + config.query.fromUser;
		
		if(config.query.hashtags)
			config.query.hashtags.each(function(hashtag) {
				if(hashtag.startsWith('#'))
					queryString += '+' + hashtag;
				else
					queryString += '+#' + hashtag;
			});
			
		var queryURL = 'http://search.twitter.com/search.json?q=' + escape(queryString) + '&callback=' + 'tweederCallback_' + index;
		tweeder.update(queryString + '<br />' + queryURL);
		
		window['tweederCallback_' + index] = function(data) {
			if(data.error) {
				alert(data.error);
				return false;
			}
			
			data.results.each(function(result) {
				tweeder.insert('<div>' + result.text + '</div>');
			});
		};
		
		//$(document.body).insert(new Element('script', { 'type': 'text/javascript', 'src': queryURL }));
		window['tweederCallback_' + index]({
	   "results":[
	      {
	         "profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg",
	         "created_at":"Wed, 07 Oct 2009 18:49:13 +0000",
	         "from_user":"seanhealy",
	         "to_user_id":null,
	         "text":"Got some new gloves and a goofy hat. #utils +42",
	         "id":4689032021,
	         "from_user_id":4485910,
	         "iso_language_code":"en",
	         "source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"
	      },
	      {
	         "profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg",
	         "created_at":"Sat, 03 Oct 2009 00:39:45 +0000",
	         "from_user":"seanhealy",
	         "to_user_id":null,
	         "text":"The SugarBowl took all the tasty things off of their menu. #utils -250",
	         "id":4567645732,
	         "from_user_id":4485910,
	         "iso_language_code":"en",
	         "source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"
	      },
	      {
	         "profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg",
	         "created_at":"Wed, 30 Sep 2009 23:25:55 +0000",
	         "from_user":"seanhealy",
	         "to_user_id":null,
	         "text":"Slash http://utils.me is now sporting fixed math. #utils +100",
	         "id":4510259404,
	         "from_user_id":4485910,
	         "iso_language_code":"en",
	         "source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"
	      },
	      {
	         "profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg",
	         "created_at":"Wed, 30 Sep 2009 23:25:16 +0000",
	         "from_user":"seanhealy",
	         "to_user_id":null,
	         "text":"Normalization of utils after the fantastic Corb Lund show. #utils 400",
	         "id":4510244744,
	         "from_user_id":4485910,
	         "iso_language_code":"en",
	         "source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"
	      },
	      {
	         "profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg",
	         "created_at":"Mon, 28 Sep 2009 18:42:14 +0000",
	         "from_user":"seanhealy",
	         "to_user_id":null,
	         "text":"New Regex Best friend Ð RegexPal http://z.pe/ntt\n\n#utils +100",
	         "id":4449451769,
	         "from_user_id":4485910,
	         "iso_language_code":"no",
	         "source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"
	      }
	   ],
	   "max_id":4690541857,
	   "since_id":0,
	   "refresh_url":"?since_id=4690541857&q=+from%3Aseanhealy+%23utils",
	   "results_per_page":15,
	   "page":1,
	   "completed_in":2.83447,
	   "query":"+from%3Aseanhealy+%23utils"
		});
	});
});