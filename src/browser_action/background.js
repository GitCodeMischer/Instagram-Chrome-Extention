//on popup tab (icon) click, the tab refresh
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	var url = tabs[0].url;
	if(url.includes("https://www.instagram.com")){
	  chrome.tabs.reload(tabs[0].id);
	}else{
		document.getElementsByClassName('content')[0].style.display = 'none';
		document.getElementById('container').style.display = 'block';
		document.getElementsByTagName('body')[0].style.setProperty('width','400px');
	}
});

try{
	// if(localStorage.getItem('hasLoadedOnce') == 'true'){
		setUserProfileData();
		setHighlightStoryData();
		setCurrentStoryData();
		setTop12ImagesData();
		setExtraInformationData();
	// }
}catch(err){}

chrome.runtime.onMessage.addListener(
	function(userdataobj) {
		try{
			var jsonparsed = JSON.parse(userdataobj);
			if(jsonparsed != null || jsonparsed != undefined){
				window.localStorage.setItem("hasLoadedOnce","true");
				if(jsonparsed.hasOwnProperty('userprofile')){
					setUserProfileIntoLocalStorage(jsonparsed);
					setUserProfileData();
				}else if(jsonparsed.hasOwnProperty('currentstory')){
					setCurrentStoryIntoLocalStorage(jsonparsed);
					setCurrentStoryData();
				}
				else if(jsonparsed.hasOwnProperty('highlightstory')){
					setHighlightStoryIntoLocalStorage(jsonparsed);
					setHighlightStoryData();
				}
				else if(jsonparsed.hasOwnProperty('top12Images')){
					setTop12ImagesIntoLocalStorage(jsonparsed);
					setTop12ImagesData();
					setExtraInformationsIntoLocalStorage(jsonparsed);
					setExtraInformationData();
				}
			}else{
				//temporary Solution
				window.localStorage.setItem('currstorylength', "Not Available (Empty)");
				document.getElementById('currlength').innerText = localStorage.getItem('currstorylength');
				window.localStorage.setItem('currstoryexpired', "0");
				document.getElementById('currexpiered').innerText = localStorage.getItem('currstoryexpired');
				window.localStorage.setItem('currstorycreated', "0");
				document.getElementById('currcreated').innerText = localStorage.getItem('currstorycreated');
				window.localStorage.setItem('currstoryImgUrl', "0");
				document.getElementById('currimgurl').innerText = localStorage.getItem('currstoryImgUrl');
			}
		}catch(err){}
	}
);

function setUserProfileIntoLocalStorage(jsonparsed){
	window.localStorage.setItem('uname', jsonparsed.userprofile[0].uname);
	window.localStorage.setItem('uposts', jsonparsed.userprofile[0].uposts);
	window.localStorage.setItem('ufollowers', jsonparsed.userprofile[0].ufollowers);
	window.localStorage.setItem('uprofimg', jsonparsed.userprofile[0].uprofimg);
	window.localStorage.setItem('ufullname', jsonparsed.userprofile[0].ufullname);
	window.localStorage.setItem('udesc', jsonparsed.userprofile[0].udesc);
	window.localStorage.setItem('busicatname', jsonparsed.userprofile[0].busicatname);
	window.localStorage.setItem('busiacc', jsonparsed.userprofile[0].busiacc);
	window.localStorage.setItem('privacc', jsonparsed.userprofile[0].privacc);
	window.localStorage.setItem('verifacc', jsonparsed.userprofile[0].verifacc);
}

function setCurrentStoryIntoLocalStorage(jsonparsed) {
	// var viewerarr=[];
	var expiredarr=[];
	var createdarr=[];
	var imgurlarr=[];

	for(var i=0;i<jsonparsed.currentstory[0].currstorylength;i++){
		// viewerarr[i] = jsonparsed.currentstory[i].currstoryviewers;
		expiredarr[i] = i +")"+(timeConverter(jsonparsed.currentstory[i].currstoryexpired));
		createdarr[i] = i +")"+(timeConverter(jsonparsed.currentstory[i].currstorycreated));
		imgurlarr[i] = i + ")"+jsonparsed.currentstory[i].currstoryImgUrl;
	}

	// window.localStorage.setItem('currstoryviewers', viewerarr);
	window.localStorage.setItem('currstoryexpired', expiredarr);
	window.localStorage.setItem('currstorycreated', createdarr);
	window.localStorage.setItem('currstoryImgUrl', imgurlarr);
	window.localStorage.setItem('currstorylength', jsonparsed.currentstory[0].currstorylength);
}

