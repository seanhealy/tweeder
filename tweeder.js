
StringDetector = Class.create({
	source: null,
	detected: null,
	detections: [],
	
  initialize: function() {
    
  },

  speak: function() {
    alert(this.name + " says: " + this.sound + "!");
  }
});

Object.extend(String.prototype, {
	activateDetectors: function() {
		return this;
	}
});

var lastTweetId = 0;
var pollRate = 10;

document.observe("dom:loaded", function(event) {
	$$('div[data-tweeder]').each(function(tweeder, index) {
		var config = tweeder.readAttribute('data-tweeder').evalJSON();
		
		var queryString = '';
		if(config.query.fromUser)
			queryString += 'from:' + config.query.fromUser + '+';
		
		if(config.query.hashtags)
			config.query.hashtags.each(function(hashtag) {
				if(hashtag.startsWith('#'))
					queryString += hashtag + '+';
				else
					queryString += '#' + hashtag + '+';
			});
		
		queryString = queryString.gsub(/\+$/, '');
			
		var tweederList = new Element('ul');
		tweeder.insert(tweederList);
		
		if(config.allowPosting) {
			// !Activate Twitter Button
			var activateTwitterButton = new Element('a', { href: '#', 'class': 'activate_twitter' }).update('Activate Twitter');
			tweeder.insert({top: activateTwitterButton});
			
			// !New Post
			var defaultTweetInputText = 'Type here to comment.';
			
			var tweederInputItem = new Element('li', { 'class': 'tweet_input_item' });
			var tweetInput = new Element('textarea', { 'class': 'tweet_text' }).update(defaultTweetInputText);
			var tweetInputWrapper = new Element('div', { 'class': 'tweet_text_wrapper' });
			var postCommentLabel = new Element('div', { 'class': 'post_comment_label' }).update('New Comment');
			var charactersRemaining = new Element('div', { 'class': 'characters_remaining' }).update(140);
			var postCommentButton = new Element('a', { href: '#', 'class': 'post_comment_button' }).update('Post');
			var tweetImage = new Element('div', { 'class': 'profile_image' });
			var tweetArrow = new Element('div', { 'class': 'arrow' });
			
			tweederList.insert(tweederInputItem);
			tweederInputItem.insert(tweetImage);
			tweederInputItem.insert(tweetArrow);
			tweederInputItem.insert(tweetInputWrapper);
			tweetInputWrapper.insert(tweetInput);
			tweederInputItem.insert(postCommentLabel);
			tweederInputItem.insert(charactersRemaining);
			tweederInputItem.insert(postCommentButton);
			
			charactersRemaining.setStyle({
				top: 5 - charactersRemaining.getHeight()/2 + (postCommentButton.getHeight())/2 + 'px',
				right: 13 + postCommentButton.getWidth() + 'px'
			});
			
			var minTweetInputHeight = tweetInputWrapper.getStyle('min-height');
			tweetInput.observe('keyup', function(event) {
				this.up('div.tweet_text_wrapper').next('div.characters_remaining').update((140 - this.value.length));
				this.setStyle({ height: '0px' });
				this.setStyle({ height: Math.max(parseInt(minTweetInputHeight), this.scrollHeight - parseInt(this.getStyle('padding-top')) - parseInt(this.getStyle('padding-bottom'))) + 'px' });
			});
			
			tweetInput.observe('focus', function(event) {
				if(this.value == defaultTweetInputText) {
					this.value = '';
					this.up('div.tweet_text_wrapper').next('div.characters_remaining').update(140);
				}
			});
			
			tweetInput.observe('blur', function(event) {
				if(this.value.strip() == '')
					this.value = defaultTweetInputText;
			});
			
			tweederInputItem.observe('click', function(event) {
				if(event.element() != this.down('a.post_comment_button'))
					this.down('textarea.tweet_text').focus();
			});
			
			// Tweet inserting loader
			var newTweetLoaderWrapper = new Element('li', { 'class': 'new_tweet_loader_wrapper', 'style': 'display: none;' });
			var newTweetLoader = new Element('div').update('Posting');
			
			tweederList.insert(newTweetLoaderWrapper);
			newTweetLoaderWrapper.insert(newTweetLoader);
		}
		else {
			// We need a blank one of these later just to make the tweet insertion logic easier. So there.
			var newTweetLoaderWrapper = new Element('li', { 'style': 'display: none;' } );
			tweederList.insert(newTweetLoaderWrapper);
		}
		
		window['tweederCallback_' + index] = function(data) {
			if(data.error) {
				alert(data.error);
				return false;
			}
			
			var month = new Array(12);
			month[0]  = "January";
			month[1]  = "February";
			month[2]  = "March";
			month[3]  = "April";
			month[4]  = "May";
			month[5]  = "June";
			month[6]  = "July";
			month[7]  = "August";
			month[8]  = "September";
			month[9]  = "October";
			month[10] = "November";
			month[11] = "December";
			
			var currentMaxId = lastTweetId;
			
			data.results.reverse().each(function(result, index) {
				if (result.id > lastTweetId) {
					var date = new Date(result.created_at);
					
					var tweetItem = new Element('li').hide();
					var tweetUsername = new Element('a', { href: '#', 'class': 'username' }).update(result.from_user);
					var tweetDate = new Element('div', { 'class': 'date' }).update(month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' at ' + (date.getHours()+1)%12 + ':' + date.getMinutes() + ' ' + ((date.getHours>11)?'am':'pm') );
					var tweetText = new Element('div', { 'class': 'tweet_text' }).update(result.text.activateDetectors());
					var tweetImage = new Element('div', { 'class': 'profile_image' });
					var tweetArrow = new Element('div', { 'class': 'arrow' });
					
					newTweetLoaderWrapper.insert({after: tweetItem});
					tweetItem.insert(tweetImage);
					tweetImage.setStyle({ 'background-image': 'url(' + result.profile_image_url + ')' });
					tweetItem.insert(tweetArrow);
					tweetItem.insert(tweetText);
					tweetItem.insert(tweetUsername);
					tweetItem.insert(tweetDate);
					
					tweetItem.appear({ duration: 0.6, delay: index*((pollRate+2)/Math.max(data.results.length, 1)) });
					
					currentMaxId = Math.max(result.id, currentMaxId);
				}
			});
			
			lastTweetId = currentMaxId;
		};
		
/*
		new PeriodicalExecuter(function(periodicalExecuter) {
			var queryURL;
//			if (lastTweetId) 
//				queryURL = 'http://search.twitter.com/search.json?q=' + escape(queryString) + '&callback=' + 'tweederCallback_' + index + '&since_id=' + lastTweetId;
//			else
			queryURL = 'http://search.twitter.com/search.json?q=' + escape(queryString) + '&callback=' + 'tweederCallback_' + index + '&cachekill=' + new Date().getTime();
				
		  $(document.body).insert(new Element('script', { 'type': 'text/javascript', 'src': queryURL })); //TODO: Put this back in so it will actually work.
		}, pollRate);
*/
		
		// This is a sample call of a twitter result set. Its existance is not long for this world.
		window['tweederCallback_' + index]({"results":[{"profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg","created_at":"Wed, 08 Oct 2009 18:49:13 +0000","from_user":"seanhealy","to_user_id":null,"text":"Not a picture: http://twitpic.com/kr32g","id":4689032021,"from_user_id":4485910,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg","created_at":"Wed, 07 Oct 2009 18:49:13 +0000","from_user":"seanhealy","to_user_id":null,"text":"Got some new gloves and a goofy hat. #utils +42","id":4689032020,"from_user_id":4485910,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg","created_at":"Sat, 03 Oct 2009 00:39:45 +0000","from_user":"seanhealy","to_user_id":null,"text":"The SugarBowl took all the tasty things off of their menu. #utils -250","id":4567645732,"from_user_id":4485910,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg","created_at":"Wed, 30 Sep 2009 23:25:55 +0000","from_user":"seanhealy","to_user_id":null,"text":"Slash http://utils.me is now sporting fixed math. #utils +100 Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tmpor","id":4510259404,"from_user_id":4485910,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg","created_at":"Wed, 30 Sep 2009 23:25:16 +0000","from_user":"seanhealy","to_user_id":null,"text":"Normalization of utils after the fantastic Corb Lund show. #utils 400","id":4510244744,"from_user_id":4485910,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"},{"profile_image_url":"http://a1.twimg.com/profile_images/282217540/n866215176_4755198_4392_Thumb_normal.jpg","created_at":"Mon, 28 Sep 2009 18:42:14 +0000","from_user":"seanhealy","to_user_id":null,"text":"New Regex Best friend <3 RegexPal http://z.pe/ntt\n\n#utils +100","id":4449451769,"from_user_id":4485910,"iso_language_code":"no","source":"&lt;a href=&quot;http://www.atebits.com/&quot; rel=&quot;nofollow&quot;&gt;Tweetie&lt;/a&gt;"}],"max_id":4690541857,"since_id":0,"refresh_url":"?since_id=4690541857&q=+from%3Aseanhealy+%23utils","results_per_page":15,"page":1,"completed_in":2.83447,"query":"+from%3Aseanhealy+%23utils"});

	});
});