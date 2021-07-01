chrome.extension.sendMessage({}, function() {
	try{
		var usn = document.getElementsByClassName('_7UhW9 fKFbl yUEEX KV-D4 fDxYl')[0].innerText;
	}catch(err){}
    //make sure the user is on the right profile
    if (window.location.href == "https://www.instagram.com/" + usn + "/") {
        // console.log(getBasicUserInformations());
        // console.log("------------------------");
        // console.log(getCurrendStory());
        // console.log("------------------------");
        // console.log(getHighlightStory());
        // console.log("------------------------");
        // console.log(getNewest12Images());
        // console.log("------------------------");
        chromeSendBgObjects();
    }
});

function getBasicUserInformations() {
    try {
        var username = document.getElementsByClassName('_7UhW9 fKFbl yUEEX KV-D4 fDxYl')[0].innerText;
        const userprofilrequestURL = 'https://www.instagram.com/' + username + '/?__a=1';

        var json_user_request = JSON.parse(GetJson(userprofilrequestURL));
        const userid = json_user_request['graphql']['user']['id'];
        
        // basic user info
        var userposts = json_user_request['graphql']['user']['edge_owner_to_timeline_media']['count'];
        var userfollowers = json_user_request['graphql']['user']['edge_followed_by']['count'];
        var userprofilimage = json_user_request['graphql']['user']['profile_pic_url_hd'];
        var fullname = json_user_request['graphql']['user']['full_name'];
        var description = json_user_request['graphql']['user']['biography'];

        // extended user info
        var business_category_name = json_user_request['graphql']['user']['business_category_name'];
        var business_account = json_user_request['graphql']['user']['is_business_account'];
        var private_account = json_user_request['graphql']['user']['is_private'];
        var verified_account = json_user_request['graphql']['user']['is_verified'];

        //generate object
        userdataarr = [];

        userdataarr.push({
        	uname: username,
           	uposts: userposts,
            ufollowers: userfollowers,
            uprofimg: userprofilimage,
            ufullname: fullname,
            udesc: description,
            busicatname: business_category_name,
            busiacc: business_account,
           	privacc: private_account,
            verifacc: verified_account
        });
        var userdataobj = JSON.stringify({userprofile: userdataarr});
        return userdataobj;
    } catch (err) {}
}

function getHighlightStory() {
    try {
        //get UserInformations
        var username = document.getElementsByClassName('_7UhW9 fKFbl yUEEX KV-D4 fDxYl')[0].innerText;
        const userprofilrequestURL = 'https://www.instagram.com/' + username + '/?__a=1';
        //get Userid 
        var json_user_request = JSON.parse(GetJson(userprofilrequestURL));
        const userid = json_user_request['graphql']['user']['id'];
        //get Profil important Story
        const highlight_story_profilURL = 'https://www.instagram.com/graphql/query/?query_hash=c9100bf9110dd6361671f113dd02e7d6&variables={"user_id":' + userid + ',"include_highlight_reels":true}';
        var json_highlight_story_request = JSON.parse(GetJson(highlight_story_profilURL));
        
        var highlgtlength = Object.keys(json_highlight_story_request['data']['user']['edge_highlight_reels']['edges']).length;
        var highlightarr = [];
        for(var i = 0; i < highlgtlength;i++){
        	highlightarr.push({
        			highlightid: json_highlight_story_request['data']['user']['edge_highlight_reels']['edges'][i]['node']['id'],
        			highlgtThumbnailSrc: json_highlight_story_request['data']['user']['edge_highlight_reels']['edges'][i]['node']['cover_media']['thumbnail_src'],
        			highlgtTitle: json_highlight_story_request['data']['user']['edge_highlight_reels']['edges'][i]['node']['title'],
        			highlgtlength: highlgtlength
        		});
        }

        var highlightstoryObj = JSON.stringify({highlightstory: highlightarr});
        return highlightstoryObj;
    } catch (err) {}
}

