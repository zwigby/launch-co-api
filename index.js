var $ = require('cheerio'),
    request = require('request'),
    express = require('express'),
    app = express();

var FIVE_MINUTES = 300000;
var URL = 'http://launch.co';

var stories = [];

var Story = function() {
  this.id = '';
  this.author = '';
  this.text = '';
  this.time = '';
  this.permalink = '';
  this.sticky = 0;
  this.comments = [];
};

var updateStories = function() {
  request(URL, function(err, resp, html) {
    stories = [];
    if (err) return console.error(err);
    var parsedHTML = $.load(html, {ignoreWhitespace: true});
    parsedHTML('#stories li').map(function(i, story) {
      var ns = new Story();
      ns.id = story.data.messageId;
      ns.author = story.data.name;
      ns.text = $(this).find('.message-body .middle').html();
      ns.time = story.data.timestamp;
      ns.permalink = unescape(story.data.permalink);
      ns.sticky = parseInt(story.data.sticky);
      stories.push(ns);
    });
    setTimeout(updateStories, FIVE_MINUTES);
  });
};

app.get('/stories', function(req, res) {
  res.json(stories);
});

updateStories();

app.listen(process.env.PORT || 9000);
