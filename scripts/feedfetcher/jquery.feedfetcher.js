/*
 * jQuery FeedFetcher v0.95b - http://www.coreyspitzer.net
 *
 * Aggregates and embeds feed(s) from: 
 * - Facebook users, applications, and fan pages
 * - tweets from given users and/or mentioning given users
 * - RSS feeds
 * 
 * Based loosely on Tweet! plugin from http://tweet.seaofclouds.com 
 *
 * Copyright (c) 2011 Corey A. Spitzer
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.feedFetcher = function(options) {
  
		// --------- variables ---------------------------- \\
		
		var default_options = {
			
			// fetch tweets coming from usernames in this list	
			twitter_posts_from_usernames: [],
			
			// fetch tweets mentioning usernames in this list			
			twitter_posts_mentioning_usernames: [],
			
			// whether or not to strip out tweets starting with "@"
			twitter_include_replies: false,
			
			// for more facebook info, see http://developers.facebook.com/docs/reference/api/
			
			// A facebook access token is required to get facebook feeds.
			facebook_access_token: '',
			
			// application/user/fan page IDs whose feeds we want to fetch from
			facebook_feed_from_ids: [],  
			
			// filter out all posts in the feed(s) except those from these application/user/fan page IDs;
			// if this is empty, all posts will be fetched.
			facebook_post_source_ids: [], 
			
			// facebook wall post types: status, photo, link, etc.
			facebook_post_types: ['status', 'photo', 'link'],
			
			// the API key for the Google Loader API; required for RSS feeds if the Google Loader API has not already
			// been initialized before FeedFetcher is called.  See http://code.google.com/apis/feed
			intialize_google_with_api_key: undefined,
			
			// the URLs of the RSS feeds you'd like to fetch
			rss_urls: [],
			
			// the URL of the avatar to use for posts coming from RSS feeds
			rss_avatar_url: undefined,
			
			// see display functions below
			display_format: 'default',  
			
			// this is a maximum; it is not guaranteed that there will be exactly these number of posts retrieved.
			max_post_count: 1,
			
			// function to be called after everything has been fetched and displayed
			callback: function(feed_posts) {},
			
			// mostly sets whether or not to fail silently in the face of errors or make noise
			debug_mode: false
		};
	
		if(options)
		{
			$.extend(default_options, options);
		}

		options = default_options;
		
		var elements = this;
		var feed_posts = new Array();
		
		var facebook_sources = new Array();
		
		var pending_request_count = options.facebook_feed_from_ids.length;
		pending_request_count += options.rss_urls.length;
		
		if(options.twitter_posts_from_usernames.length > 0)
		{
			pending_request_count++;
		}
		
		if(options.twitter_posts_mentioning_usernames.length > 0)
		{
			pending_request_count++;
		}
		
		// ----- display functions; modify as needed ------ \\
		
		function display_feed()
		{
			elements.each(function(index, element) { 
				
				$(element).html(eval('display_format_' + options.display_format + '();'));
			});
		}
		
		// this is just a quick "display something" template; not meant to be the prettiest thing in the world.
		function display_format_default()
		{
			html = '<table class="feed_fetcher_table" cellspacing="0">';
			
			$.each(feed_posts, function(index, post) {
				
	        	html += '<tr>';
		        html += '<td>';
		        
		        if(post.avatar_url == undefined)
		        {
		        	html += '&nbsp;';
		        }
		        else
		        {
		        	html += '<a href="' + post.source_url + '" target="_blank"><img src="' + post.avatar_url + '"/></a><br/>';
		        }
		        
		        html += post.display_name + '<br/>';
		        html += post.relative_time;
		        html += '</td>';
		        html += '<td>' + post.message + '</td>';
	        	html += '</tr>';
			});
			
			html += '</table>';
			
			return html;			
		}
		
		// ---------------- other functions --------------- \\		
		
		// functions for doing post text processing like linking URLs and, in tweets, users
		$.fn.extend({
			
			linkURL: function() {
				
				var returning = [];
				var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
				
				this.each(function() {
					returning.push(this.replace(regexp,"<a href=\"$1\">$1</a>"))
				});
				
				return $(returning);
	        },
	        
	        linkUser: function() {
	        	
	        	var returning = [];
	        	var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;

	        	this.each(function() {
	        		returning.push(this.replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>"))
	        	});
	        	
	        	return $(returning);
	        },
	        
	        linkHash: function() {
	          
	        	var returning = [];
	        	var regexp = / [\#]+([A-Za-z0-9-_]+)/gi;
	        	
	        	this.each(function() {
	        		returning.push(this.replace(regexp, ' <a href="http://earch.twitter.com/search?q=&tag=$1&lang=all">#$1</a>'))
	        	});
	        	
	        	return $(returning);
	        },
	        
	        makeHeart: function() {
	        	
	        	var returning = [];
	        	
	        	this.each(function() {
	        		returning.push(this.replace(/[&lt;]+[3]/gi, "<tt class='heart'>&#x2665;</tt>"))
	        	});
	        	
	        	return $(returning);
	        }
		});		
				
	    function timestamp_to_relative_time(timestamp) 
	    {
	        var delta = parseInt((new Date().getTime() - timestamp * 1000) / 1000);
	        
	        if(delta < 60) 
	        {
	        	return 'JUST NOW';
	        } 
	        else if(delta < 120) 
	        {
	        	return '1 MINUTE AGO';
	        } 
	        else if(delta < (45 * 60)) 
	        {
	        	return (parseInt(delta / 60)).toString() + ' MINUTES AGO';
	        } 
	        else if(delta < (90 * 60)) 
	        {
	        	return '1 HOUR AGO';
	        } 
	        else if(delta < (24 * 60 * 60)) 
	        {
	        	return (parseInt(delta / 3600)).toString() + ' HOURS AGO';
	        }
	        else if(delta < (48 * 60 * 60)) 
	        {
	        	return '1 DAY AGO';
	        } 
	        else 
	        {
	        	return (parseInt(delta / 86400)).toString() + ' DAYS AGO';
	        }
	    }
	    
	    // delta_string is in the format [+|-]####
	    function gmt_delta_seconds(delta_string)
	    {
	    	hours = parseInt(delta_string.substring(0, 3));
	    	minutes = parseInt(delta_string.substring(3, 5));
	    	
	    	return hours * 60 * 60 + minutes * 60;
	    }
		
		function save_post(platform, post_type, source_id, display_name, avatar_url, message, timestamp, extra_data)
		{
			if(!options.include_empty_posts && (!message || message.length == 0))
			{
				return;
			}
			
			if(platform == 'facebook')
			{
				message = $([message]).linkURL().makeHeart()[0];
			}
			else if(platform == 'twitter')
			{
				message = $([message]).linkURL().makeHeart().linkHash().linkUser()[0];
			}
			
			var post = new Object();
			post.platform = platform;
			post.post_type = post_type;
			post.source_id = source_id;
			post.display_name = display_name;
			post.avatar_url = avatar_url;
			post.message = message;
			post.timestamp = timestamp;
			post.extra_data = extra_data;
			post.id = feed_posts.length;
			post.relative_time = timestamp_to_relative_time(timestamp);
			
			if(post.platform == 'twitter')
			{
				post.source_url = 'http://www.twitter.com/' + post.source_id;
			}
			else if(post.platform == 'facebook')
			{
				post.source_url = 'http://www.facebook.com/profile.php?id=' + post.source_id;
			}
			else
			{
				post.source_url = post.source_id;
			}			
			
			feed_posts.push(post);
		}
		
		function save_facebook_post_source(id, display_name)
		{
			var source = new Object();
			source.id = id;
			source.display_name = display_name;
			
			facebook_sources.push(source);
		}
		
		function decrement_pending_request_count()
		{
			pending_request_count--;
			
			if(pending_request_count == 0)
			{				
				match_facebook_posts_with_sources();
				
				feed_posts.sort(function(a, b) {
					return (parseInt(b.timestamp) - parseInt(a.timestamp));
				});				
				
				feed_posts = feed_posts.slice(0, options.max_post_count);
				
				display_feed();
				
				options.callback(feed_posts);
			}
		}
		
		function match_facebook_posts_with_sources()
		{
			$.each(feed_posts, function(index, post) { 
			
				if(post.platform == 'facebook')
				{
					$.each(facebook_sources, function(index, source) { 											
						
						if(post.source_id == source.id)
						{
							post.display_name = source.display_name;							
						}
					});
				}
			});
		}
		
		function fetch_tweets(query)
		{
	    	url = 'http://search.twitter.com/search.json?q=' + query + '&rpp=100&callback=?';
		   	$.getJSON(url, function(data) {
		   		$.each(data.results, function(index, tweet) {
		   			timestamp = Date.parse(tweet['created_at']) / 1000;
		   			if(options.twitter_include_replies || tweet['text'].slice(0, 1) != '@')
		   			{			   				
		   				save_post('twitter', 'tweet', tweet['from_user'], tweet['from_user'], tweet['profile_image_url'], tweet['text'], timestamp);
		   			}
		   		});
		   		decrement_pending_request_count();
			});			
		}
		
		function fetch_tweets_from_usernames()
		{	    	
			if(options.twitter_posts_from_usernames.length == 0)
			{
				return;
			}
			
			query = 'from:' + options.twitter_posts_from_usernames.join('%20OR%20from:');
			fetch_tweets(query);
		}
		
		function fetch_tweets_mentioning_usernames()
		{	    	
			if(options.twitter_posts_mentioning_usernames.length == 0)
			{
				return;
			}
			
			query = '%40' + options.twitter_posts_mentioning_usernames.join('%20OR%20%40');
			fetch_tweets(query);
		}		
	
		function fetch_facebook_feed(feed_source_id)
		{
	    	url = 'https://graph.facebook.com/' + feed_source_id + '/feed?access_token=' + options.facebook_access_token + '&callback=?&limit=' + options.max_post_count;
	    	
		   	$.getJSON(url, function(response) {
		   		$.each(response.data, function(index, post) {
		   			if($.inArray(post['type'], options.facebook_post_types) >= 0)
		   			{
			   			post_source_id = feed_source_id;
			   			display_name = undefined;
			   			fetch_post_source_info = false;
			   			
			   			if(post['from'] != null)
			   			{
			   				post_source_id = post['from']['id'];
			   				display_name = post['from']['name'];
			   			}
			   			else
			   			{
			   				fetch_post_source_info = true;
			   			}

			   			if(options.facebook_post_source_ids.length == 0 || $.inArray(post_source_id, options.facebook_post_source_ids) >= 0)
			   			{		   				
				   			year = post['created_time'].substring(0, 4);
				   			month = parseInt(post['created_time'].substring(5, 7)) - 1;
				   			day = post['created_time'].substring(8, 10);
				   			hour = post['created_time'].substring(11, 13);
				   			minute = post['created_time'].substring(14, 16);
				   			
							delta_seconds = gmt_delta_seconds(post['created_time'].substring(post['created_time'].length - 5));							
							timestamp = Date.UTC(year, month, day, hour, minute, 0, 0) / 1000 - delta_seconds;
							
				   			extra_data = undefined;
				   			
				   			if(post['type'] == 'link')
				   			{
				   				extra_data = post['link'];
				   			}
				   			else if(post['type'] == 'photo')
				   			{
				   				extra_data = post['picture'];
				   			}
				   			
				   			if(fetch_post_source_info == true)
				   			{
				   				pending_request_count++;
				   				fetch_facebook_post_source_info(source_id);
				   			}
				   			
				   			avatar_url = 'https://graph.facebook.com/' + post_source_id + '/picture';
				   			
				   			save_post('facebook', post['type'], post_source_id, display_name, avatar_url, post['message'], timestamp, extra_data);
			   			}
		   			}
		   		});
		   		
		   		decrement_pending_request_count();
			});			
		}
		
		function fetch_facebook_post_source_info(source_id)
		{
	    	url = 'https://graph.facebook.com/' + source_id + '?callback=?';
	    	
		   	$.getJSON(url, function(response) {
		   		
		   		save_facebook_post_source(source_id, response['name']);
		   		decrement_pending_request_count();
			});				
		}
		
		function fetch_rss_feeds()
		{
			$.each(options.rss_urls, function(index, url) {
				fetch_rss_feed(url);			
			});
		}
		
		function fetch_rss_feed(url)
		{
			var feed = new google.feeds.Feed(url);
			
			feed.load(function(result) {
				
				if(!result.error) 
				{
					$.each(result.feed.entries, function(index, post) {

						delta_seconds = gmt_delta_seconds(post['publishedDate'].substring(post['publishedDate'].length - 5));
			   			timestamp = Date.parse(post['publishedDate']) / 1000;
			   			
						save_post('rss', 'post', post['link'], post['author'], options.rss_avatar_url, post['contentSnippet'], timestamp, post['title']);
					});
				}
				else
				{
					ff_error(result.error);
				}
				
				decrement_pending_request_count();
			});			
		}
		
		function ff_error(message)
		{
			if(options.debug_mode == true)
			{
				alert(message);
			}
		}
		
		// --------- let's get this party started --------- \\

		$.each(options.facebook_feed_from_ids, function(index, feed_source_id) {
			fetch_facebook_feed(feed_source_id);			
		});
		
		fetch_tweets_from_usernames();
		fetch_tweets_mentioning_usernames();

		if(options.initialize_google_with_api_key != undefined)
		{
			url = 'http://www.google.com/jsapi?async=2&key=' + options.initialize_google_with_api_key;
			
			$.getScript(url, function() {

				google.load("feeds", "1", {"nocss" : true, "callback" : function() {
					fetch_rss_feeds();
				}});
			});
		}
		else if(options.rss_urls.length > 0 && typeof google == 'undefined')
		{
			ff_error('Trying to get RSS feeds without the Google API initialized; please either set intialize_google_with_api_key or initialize the Google API before calling FeedFetcher');
			
			$.each(options.rss_urls, function(index, url) {
				decrement_pending_request_count();
			});
		}
		else
		{
			fetch_rss_feeds();
		}
		
		return elements;
	};
})(jQuery);