function getCurrendStory(){
	try {
		//get UserInformations
        var username = document.getElementsByClassName('_7UhW9 fKFbl yUEEX KV-D4 fDxYl')[0].innerText;
        const userprofilrequestURL = 'https://www.instagram.com/' + username + '/?__a=1';
        //get Userid 
        var json_user_request = JSON.parse(GetJson(userprofilrequestURL));
        const userid = json_user_request['graphql']['user']['id'];
		//get Profil Current Story
        const current_story_profilURL = 'https://www.instagram.com/graphql/query/?query_hash=1ae3f0bfeb29b11f7e5e842f9e9e1c85&variables={"reel_ids":["' + userid + '"],"tag_names":[],"location_ids":[],"highlight_reel_ids":[],"precomposed_overlay":false,"show_story_viewer_list":true,"story_viewer_fetch_count":50,"story_viewer_cursor":"","stories_video_dash_manifest":false}';
        var json_current_story_request = JSON.parse(GetJson(current_story_profilURL));

	    var currentstorylength = json_current_story_request['data']['reels_media'][0]['items'].length;
	    var currentarr = [];
	    for(var i = 0; i < currentstorylength;i++){
	    	currentarr.push({
	    		currstoryImgUrl: json_current_story_request['data']['reels_media'][0]['items'][i]['display_url'],
	    		currstoryviewers: json_current_story_request['data']['reels_media'][0]['items'][i]['story_view_count'],
	    		currstoryexpired: json_current_story_request['data']['reels_media'][0]['items'][i]['expiring_at_timestamp'],
	    		currstorycreated: json_current_story_request['data']['reels_media'][0]['items'][i]['taken_at_timestamp'],
	    		currstorylength: currentstorylength
	    	});
	    }

	    var currstoryObj = JSON.stringify({currentstory: currentarr});
	    return currstoryObj;
    } catch (err) {}
}

function getNewest12Images(){
	try{
		var username = document.getElementsByClassName('_7UhW9 fKFbl yUEEX KV-D4 fDxYl')[0].innerText;
	    const userprofilrequestURL = 'https://www.instagram.com/' + username + '/?__a=1';

	    var json_user_request = JSON.parse(GetJson(userprofilrequestURL));
	    const userid = json_user_request['graphql']['user']['id'];

		//get first12 pictures of Profile
	    const userprofildatarequestURL = 'https://www.instagram.com/graphql/query/?query_hash=2c5d4d8b70cad329c4a6ebe3abb6eedd&variables={"id":' + userid + ',"first":50}';
	    var json_user_data_request = JSON.parse(GetJson(userprofildatarequestURL));
		
		var userimagelength = json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'].length;
		var newestimgarr = [];
		for(var i=0; i<userimagelength;i++){
			if(json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_caption']['edges'].length != 0  && 
				json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['location'] != null){

				newestimgarr.push({
					img_likes: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_preview_like']['count'],
					img_comments: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_comment']['count'],
					is_video: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['is_video'],
					img_taken_at: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['taken_at_timestamp'],
					display_url: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['display_url'],
					img_description: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_caption']['edges'][0]['node']['text'],
					location: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['location']['name'],
					userimagelength: userimagelength
				});
			}else{
				if(json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_caption']['edges'].length == 0
					&& json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['location'] == null){

					newestimgarr.push({
						img_likes: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_preview_like']['count'],
						img_comments: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_comment']['count'],
						is_video: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['is_video'],
						img_taken_at: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['taken_at_timestamp'],
						display_url: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['display_url'],
						img_description: "",
						location: "",
						userimagelength: userimagelength
					});
				}else{
					if(json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_caption']['edges'].length == 0){

					newestimgarr.push({
						img_likes: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_preview_like']['count'],
						img_comments: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_comment']['count'],
						is_video: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['is_video'],
						img_taken_at: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['taken_at_timestamp'],
						display_url: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['display_url'],
						img_description: "",
						location: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['location']['name'],
						userimagelength: userimagelength
					});
				}else if(json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['location'] == null){

					newestimgarr.push({
						img_likes: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_preview_like']['count'],
						img_comments: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_comment']['count'],
						is_video: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['is_video'],
						img_taken_at: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['taken_at_timestamp'],
						display_url: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['display_url'],
						img_description: json_user_data_request['data']['user']['edge_owner_to_timeline_media']['edges'][i]['node']['edge_media_to_caption']['edges'][0]['node']['text'],
						location: "",
						userimagelength: userimagelength
					});
				}
				}
			}
		}
		
		var newestImgObj = JSON.stringify({top12Images: newestimgarr});
		return newestImgObj;
	}catch(err){
		console.log(err);
	}
}

function chromeSendBgObjects() {
    chrome.runtime.sendMessage(getBasicUserInformations(), function(response) {
        console.log("Profile [JSON Object] sendet at background.js");
    });

    chrome.runtime.sendMessage(getCurrendStory(), function(response) {
        console.log("CurrentStory [JSON Object] sendet at background.js");
    });

    chrome.runtime.sendMessage(getHighlightStory(), function(response) {
        console.log("HighlightStory [JSON Object] sendet at background.js");
    });

    chrome.runtime.sendMessage(getNewest12Images(), function(response) {
        console.log("Top12Images [JSON Object] sendet at background.js");
    });
}

function GetJson(url) {
	try{
	    var Httpreq = new XMLHttpRequest();
	    Httpreq.open("GET", url, false);
	    Httpreq.send(null);
	    return Httpreq.responseText;
	}catch(err){}
}