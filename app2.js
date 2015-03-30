$(document).ready( function() {
	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		getAnswerers(tags);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(user) {
	
	// clone our result template code
	var result = $('.templates .answerer').clone();
	
	// set the user's display image
	var userImg = result.find('.profile_image img');
	userImg.attr("src", user.user.profile_image);
	userImg.attr("width", "50px");

	// set the user's display name and link to his profile
	console.log(user.user.link);
	var userLink = result.find('.display_name a');
	userLink.attr('href', user.user.link);
	userLink.text(user.user.display_name);

	// set the user's number of post
	var postCount = result.find('.post_count');
	postCount.text(user.post_count);

	// set the user's reputation point
	var reputation = result.find('.reputation');
	reputation.text(user.user.reputation);

	return result;
};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of a tag to be searched for on StackOverflow
var getAnswerers = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {site: 'stackoverflow'};
	var period = 'all_time';

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers/" + period,
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		console.log(result);
		var searchResults = showSearchResults(tags, result.items.length);
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var answerer = showAnswerer(item);
			$('.results').append(answerer);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};