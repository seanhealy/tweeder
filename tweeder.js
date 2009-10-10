Object.extend(String.prototype, {
	addBob: function() {
		return this + 'bob';
	}
});

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
		//tweeder.update(queryString + '<br />' + queryURL);
		
		var tweederList = new Element('ul');
		tweeder.insert(tweederList);
		
		window['tweederCallback_' + index] = function(data) {
			if(data.error) {
				alert(data.error);
				return false;
			}
			
			data.results.each(function(result) {
				var aTweet = new Element('li');
				var tweetTextDiv = new Element('div').update(result.text.addBob());
				var tweetImage = new Element('img', { src: result.profile_image_url });
				var tweetArrow = new Element('div');
				
				tweederList.insert(aTweet);
				aTweet.insert(tweetImage);
				aTweet.insert(tweetTextDiv);
				tweetTextDiv.insert(tweetArrow);
			});
		};
		
		// $(document.body).insert(new Element('script', { 'type': 'text/javascript', 'src': queryURL })); //TODO: Put this back in so it will actually work.
		
		// This is a sample call of a twitter result set. Its existance is not long for this world.
		window['tweederCallback_' + index]({
	   "results":[
	      {
	         "profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg",
	         "created_at":"Wed, 08 Oct 2009 18:49:13 +0000",
	         "from_user":"seanhealy",
	         "to_user_id":null,
	         "text":"Not a picture: http://twitpic.com/kr32g",
	         "id":4689032021,
	         "from_user_id":4485910,
	         "iso_language_code":"en",
	         "source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"
	      },
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
	         "text":"Slash http://utils.me is now sporting fixed math. #utils +100 Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
	         "text":"New Regex Best friend <3 RegexPal http://z.pe/ntt\n\n#utils +100",
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