function setHighlightStoryIntoLocalStorage(jsonparsed) {
	var arr = [];
	var src = [];
	 if(jsonparsed.highlightstory[0] != undefined){
		for(var i = 0;i<jsonparsed.highlightstory[0].highlgtlength;i++){
			arr[i] = jsonparsed.highlightstory[i].highlgtTitle;
			src[i] = jsonparsed.highlightstory[i].highlgtThumbnailSrc;	}
		window.localStorage.setItem('highlgtTitle', arr);
		window.localStorage.setItem('highlgtThumbnailSrc', src);
		window.localStorage.setItem('highlgtlength', jsonparsed.highlightstory[0].highlgtlength);
	 }else{
	 	window.localStorage.setItem('highlgtTitle', "Not Available (Empty)");
	 	window.localStorage.setItem('highlgtThumbnailSrc', "Not Available (Empty)");
	 	window.localStorage.setItem('highlgtlength',"Not Available (Empty)");
	 }
}
function setTop12ImagesIntoLocalStorage(jsonparsed) {
	var likearr = [];
	var commarr= [];
	var sumlikes = 0;
	var sumcomm = 0;
	var videofilterarr = [];
	var createdat = [];

	if(jsonparsed.top12Images[0] != undefined){
		for(var i=0;i<jsonparsed.top12Images[0].userimagelength;i++){
			likearr[i] = jsonparsed.top12Images[i].img_likes;
			sumlikes+=likearr[i]; 
			commarr[i] = jsonparsed.top12Images[i].img_comments;
			sumcomm+=commarr[i];
			videofilterarr[i] = jsonparsed.top12Images[i].is_video;
			createdat[i] = timeConverter(jsonparsed.top12Images[i].img_taken_at);
		}
		var videos = videofilterarr.filter(v =>v).length;
		var images = jsonparsed.top12Images[0].userimagelength-videos;
		window.localStorage.setItem('img_likes', sumlikes);
		window.localStorage.setItem('img_comments', sumcomm);
		window.localStorage.setItem('videos', videos + " Videos");
		window.localStorage.setItem('images', images + " Images");
		window.localStorage.setItem('takenat', createdat);
	}else{
		window.localStorage.setItem('img_likes','0');
		window.localStorage.setItem('img_comments','0');
		window.localStorage.setItem('videos', "0");
		window.localStorage.setItem('images', "0");
		window.localStorage.setItem('takenat',"0");
	}
}

function setExtraInformationsIntoLocalStorage(jsonparsed){
	var hashtagsarr = [];
	var mentionedarr = [];
	var locationarr = [];
	var imageurlarr = [];
	var imageviewarr = [];
	if(jsonparsed.top12Images[0] != undefined){
		for(var i=0;i<jsonparsed.top12Images[0].userimagelength;i++){
			hashtagsarr[i] = jsonparsed.top12Images[i].img_description.match(/(\#\w+\b)/ig)+"\n";
			mentionedarr[i] = jsonparsed.top12Images[i].img_description.match(/(\@\w+\b)/ig);
			locationarr[i] = jsonparsed.top12Images[i].location;
			imageurlarr[i] = jsonparsed.top12Images[i].display_url;
			imageviewarr[i] = "<img class='imgradius-none' src="+jsonparsed.top12Images[i].display_url+" width='200px'></img>";
		}
		window.localStorage.setItem('usedhashtag', hashtagsarr);
		window.localStorage.setItem('peoplementioned', mentionedarr);
		window.localStorage.setItem('location', locationarr);
		window.localStorage.setItem('imageurl', imageurlarr);
		window.localStorage.setItem('imageview',imageviewarr);
	}else{
		window.localStorage.setItem('usedhashtag', "0");
		window.localStorage.setItem('peoplementioned', "0");
		window.localStorage.setItem('imageurl', "0");
		window.localStorage.setItem('imageview',"0");
	}
}

function setUserProfileData(){

	//number decimal formatter
	const formatter = new Intl.NumberFormat('en',{
		  style: 'decimal',
		  notation: 'compact',
		  maximumFractionDigits:2
	});

	document.getElementById('profildesc').innerText = localStorage.getItem('udesc');
	document.getElementById('username').innerText = localStorage.getItem('ufullname') +" ("+localStorage.getItem('uname')+")";
	document.getElementById('userimage').src = localStorage.getItem('uprofimg');
	document.getElementById('userfollows').innerText = formatter.format(localStorage.getItem('ufollowers')) +" Followers";
	document.getElementById('userposts').innerText = formatter.format(localStorage.getItem('uposts')) + " Posts";

	if(localStorage.getItem('busicatname') == 'null'){
		document.getElementById('businesscatname').innerText = "Not Available (Empty)";
	}else{
		document.getElementById('businesscatname').innerText = localStorage.getItem('busicatname');
	}
	
	if(localStorage.getItem('privacc') == 'true'){
		document.getElementById('privateacc').innerText = "Yes";
	}else{
		document.getElementById('privateacc').innerText = "No";
	}

	if(localStorage.getItem('busiacc') == 'true'){
		document.getElementById('businessacc').innerText = "Yes";
	}else{
		document.getElementById('businessacc').innerText = "No";
	}

	if(localStorage.getItem('verifacc') == 'true'){
		document.getElementById('verifiedacc').innerText = "Yes";
	}else{		
		document.getElementById('verifiedacc').innerText = "No";
	}
	
}

function setCurrentStoryData(){
	// document.getElementById('currviewers').innerText = localStorage.getItem('currstoryviewers');
	document.getElementById('currexpiered').innerText = localStorage.getItem('currstoryexpired');
	document.getElementById('currcreated').innerText = localStorage.getItem('currstorycreated');
	document.getElementById('currimgurl').innerText = localStorage.getItem('currstoryImgUrl');
	document.getElementById('currlength').innerText = localStorage.getItem('currstorylength');
}

function setHighlightStoryData(){
	document.getElementById('highlgttitle').innerText = localStorage.getItem('highlgtTitle');
	document.getElementById('highlgtthumbnailsrc').innerText = localStorage.getItem('highlgtThumbnailSrc');
	document.getElementById('Highlightlength').innerText = localStorage.getItem('highlgtlength');
}

function setTop12ImagesData(){
	//number decimal formatter
	const formatter = new Intl.NumberFormat('en',{
		  style: 'decimal',
		  notation: 'compact',
		  maximumFractionDigits:3
	});

	document.getElementById('summlikes').innerText = formatter.format(localStorage.getItem('img_likes'));
	document.getElementById('summcomments').innerText = formatter.format(localStorage.getItem('img_comments'));
	document.getElementById('summvideos').innerText = localStorage.getItem('videos');
	document.getElementById('summimages').innerText = localStorage.getItem('images');
	document.getElementById('createdat').innerText = localStorage.getItem('takenat');
}

function setExtraInformationData(){
	var hastags = localStorage.getItem('usedhashtag');
	var notredundantHashtag = Array.from(new Set(hastags.split(','))).toString();
	document.getElementById('usedhashtag').innerText = notredundantHashtag;
	var mentions = localStorage.getItem('peoplementioned');
	var notredundantMentions = Array.from(new Set(mentions.split(','))).toString();
	document.getElementById('peoplementioned').innerText = notredundantMentions;
	var locations = localStorage.getItem('location');
	var notredundantLocs = Array.from(new Set(locations.split(','))).toString();
	document.getElementById('location').innerText = notredundantLocs;
	document.getElementById('imageurl').innerText = localStorage.getItem('imageurl');
	document.getElementById('imageview').innerHTML = localStorage.getItem('imageview').split(",");
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

// textbox copy all text
var hashtagtbox = document.getElementById("usedhashtag");
hashtagtbox.addEventListener("focus", HashtagCopyToClipboard); 

var mentionedtbox = document.getElementById("peoplementioned");
mentionedtbox.addEventListener("focus", MentionedCopyToClipboard);

var locationtbox = document.getElementById("location");
locationtbox.addEventListener("focus", LocationCopyToClipboard);

function HashtagCopyToClipboard() {
	hashtagtbox.select();
	document.execCommand("copy");
  	document.getElementById("usedhashtag").style.backgroundColor = "#d92248";
}

function MentionedCopyToClipboard() {
	mentionedtbox.select();
	document.execCommand("copy");
  	document.getElementById("peoplementioned").style.backgroundColor = "#d92248";
}

function LocationCopyToClipboard() {
	locationtbox.select();
	document.execCommand("copy");
  	document.getElementById("location").style.backgroundColor = "#d92248";
}