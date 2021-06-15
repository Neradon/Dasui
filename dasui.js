var version = "1.7";
var mousedownlocation = {x:0,y:0};

function mousedowntest(e){
	mousedownlocation.x = e.clientX;
	mousedownlocation.y = e.clientY;
}


loadFriends = function(_list){
	onlineFriends = _list.filter(function(a){
		return a.UserIsOnline === true;
	});
	
	offlineFriends = _list.filter(function(a){
		return a.UserIsOnline === false;
	});
		 
    onlineFriends.sort(function(a, b){
		return a.UserName.toLowerCase().localeCompare(b.UserName.toLowerCase());
    });
	
	offlineFriends.sort(function(a, b){
		return a.UserName.toLowerCase().localeCompare(b.UserName.toLowerCase());
    });
	

	friendList = onlineFriends.concat(offlineFriends);

        
    for (var i=0; i < friendList.length; i++){
        friendList[i].FilterTags += ','+(friendList[i].UserIsOnline?'frndonline':'frndoffline');
    }


    renderFriends(friendList);






    // friendList = _list;
    
    // for (var i=0; i < friendList.length; i++){
    //     friendList[i].FilterTags += ','+(friendList[i].UserIsOnline?'frndonline':'frndoffline');
    // }
    
    // renderFriends(_list);

}



renderFriends = function(_list){
    var contentList = document.querySelector('#friends .list-content');

    var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){
        // if(i%5 === 0){
        //     if(i !== 0){
        //         html += '</div>';
        //     }
        //     html += '<div class="content-row">';
        // }

        html += '<div data-id="'+_list[i].UserId+'" class="content-cell friend" onclick="getUserDetailsNew(\''+_list[i].UserId+'\',event);" onmousedown="mousedowntest(event);"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><div class="online-state-test '+(_list[i].UserIsOnline?'online':'offline')+' '+_list[i].FilterTags+'">'+
                '<img class="content-image online-state-image '+(_list[i].OnlineState?'online':'offline')+'" src="'+
                _list[i].UserImageUrl+'"></div><div class="content-name">'+
                _list[i].UserName+'</div></div>'+
                '</div>';
    }

    html += '</div>';

    contentList.innerHTML = html;
}

	document.querySelector('#user-detail .block-btn').insertAdjacentHTML('afterEnd','<div class="toolbar-btn mute-btn"><img src="gfx/user-mute.svg">Mute</div>');
	document.querySelector('#user-detail .block-btn').classList.remove("disabled");

loadUserDetails = function(_data, _profile){
    PlayerData = _data;
    var detailPage = document.getElementById('user-detail');

    document.querySelector('#user-detail h1').innerHTML = 'Profile: '+_data.UserName;

    document.querySelector('#user-detail .online-state').className = 'online-state '+(_data.OnlineState?'online':'offline');
    document.querySelector('#user-detail .profile-image').src = _data.UserImageUrl;
    document.querySelector('#user-detail .user-sidebar h2').innerHTML = _data.UserName;
    document.querySelector('#user-detail .user-sidebar h3').innerHTML = _data.UserRank;

    document.querySelector('#user-detail .profile-badge img').src = _data.FeaturedBadgeImageUrl;
    document.querySelector('#user-detail .profile-badge p').innerHTML = _data.FeaturedBadgeName;

    document.querySelector('#user-detail .profile-group img').src = _data.FeaturedGroupImageUrl;
    document.querySelector('#user-detail .profile-group p').innerHTML = _data.FeaturedGroupName;

    document.querySelector('#user-detail .profile-avatar img').src = _data.CurrentAvatarImageUrl;
    document.querySelector('#user-detail .profile-avatar p').innerHTML = _data.CurrentAvatarName;
    document.querySelector('#user-detail .profile-avatar img').setAttribute('onclick', 'GetAvatarDetails(\''+_data.CurrentAvatarId+'\');');

    var friendBtn = document.querySelector('#user-detail .friend-btn');
    if(_data.IsFriend){
        friendBtn.setAttribute('onclick', 'unFriend(\''+_data.UserId+'\');');
        friendBtn.innerHTML = '<img src="gfx/unfriend.svg">Unfriend';
    }else{
        friendBtn.setAttribute('onclick', 'addFriend(\''+_data.UserId+'\');');
        friendBtn.innerHTML = '<img src="gfx/friend.svg">Add Friend';
    }

    var blockBtn = document.querySelector('#user-detail .block-btn');
    if(_profile.userAvatarVisibility == 0){
        blockBtn.setAttribute('onclick', 'showAvatar();');
        blockBtn.innerHTML = '<img src="gfx/unblock.svg">Show';
    }else{
        blockBtn.setAttribute('onclick', 'hideAvatar();');
        blockBtn.innerHTML = '<img src="gfx/block.svg">Hide';
    }

	
    var muteBtn = document.querySelector('#user-detail .mute-btn');
    if(_profile.mute){
        muteBtn.setAttribute('onclick', 'unMute();');
        muteBtn.innerHTML = '<img src="gfx/user-unmute.svg">Unmute';
    }else{
        muteBtn.setAttribute('onclick', 'mute();');
        muteBtn.innerHTML = '<img src="gfx/user-mute.svg">Mute';
    }
	

    var kickBtn = document.querySelector('#user-detail .kick-btn');
    kickBtn.setAttribute('onmousedown', 'kickUser(\''+_data.UserId+'\');');

    var moderationView = document.querySelector('#user-detail .user-settings-dialog');
    
    var userSettingsTools = '<p>User Settings</p><div class="action-btn" onclick="hideUserSettings();">Back</div>';
    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Mute Player:</div>\n' +
        '                            <div class="option-input">\n' +
        '                                <div id="SelfModerationMute" class="inp_toggle" data-current="' + (_profile.mute?'True':'False') + 
                                        '" data-saveOnChange="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>';

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Voice Volume:</div>\n' +
        '                            <div class="option-input">\n' +
        '                              <div id="SelfModerationVolume" class="inp_slider" data-min="0" data-max="100" data-current="' + (_profile.voiceVolume * 100) + '" data-saveOnChange="true" data-continuousUpdate="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>';

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Players Avatar:</div>\n' +
        '                            <div class="option-input">\n' +
        '                                <div id="SelfModerationUsersAvatars" class="inp_dropdown" data-options="0:Hide,1:Use content filter,2:Show" data-current="' + (_profile.userAvatarVisibility) + '" data-saveOnChange="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>'

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Current Avatar:</div>\n' +
        '                            <div class="option-input">\n' +
        '                                <div id="SelfModerationAvatar" class="inp_dropdown" data-options="0:Hide,1:Use content filter,2:Show" data-current="' + (_profile.avatarVisibility) + '" data-saveOnChange="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>'

    moderationView.innerHTML = userSettingsTools;

    userProfileMute = new inp_toggle(document.getElementById('SelfModerationMute'));
    userProfileVolume = new inp_slider(document.getElementById('SelfModerationVolume'));
    userProfilePlayerAvatarsBlocked = new inp_dropdown(document.getElementById('SelfModerationUsersAvatars'));
    userProfileAvatarBlocked = new inp_dropdown(document.getElementById('SelfModerationAvatar'));

    moderationView.classList.add('hidden');
    
    detailPage.classList.remove('hidden');
    detailPage.classList.add('in');

    updateUserDetailsActivity(_data.Instance, _data.Users);
}

function hideAvatar(){
	engine.call('CVRAppCallSaveSetting', "SelfModerationUsersAvatars", "0");
	var blockBtn = document.querySelector('#user-detail .block-btn');
	        blockBtn.setAttribute('onclick', 'showAvatar();');
        blockBtn.innerHTML = '<img src="gfx/unblock.svg">Show';
}

function showAvatar(){
	engine.call('CVRAppCallSaveSetting', "SelfModerationUsersAvatars", "1");
		var blockBtn = document.querySelector('#user-detail .block-btn');
		        blockBtn.setAttribute('onclick', 'hideAvatar();');
        blockBtn.innerHTML = '<img src="gfx/block.svg">Hide';

}
function mute(){
		engine.call('CVRAppCallSaveSetting', "SelfModerationMute", "True");
		    var muteBtn = document.querySelector('#user-detail .mute-btn');
			        muteBtn.setAttribute('onclick', 'unMute();');
        muteBtn.innerHTML = '<img src="gfx/user-unmute.svg">Unmute';

}

function unMute(){
			engine.call('CVRAppCallSaveSetting', "SelfModerationMute", "False");
		    var muteBtn = document.querySelector('#user-detail .mute-btn');
        muteBtn.setAttribute('onclick', 'mute();');
        muteBtn.innerHTML = '<img src="gfx/user-mute.svg">Mute';
}



function getUserDetailsNew(_uid,e){
	// uiPushShow(game_settings["GeneralClockFormat"], 2, 1);
	// window["localStorage"].setItem("test","wololo");
	// document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";

	/*
	if(isJson(game_settings["GeneralClockFormat"])){
		var testpog = JSON.parse(game_settings["GeneralClockFormat"]);
		if(typeof testpog.timeformat === "undefined"){
			testpog = {};
			testpog.timeformat = 24;
		}
		testpog.pog = "it works";
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
	}
	else{
		var testpog = {timeformat:24};
		testpog.pog = "it works";
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
	}
*/
	var dif = {x:0,y:0};
	dif.x = e.clientX - mousedownlocation.x;
	dif.y = e.clientY - mousedownlocation.y;
	if(mousedownlocation.x === 0 && mousedownlocation.y === 0){
		dif = {x:0,y:0};
	}
	// document.querySelector("#debug-display").innerHTML = dif.x+"|"+dif.y;
	// document.querySelector("#debug-display").innerHTML = document.cookie;
	// document.querySelector("#debug-display").innerHTML = window["localStorage"].getItem("test");
	if(Math.abs(dif.x) > 50 || Math.abs(dif.y) > 50){
		return;
	}
	mousedownlocation = {x:0,y:0};
	
    engine.call('CVRAppCallGetUserDetails', _uid);
    if(debug){
        loadUserDetails(
            {Guid: 'AAAA', OnlineState: false,  PlayerImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', PlayerName: 'Testuser',
             IsFriend: true, IsBlocked: false, IsMuted: false},
            {WorldImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', WorldName: 'Testworld', GameMode: 'Social', MaxPlayer: 64,
             CurrentPlayer: 4, IsInPrivateLobby: false},
            [{Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'},
             {Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'},
             {Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'},
             {Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'},
             {Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'},
             {Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'},
             {Guid: 'AAAA', OnlineState: true,  UserImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png', UserName: 'Testuser'}]
        );
    }
}

function isJson(str) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return false;
            }
        }

renderWorlds = function(_list){
    var contentList = document.querySelector('#worlds .list-content');

    var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){
        // if(i%5 === 0){
        //     if(i !== 0){
        //         html += '</div>';
        //     }
        //     html += '<div class="content-row">';
        // }

/*
        html += '<div class="content-cell-new world" onclick="getWorldDetails(\''+_list[i].Guid+'\');" onmousedown="mousedowntest(event);">'+
                '<img class="content-image-new" src="'+
                _list[i].WorldImageUrl+'">'+
                '<div class="content-cell-new-bottomtext">'+ _list[i].WorldName +'</div></div>';
				*/
				
		html += '<div data-id="'+_list[i].WorldId+'" class="content-cell friend" onclick="getWorldDetailsNew(\''+_list[i].WorldId+'\',event);" onmousedown="mousedowntest(event);"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><div class="online-state-test">'+
                '<img class="content-image" src="'+
                _list[i].WorldImageUrl+'"></div><div class="content-name world">'+
                _list[i].WorldName+'</div></div>'+
				'</div>';

       
    }

    html += '</div>';
    
    contentList.innerHTML = html;
}

function getWorldDetailsNew(_uid,e){
	
		var dif = {x:0,y:0};
	dif.x = e.clientX - mousedownlocation.x;
	dif.y = e.clientY - mousedownlocation.y;
	if(mousedownlocation.x === 0 && mousedownlocation.y === 0){
		dif = {x:0,y:0};
	}
	// document.querySelector("#debug-display").innerHTML = dif.x+"|"+dif.y;
	// document.querySelector("#debug-display").innerHTML = document.cookie;
	// document.querySelector("#debug-display").innerHTML = window["localStorage"].getItem("test");
	if(Math.abs(dif.x) > 50 || Math.abs(dif.y) > 50){
		return;
	}
	mousedownlocation = {x:0,y:0};
	
	
    engine.call('CVRAppCallGetWorldDetails', _uid);
    if(debug){
        loadWorldDetails({WorldName: 'Testworld', AdminTags: '', SafetyTags: 'SFW', AuthorName: 'Khodrin', AuthorGuid: 'AAAA',
            Guid: 'AAAA', AuthorImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/ProfilePictures/Khodrin.png',
            WorldImageUrl: 'https://abis3.fra1.digitaloceanspaces.com/Worlds/b1d2ac7c-4074-4804-abd5-3fe2fe12680c.png',
            WorldDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel tellus eget mauris vestibulum tempus at sed felis. Pellentesque vitae sapien non sapien sagittis ultrices sed quis odio. Quisque ac rutrum nunc. Nulla cursus volutpat lectus, eget consectetur enim fermentum eu. Etiam sodales posuere magna ac dictum. Phasellus laoreet purus sollicitudin pretium vehicula. Aenean ullamcorper in mauris ultrices ornare. Aliquam elementum lacus vel enim blandit, quis pretium urna fringilla. Aliquam sagittis venenatis mi et tristique. Mauris a pulvinar dolor. Nam nec pharetra erat, in molestie ipsum. Proin sed justo sed sem elementum faucibus non nec ex.',
            UploadedAt: '2020-01-01', UpdatedAt: '2020-01-20', WorldSize: '20MB'
        },
        [{Guid: 'AAAA', CurrentPlayerCount: 24, InstanceName: 'Sauerkraut der Zukunft#945623', InstanceRegion: 'EU'}],
        []);
    }
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = ({}).constructor;

function whatIsIt(object) {
    if (object === null) {
        return "null";
    }
    if (object === undefined) {
        return "undefined";
    }
    if (object.constructor === stringConstructor) {
        return "String";
    }
    if (object.constructor === arrayConstructor) {
        return "Array";
    }
    if (object.constructor === objectConstructor) {
        return "Object";
    }
    {
        return "don't know";
    }
}



updateTime = function(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();

  h = checkTime(h);
  m = checkTime(m);
  
  if(game_settings && game_settings['GeneralClockFormat']){
	if(!isJson(game_settings['GeneralClockFormat'])){
		var testpog = {};
		testpog.timeformat = 24;
		game_settings['GeneralClockFormat'] = JSON.stringify(testpog);
	}
	var parsed = JSON.parse(game_settings['GeneralClockFormat']);
	if(typeof parsed.timeformat === "undefined"){
		parsed.timeformat = 24;
		game_settings['GeneralClockFormat'] = JSON.stringify(parsed);
	}
	if(parsed.timeformat != '24'){
      document.querySelector('.time-display').innerHTML = h%12+':'+m+' '+(h >= 12 ? 'PM' : 'AM');
  }else{
      document.querySelector('.time-display').innerHTML = h+':'+m;
  }
  } 

}

window.clearInterval(4);
window.setInterval(updateTime, 1000);


inp_dropdown = function(_obj){
    this.obj = _obj;
    this.value    = _obj.getAttribute('data-current');
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.options  = _obj.getAttribute('data-options').split(',');
    this.name = _obj.id;
    this.opened = false;
    this.keyValue = [];
    this.type = _obj.getAttribute('data-type');

    this.optionElements = [];

    var self = this;

    this.SelectValue = function(_e){
        self.value = _e.target.getAttribute('data-key');
        self.valueElement.innerHTML = _e.target.getAttribute('data-value');
        self.globalClose();

        if(self.saveOnChange){
            if(self.type == 'avatar'){
                changeAnimatorParam(self.name.replace('AVS_', ''), parseFloat(self.value));
            }else {
				if(self.name == "GeneralClockFormat"){
					var parsed;
					if(isJson(game_settings["GeneralClockFormat"])){
						parsed = JSON.parse(game_settings["GeneralClockFormat"]);
					}
					else{
						parsed = {timeformat:24};
					}
					if(whatIsIt(parsed) != "Object"){
						parsed = {timeformat:24,hiddenFriendNotifications:[]};
					}
					parsed.timeformat = self.value;
					var stringed = JSON.stringify(parsed);
					engine.call('CVRAppCallSaveSetting', self.name, stringed);
					game_settings[self.name] = stringed;
				}
				else{
					engine.call('CVRAppCallSaveSetting', self.name, self.value);
					game_settings[self.name] = self.value;
				}

            }
        }
    }

    this.openClick = function(_e){
      if(self.obj.classList.contains('open')){
        self.obj.classList.remove('open');
        self.list.setAttribute('style', 'display: none;');
      }else{
        self.obj.classList.add('open');
        self.list.setAttribute('style', 'display: block;');
        self.opened = true;
        window.setTimeout(function(){self.opened = false;}, 10);
      }
    }

    this.globalClose = function(_e){
      if(self.opened) return;
      self.obj.classList.remove('open');
      self.list.setAttribute('style', 'display: none;');
    }

    this.list = document.createElement('div');
    this.list.className = 'valueList';
    
    this.updateOptions = function(){
		self.list.innerHTML = "";
        for(var i = 0; i < self.options.length; i++){
            self.optionElements[i] = document.createElement('div');
            self.optionElements[i].className = 'listValue';
            var valuePair = Array.isArray(self.options[i])?self.options[i]:self.options[i].split(':');
            var key = "";
            var value = "";
            if(valuePair.length == 1){
                key = valuePair[0];
                value = valuePair[0];
            }else{
                key = valuePair[0];
                value = valuePair[1];
            }
            self.keyValue[key] = value;
            self.optionElements[i].innerHTML = value;
            self.optionElements[i].setAttribute('data-value', value);
            self.optionElements[i].setAttribute('data-key', key);
            self.list.appendChild(self.optionElements[i]);
            self.optionElements[i].addEventListener('mousedown', self.SelectValue);
        }

        self.valueElement.innerHTML = self.keyValue[self.value];
    }

    this.valueElement = document.createElement('div');
    this.valueElement.className = 'dropdown-value';
    
    this.updateOptions();

    this.obj.appendChild(this.valueElement);
    this.obj.appendChild(this.list);
    this.valueElement.addEventListener('mousedown', this.openClick);
    document.addEventListener('mousedown', this.globalClose);

    this.getValue = function(){
        return self.value;
    }

    this.updateValue = function(value){
        self.value = value;
        self.valueElement.innerHTML = self.keyValue[value];
    }
    
    this.setOptions = function(options){
        self.options = options;
    }

    return {
      name: this.name,
      value: this.getValue,
      updateValue: this.updateValue,
      updateOptions: this.updateOptions,
      setOptions: this.setOptions
    }
}

function SaveToCustom(_key,_value){
	if(isJson(game_settings['GeneralClockFormat'])){
		var parsed = JSON.parse(game_settings["GeneralClockFormat"]);
		if(whatIsIt(parsed) != "Object"){
			parsed = {timeformat:24};
		}
		parsed[_key] = _value;
		game_settings["GeneralClockFormat"] = JSON.stringify(parsed);
		// uiPushShow(game_settings["GeneralClockFormat"], 2, 1);
	}
	else{
		var testpog = {timeformat:24};
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
	}
	engine.call('CVRAppCallSaveSetting', "GeneralClockFormat", game_settings["GeneralClockFormat"]);
}

function AddToCustomArray(_key,_value){
	if(isJson(game_settings['GeneralClockFormat'])){
		var parsed = JSON.parse(game_settings["GeneralClockFormat"]);
		if(whatIsIt(parsed) != "Object"){
			parsed = {timeformat:24};
		}
		if(parsed[_key] === undefined){
			parsed[_key] = [];
		}
		if(parsed[_key].includes(_value)){
			parsed[_key] = removeItemOnce(parsed[_key],_value);
		}
		else{
			parsed[_key].push(_value);
		}
		game_settings["GeneralClockFormat"] = JSON.stringify(parsed);
		// uiPushShow(game_settings["GeneralClockFormat"], 2, 1);
	}
	else{
		var testpog = {timeformat:24};
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
	}
	engine.call('CVRAppCallSaveSetting', "GeneralClockFormat", game_settings["GeneralClockFormat"]);
}

function RemoveFromCustomArray(_key,_value){
	if(isJson(game_settings['GeneralClockFormat'])){
		var parsed = JSON.parse(game_settings["GeneralClockFormat"]);
		if(whatIsIt(parsed) != "Object"){
			parsed = {timeformat:24};
		}
		if(parsed[_key] === undefined){
			parsed[_key] = [];
		}
		if(parsed[_key].some(x=>x.WorldId === _value.WorldId)){
			parsed[_key] = parsed[_key].filter(function(ele){
				return ele.WorldId != _value.WorldId;
			});
		}
		game_settings["GeneralClockFormat"] = JSON.stringify(parsed);
		// uiPushShow(game_settings["GeneralClockFormat"], 2, 1);
	}
	else{
		var testpog = {timeformat:24};
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
	}
	engine.call('CVRAppCallSaveSetting', "GeneralClockFormat", game_settings["GeneralClockFormat"]);
}

function GetCustomArray(_key){
	if(isJson(game_settings['GeneralClockFormat'])){
		var parsed = JSON.parse(game_settings["GeneralClockFormat"]);
		if(whatIsIt(parsed) != "Object"){
			parsed = {timeformat:24};
		}
		if(parsed[_key] === undefined){
			return [];
		}
		return parsed[_key];
	}
	else{
		var testpog = {timeformat:24};
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
		return [];
	}
}


function GetFromCustom(_key){
	if(isJson(game_settings['GeneralClockFormat'])){
		var parsed = JSON.parse(game_settings["GeneralClockFormat"]);
		if(whatIsIt(parsed) != "Object"){
			parsed = {timeformat:24};
		}
		if(parsed[_key] === undefined){
			return "100";
		}
		return parsed[_key];
	}
	else{
		var testpog = {timeformat:24};
		game_settings["GeneralClockFormat"] = JSON.stringify(testpog);
		return "";
	}
}

filterContent = function(_ident, _filter){
    var buttons = document.querySelectorAll('#'+_ident+' .filter-option');

    for(var i=0; buttons[i]; i++){
        buttons[i].classList.remove('active');
    }

    var activeButton = document.querySelector('#'+_ident+' .filter-option.data-filter-'+_filter+'');
    if(activeButton != null){
        activeButton.classList.add('active');
    }

    switch(_ident){
        case 'avatars':
                var list = filterList(avatarList, _filter);
                renderAvatars(list);
            break;
        case 'worlds':
                worldFilter = _filter;								
				if(_filter == "favourites"){
					var _list = GetCustomArray("worldfavourites");
					worldList = _list;
					renderWorlds(_list);
				}
				else{
					loadFilteredWorlds();
				}				
            break;
        case 'friends':
                var list = filterList(friendList, _filter);
                renderFriends(list);
            break;
    }
}

function IsWorldInFavourites(_uid){
	var favs = GetCustomArray("worldfavourites");
	if(favs.some(x => x.WorldId === _uid)){
		return true;
	}
	return false;
}

function AddWorldToFavourites(_uid,_name,_image){
	var world = {WorldId:_uid,WorldName:unescape(_name),WorldImageUrl:_image};
	var favs = GetCustomArray("worldfavourites");
	if(IsWorldInFavourites(world.WorldId)){
		RemoveFromCustomArray("worldfavourites",world);
		document.querySelector('.data-worldFavorite span').innerHTML = "Favorite";
	}
	else{
		AddToCustomArray("worldfavourites",world);
		document.querySelector('.data-worldFavorite span').innerHTML = "Unfavorite";
	}
	if(worldFilter == "favourites"){
		renderWorlds(GetCustomArray("worldfavourites"));
	}
}


loadWorldDetails = function(_data, _instances){
    currentWorldDetails = _data;
    var detailPage = document.getElementById('world-detail');

    document.querySelector('#world-detail h1').innerHTML = 'World: '+_data.WorldName;
    document.querySelector('.data-worldName').innerHTML = _data.WorldName;
    document.querySelector('.data-description').innerHTML = _data.WorldDescription;
    document.querySelector('.data-adminTags').innerHTML = _data.AdminTags.replace(/,/g, ' ');
    document.querySelector('.data-safetyTags').innerHTML = _data.SafetyTags.replace(/,/g, ' ');
    document.querySelector('.data-fileSize').innerHTML = _data.WorldSize;
    document.querySelector('.data-uploaded').innerHTML = _data.UploadedAt;
    document.querySelector('.data-updated').innerHTML = _data.UpdatedAt;

    document.querySelector('.data-worldImage').src = _data.WorldImageUrl;
    document.querySelector('.data-worldPreload').setAttribute('onclick', 'preloadWorld(\''+_data.WorldId+'\');');
	document.querySelector('.data-worldFavorite').setAttribute('onclick', 'AddWorldToFavourites(\''+_data.WorldId+'\',\''+escape(_data.WorldName)+'\',\''+_data.WorldImageUrl+'\');');
    document.querySelector('.data-worldExplore').setAttribute('onclick', 'changeWorld(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldSetHome').setAttribute('onclick', 'setHome(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldAuthorImage').src = _data.AuthorImageUrl;
    document.querySelector('.data-authorName').innerHTML = _data.AuthorName;
    document.querySelector('.action-btn.data-author-profile').setAttribute('onclick', 'getUserDetails(\''+_data.AuthorId+'\');');
	
	if(IsWorldInFavourites(_data.WorldId)){
		document.querySelector('.data-worldFavorite span').innerHTML = "Unfavorite";
	}
	else{
		document.querySelector('.data-worldFavorite span').innerHTML = "Favorite";
	}
	

    var html = '';

    for(var i=0; i < _instances.length; i++){
        html += generateInstanceHTML(_instances[i]);
    }

    if(_instances.length == 0){
        html = '<div class="world-instances-empty-message">There are currently no open instances for this world</div>';
    }

    document.querySelector('.data-worldInstances').innerHTML = html;

    detailPage.classList.remove('hidden');
    detailPage.classList.add('in');

    document.querySelector('#world-instance-create .btn-create').setAttribute('onclick', 'instancingCreateInstance(\''+_data.WorldId+'\');');
    hideCreateInstance();
}

changeTab = function(_id, _e){

    if (!categoriesLoaded){
        engine.trigger('CVRAppTaskRefreshCategories');
    }
    

    if(_e.className.includes('active')){

        switch(_id){
            case 'friends':
                    if(friendList.length == 0){
                        refreshFriends();
                    }
                    closeUserDetail();
                break;
            case 'worlds':
                    if(worldList.length == 0){
                        loadFilteredWorlds();
                    }
                    closeWorldDetail();
                    closeInstanceDetail();
                break;
            case 'avatars':
                    if(avatarList.length == 0){
                        refreshAvatars();
                    }
                    closeAvatarDetail();
                    closeAvatarDetailFavorite();
                break;
            case 'props':
                if(propList.length == 0){
                    refreshProps();
                }
                break;
             case 'messages':
                engine.trigger('CVRAppActionRefreshInvites');
                break;
        }

        return;
    }

    var buttons = document.querySelectorAll('.toolbar-btn');
    for(var i=0; buttons[i]; i++){
        buttons[i].classList.remove('active');
    }
    _e.classList.add('active');

    var content = document.querySelectorAll('.content.in');
    for(var i=0; content[i]; i++){
        content[i].classList.remove('in');
        content[i].classList.add('out');
    }
    setTimeout(hideTabs, 200);

    var target = document.getElementById(_id);
    target.classList.remove('hidden');
    target.classList.add('in');

    switch(_id){
        case 'friends':
                if(friendList.length == 0){
                    refreshFriends();
                }
            break;
        case 'worlds':
                if(worldList.length == 0){
					worldFilter = "wrldactive";
                    loadFilteredWorlds();
                    // refreshWorlds();
                }
            break;
        case 'avatars':
                if(avatarList.length == 0){
                    refreshAvatars();
                }
            break;
        case 'props':
            if(avatarList.length == 0){
                refreshProps();
            }
            break;
        case 'messages':
            engine.trigger('CVRAppActionRefreshInvites');
            break;
    }
}

loadWorlds = function(_list){
    worldList = _list;

    /*
    var html = '';
	

    for(var i=0; _filter[i]; i++){
        if((i == 0 && worldsResetLoad) || worldFilter == '')worldFilter = _filter[i].CategoryKey;
        html += '<div class="filter-option data-filter-'+_filter[i].CategoryKey+
                ' '+(_filter[i].CategoryKey == worldFilter?'active':'')+'" onclick="filterContent(\'worlds\', \''+
                _filter[i].CategoryKey+'\');">'+_filter[i].CategoryClearTextName+'</div>';
    }
	
	html += '<div class="filter-option data-filter-favourites '+('favourites' == worldFilter?'active':'')+'" onclick="filterContent(\'worlds\', \'favourites\');">Favourites</div>';

    document.querySelector('#worlds .filter-content').innerHTML = html;

    */
    renderWorlds(_list);

    worldsResetLoad = false;
}


/*
renderProps = function(_list){
    var contentList = document.querySelector('#props .list-content');

    var html = '';

    for(var i=0; _list[i]; i++){
        if(i%4 === 0){
            if(i !== 0){
                html += '</div>';
            }
            html += '<div class="content-row">';
        }

        html += '<div class="content-cell"><div class="content-cell-formatter"></div>'+
            '<div class="content-cell-content"><img class="content-image" src="'+
            _list[i].SpawnableImageUrl+'"><div class="content-name">'+
            _list[i].SpawnableName+'</div>'+
            '<div class="content-btn first" onclick="SelectProp(\''+_list[i].Guid+'\', \''+_list[i].SpawnableImageUrl+'\', \''+_list[i].SpawnableName+'\');">Select Prop</div>'+
            '<div class="content-btn second" onclick="SpawnProp(\''+_list[i].Guid+'\');">Drop Prop</div></div></div>';
    }

    contentList.innerHTML = html;
}
*/




// #region Clock setting fix

var el = document.getElementById('GeneralClockFormat');
elClone = el.cloneNode(true);

el.parentNode.replaceChild(elClone, el);

var test = document.getElementById('GeneralClockFormat');
    while (test.firstChild) {
        test.removeChild(test.firstChild);
    }

settings[16] = new inp_dropdown(test);

// #endregion


// #region Slider adjustment to be usable as colorpicker for the UI
updateGameSettingsValue = function(_name, _value){
    for(var i = 0; i < settings.length; i++){
        if(settings[i].name == _name){
            settings[i].updateValue(_value);
            game_settings[_name] = _value;
        }
    }
    if(_name == "GeneralClockFormat"){
        
        var sliderinos = document.querySelectorAll('.inp_slider_custom');
        for(var i = 0; i < sliderinos.length; i++){
            settings[settings.length] = new inp_slider_custom(sliderinos[i]);
        }
    }
}


var backgroundClasses = ".content, .toolbar, #world-detail, #instance-detail, #user-detail, #avatar-detail, #avatar-settings, #keyboard, #numpad, #alert, #alertTimed, #confirm, #loading, #push, .tab-contents, .valueList";
var backgroundClassesDisabled = ".content-instance-buttons .instance-btn.disabled, .world-instancing .content-btn.disabled:hover, .world-instancing .content-btn.disabled:hover, .avatar-toolbar .toolbar-btn.disabled, .avatar-toolbar .toolbar-btn.disabled:hover, .user-toolbar .toolbar-btn.disabled, .user-toolbar .toolbar-btn.disabled:hover";
var accentClassesBorder = ".inp_search, .noMessagesInfo, .inp_slider_custom, .content, .message-box, #keyboard, .advAvtrProfName, .advAvtrProfSave, .advAvtrProfDelete, .filter-option, .inp_dropdown, .toolbar-btn-double, .toolbar-btn, .toolbar, .content-btn, .action-btn, .content-avatar-functions, .content-panic, .content-debug, .content-shortcuts ,.content-feed, .content-call, .inp_toggle, .imperialDisplay, .inp_btn_action, .inp_button, .inp_slider, .content-cell, .content-world-information, .content-world-actions, .content-world-author, .content-world-author-worlds, .content-world-instances, .content-world-intancing, .world-instance, .close-btn, .content-instance-owner, .content-instance-world, .content-instance-information, .content-instance-buttons, .content-instance-players, .user-sidebar, .user-settings-dialog, .user-toolbar, .tab-contents,#tab-content-activity .player-instance-rules, .activityDataUnavailableInfo, .tab-btn, #tab-content-activity .player-instance-players, .avatar-sidebar, .avatar-maininformation, .avatar-toolbar, .favorite-category-selection, .valueList";
var accentClassesBorderTop = ".keyboard-row + .keyboard-row, .valueList .listValue + .listValue";
var accentClassesBorderLeft = ".list-content, .content-instance-buttons .instance-btn + .instance-btn, .keyboard-key + .keyboard-key, .keyboard-key + .keyboard-mod, .keyboard-key + .keyboard-func, .keyboard-mod + .keyboard-key, .keyboard-mod + .keyboard-mod, .keyboard-mod + .keyboard-func, .keyboard-func + .keyboard-key, .keyboard-func + .keyboard-mod, .keyboard-func + .keyboard-func";
var specialClasses = ".inp_slider .valueBar, .inp_toggle.checked, .inp_slider_custom .valueBar";
var highlightClasses = ".keyboard-key:hover, .keyboard-mod:hover, .keyboard-func:hover, .keyboard-key.active, .keyboard-mod.active, .keyboard-func.active, .advAvtrProfName:hover, .advAvtrProfSave:hover, .advAvtrProfDelete:hover, .filter-option.active, .filter-option:hover, .content-btn:hover, .toolbar-btn:hover, .toolbar-btn.active, .action-btn:hover, .close-btn:hover, .avatar-toolbar .toolbar-btn:hover, .user-toolbar .toolbar-btn:hover, .content-instance-buttons .instance-btn:hover, .inp_dropdown .valueList .listValue:hover, .inp_dropdown:hover";



function inp_slider_custom(_obj){
    this.obj = _obj;
    this.minValue = parseFloat(_obj.getAttribute('data-min'));
    this.maxValue = parseFloat(_obj.getAttribute('data-max'));
    this.percent  = 0;
    this.color = _obj.id.substr(_obj.id.length - 2, _obj.id.length);
    this.name = _obj.id.replace('CVR_', '').replace(this.color, '');
    this.value    = GetFromCustom(this.name+this.color);
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.dragActive = false;
    this.type = _obj.getAttribute('data-type');
    this.caption = _obj.getAttribute('data-caption');
    this.continuousUpdate = _obj.getAttribute('data-continuousUpdate');

    var self = this;

    this.valueBar = document.createElement('div');
    this.valueBar.className = 'valueBar';
    this.valueBar.setAttribute('style', 'width: '+(((this.value - this.minValue) / (this.maxValue - this.minValue)) * 100)+'%;');
    this.obj.appendChild(this.valueBar);

    this.valueLabel = document.createElement('div');
    this.valueLabel.className = 'valueLabel';
    this.valueLabel.innerHTML = this.caption + Math.round(this.value);
    this.obj.appendChild(this.valueLabel);

    this.UpdatePreview = function(){
        var preview = document.getElementById('CVR_PREV_' + self.name);
        if(preview){
            var red = preview.getAttribute('data-r');
            var green = preview.getAttribute('data-g');
            var blue = preview.getAttribute('data-b');
            var alpha = preview.getAttribute('data-a');
            
            switch(self.color){
                case '-r':
                    red = parseInt(self.value);
                    preview.setAttribute('data-r', red);
                    break;
                case '-g':
                    green = parseInt(self.value);
                    preview.setAttribute('data-g', green);
                    break;
                case '-b':
                    blue = parseInt(self.value);
                    preview.setAttribute('data-b', blue);
                    break;
                 case '-a':
                    alpha = parseInt(self.value);
                    preview.setAttribute('data-a', alpha);
                    break;
            }


            preview.setAttribute('style', 'background-color: rgba('+red+','+green+','+blue+','+alpha/255+');');
            // document.documentElement.style.setProperty("--"+self.name,"rgba("+red+","+green+","+blue+","+alpha/255+")");
            switch(self.name){
                case "BGColor":
                    for (let i = 0; i < document.styleSheets[2].cssRules.length; i++) {
                        document.styleSheets[2].deleteRule(i);
                    }
                    document.styleSheets[2].insertRule(backgroundClasses+"{background-color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[2].insertRule(backgroundClassesDisabled+"{background-color: rgba("+(red-50)+","+(green-50)+","+(blue-50)+","+alpha/255+") !important}");



                    // document.styleSheets[1].cssRules[0].style.backgroundColor = "rgba("+red+","+green+","+blue+","+alpha/255+")";
                break;
                case "ACColor":
                    for (let i = 0; i < document.styleSheets[3].cssRules.length; i++) {
                        document.styleSheets[3].deleteRule(i);
                    }
                    document.styleSheets[3].insertRule(accentClassesBorder+"{border: 3px solid rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[3].insertRule(accentClassesBorderTop+"{border-top: 3px solid rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[3].insertRule(accentClassesBorderLeft+"{border-left: 3px solid rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                break;
                case "HLColor":
                    for (let i = 0; i < document.styleSheets[4].cssRules.length; i++) {
                        document.styleSheets[4].deleteRule(i);
                    }
                    document.styleSheets[4].insertRule(highlightClasses+"{background-color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[4].insertRule(specialClasses+"{background-color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                break;
            }
        }
    }

    this.mouseDown = function(_e){
        self.dragActive = true;
        self.mouseMove(_e, false);
    }



    this.mouseMove = function(_e, _write){
        if(self.dragActive){
            var rect = _obj.getBoundingClientRect();
            var start = rect.left;
            var end = rect.right;
            self.percent = Math.min(Math.max((_e.clientX - start) / rect.width, 0), 1);
            var value = self.percent;
            value *= (self.maxValue - self.minValue);
            value += self.minValue;
            self.value = Math.round(value);

            self.valueBar.setAttribute('style', 'width: '+(self.percent * 100)+'%;');
            self.valueLabel.innerHTML = self.caption + self.value;
            
            if(self.type == 'dasui'){
                self.UpdatePreview();
            }
        }
    }



    this.mouseUp = function(_e){
        self.mouseMove(_e, true);
        self.dragActive = false;
        var preview = document.getElementById('CVR_PREV_' + self.name);
        var red = preview.getAttribute('data-r');
        var green = preview.getAttribute('data-g');
        var blue = preview.getAttribute('data-b');
        var alpha = preview.getAttribute('data-a');
        SaveToCustom(self.name+self.color, self.value);
    }

    _obj.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);

    this.getValue = function(){
        return self.value;
    }

    this.updateValue = function(value){
        self.value = Math.round(value);
        self.percent = (self.value - self.minValue) / (self.maxValue - self.minValue);
        self.valueBar.setAttribute('style', 'width: '+(self.percent * 100)+'%;');
        self.valueLabel.innerHTML = self.caption + self.value;
        self.displayImperial();
    }
    
    this.displayImperial = function(){
        var displays = document.querySelectorAll('.imperialDisplay');
        for (var i = 0; i < displays.length; i++){
            var binding = displays[i].getAttribute('data-binding');
            if(binding == self.name){
                var realFeet = ((self.value * 0.393700) / 12);
                var feet = Math.floor(realFeet);
                var inches = Math.floor((realFeet - feet) * 12);
                displays[i].innerHTML = feet + "&apos;" + inches + '&apos;&apos;';
            }
        }
    }
    this.UpdatePreview();


    return {
      name: this.name,
      value: this.getValue,
      updateValue: this.updateValue
    }
}






// #endregion


function cobaltSearchWorld(){
    var term = document.getElementById('cobaltSearchWorld').value.toLowerCase();

    if(worldList != null){
        var newworldList = worldList.filter(world => world.WorldName.toLowerCase().includes(term));
        renderWorlds(newworldList);
    }
}

function resetCobaltSearch(){
    document.getElementById('cobaltSearchWorld').value = "";
    renderWorlds(worldList);
}


// #region Version checker




function versionRequest(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
        var majorNew = this.responseText.split(".")[0];
        var minorNew = this.responseText.split(".")[1];
        var majorCurrent = version.split(".")[0];
        var minorCurrent = version.split(".")[1];
        var dasuiversion = document.querySelector('.dasui-version');
        if(majorNew > majorCurrent || (majorNew == majorCurrent && minorNew > minorCurrent)){
            if(dasuiversion) dasuiversion.innerHTML = version + " Update available!";
            uiAlertShow('DasUI', 'New Version is available!', 404);
        }
        else{
            if(dasuiversion) dasuiversion.innerHTML = version;
        }
	}
};
xhttp.open("GET", "https://raw.githubusercontent.com/Neradon/CVRPlus/main/version.txt", true);
xhttp.send();
}

versionRequest();
// #endregion

// #region Changelog

function changelogRequest(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
        document.querySelector(".content-call").innerHTML = this.responseText;
	}
};
xhttp.open("GET", "https://raw.githubusercontent.com/Neradon/CVRPlus/main/changelog.txt", true);
xhttp.send();
}
changelogRequest();

// #endregion


// engine.on('ShowAvatarSettings', function(_info){
//     DisplayAvatarSettingsNew(_info);
// });


/*

var firstLoad = true;








var testDic = {};




inp_toggle = function(_obj){
    this.obj = _obj;
    this.value = _obj.getAttribute('data-current');
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.name = _obj.id;
    this.type = _obj.getAttribute('data-type');

    var self = this;

     
    if(this.name in testDic){
        testDic[this.name].push(this);
    }
    else{
        testDic[this.name] = [this];
    }


    this.mouseDown = function(_e){
        self.value = self.value=="True"?"False":"True";
        self.updateState();
    }

    this.updateState = function(){
        self.obj.classList.remove("checked");
        if(self.value == "True"){
            self.obj.classList.add("checked");
        }
        if(self.name in testDic){
            for(var i=0; i < testDic[self.name].length;i++){
                if(testDic[self.name][i] != self){
                    testDic[self.name][i].updateValue(self.value)
                }
            }
        }
        if(self.saveOnChange){
            if(self.type == 'avatar'){
                changeAnimatorParam(self.name.replace('AVS_', ''), (self.value=="True"?1:0));
            }else{
                engine.call('CVRAppCallSaveSetting', self.name, self.value);
                game_settings[self.name] = self.value;
            }
        }

    }
    
    _obj.addEventListener('mousedown', this.mouseDown);

    this.getValue = function(){
        return self.value;
    }

    this.updateValue = function(value){
        self.value = value;

        self.obj.classList.remove("checked");
        if(self.value == "True"){
            self.obj.classList.add("checked");
        }
        
    }

    this.updateValue(this.value);

    return {
      name: this.name,
      value: this.getValue,
      updateValue: this.updateValue
    }
}
*/

















function DisplayAvatarSettingsNew(_list){
    var contentElement = document.querySelector('.content-call');
    var html = '';

    for(var i=0; i < _list.length; i++){
        var entry = _list[i];

        switch(entry.type){
            case 'toggle':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_toggle inp_toggle_new" data-type="avatar" data-current="'+(entry.defaultValueX==1?'True':'False')+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'dropdown':
                var settings = '';

                for(var j=0; j < entry.optionList.length; j++){
                    if(j != 0) settings += ',';
                    settings += j+':'+entry.optionList[j];
                }

                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_dropdown inp_dropdown_new" data-type="avatar" data-options="'+settings+'" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'colorpicker':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_PREV_'+entry.parameterName+'" class="color-preview" data-r="'+parseInt(entry.defaultValueX * 255)+'" data-g="'+parseInt(entry.defaultValueY * 255)+'" data-b="'+parseInt(entry.defaultValueZ * 255)+'" '  +
                    'style="background-color: rgba('+parseInt(entry.defaultValueX * 255)+','+parseInt(entry.defaultValueY * 255)+','+parseInt(entry.defaultValueZ * 255)+',1);"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-r" class="inp_slider color" data-caption="Red: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueX * 255)+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-g" class="inp_slider color" data-caption="Green: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueY * 255)+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-b" class="inp_slider color" data-caption="Blue: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueZ * 255)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'slider':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_slider" data-type="avatar" data-min="0" data-max="100" data-current="'+(entry.defaultValueX * 100)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'joystick2d':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_joystick" data-type="avatar" data-current="'+entry.defaultValueX+'|'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'joystick3d':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_joystick" data-type="avatar" data-current="'+entry.defaultValueX+'|'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-z" class="inp_sliderH" data-type="avatar" data-min="0" data-max="100" data-current="'+(entry.defaultValueZ * 100)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputsingle':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputvector2':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'-x" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-y" class="inp_number" data-type="avatar" data-caption="Y" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputvector3':
                html += '<div class="row-wrapper-new">\n' +
                    '    <div class="option-caption-new">'+entry.name+':</div>\n' +
                    '        <div class="option-input-new">\n' +
                    '        <div id="AVS_'+entry.parameterName+'-x" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-y" class="inp_number" data-type="avatar" data-caption="Y" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-z" class="inp_number" data-type="avatar" data-caption="Z" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueZ+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
        }
    }

    if(_list.length == 0){
        html = "There are no advanced settings configured for this avatar.";
    }

    contentElement.innerHTML = html;

    // var avatarSettings = document.getElementById('avatar-settings');
    // avatarSettings.classList.remove('hidden');
    // avatarSettings.classList.add('in');

    for(var i=0; i < _list.length; i++){
        var entry = _list[i];

        switch(entry.type){
            case 'toggle':
                new inp_toggle(document.querySelector('.content-call #AVS_'+entry.parameterName));
                break;
            case 'dropdown':
                new inp_dropdown(document.querySelector('.content-call #AVS_'+entry.parameterName));
                break;
            case 'colorpicker':
                new inp_slider(document.querySelector('.content-call #AVS_'+entry.parameterName+'-r'));
                new inp_slider(document.querySelector('.content-call #AVS_'+entry.parameterName+'-g'));
                new inp_slider(document.querySelector('.content-call #AVS_'+entry.parameterName+'-b'));
                break;
            case 'slider':
                new inp_slider(document.querySelector('.content-call #AVS_'+entry.parameterName));
                break;
            case 'joystick2d':
                new inp_joystick(document.querySelector('.content-call #AVS_'+entry.parameterName));
                break;
            case 'joystick3d':
                new inp_joystick(document.querySelector('.content-call #AVS_'+entry.parameterName));
                new inp_sliderH(document.querySelector('.content-call #AVS_'+entry.parameterName+'-z'));
                break;
            case 'inputsingle':
                new inp_number(document.querySelector('.content-call #AVS_'+entry.parameterName));
                break;
            case 'inputvector2':
                new inp_number(document.querySelector('.content-call #AVS_'+entry.parameterName+'-x'));
                new inp_number(document.querySelector('.content-call #AVS_'+entry.parameterName+'-y'));
                break;
            case 'inputvector3':
                new inp_number(document.querySelector('.content-call #AVS_'+entry.parameterName+'-x'));
                new inp_number(document.querySelector('.content-call #AVS_'+entry.parameterName+'-y'));
                new inp_number(document.querySelector('.content-call #AVS_'+entry.parameterName+'-z'));
                break;
        }
    }
}




/*
DisplayAvatarSettings = function(_list){
    if(firstLoad){
        firstLoad = false;
        return;   
    }
    

    var contentElement = document.querySelector('#avatar-settings .list-content');
    var html = '';

    for(var i=0; i < _list.length; i++){
        var entry = _list[i];

        switch(entry.type){
            case 'toggle':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_toggle" data-type="avatar" data-current="'+(entry.defaultValueX==1?'True':'False')+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'dropdown':
                var settings = '';

                for(var j=0; j < entry.optionList.length; j++){
                    if(j != 0) settings += ',';
                    settings += j+':'+entry.optionList[j];
                }

                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_dropdown" data-type="avatar" data-options="'+settings+'" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'colorpicker':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_PREV_'+entry.parameterName+'" class="color-preview" data-r="'+parseInt(entry.defaultValueX * 255)+'" data-g="'+parseInt(entry.defaultValueY * 255)+'" data-b="'+parseInt(entry.defaultValueZ * 255)+'" '  +
                    'style="background-color: rgba('+parseInt(entry.defaultValueX * 255)+','+parseInt(entry.defaultValueY * 255)+','+parseInt(entry.defaultValueZ * 255)+',1);"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-r" class="inp_slider color" data-caption="Red: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueX * 255)+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-g" class="inp_slider color" data-caption="Green: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueY * 255)+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-b" class="inp_slider color" data-caption="Blue: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueZ * 255)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'slider':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_slider" data-type="avatar" data-min="0" data-max="100" data-current="'+(entry.defaultValueX * 100)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'joystick2d':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_joystick" data-type="avatar" data-current="'+entry.defaultValueX+'|'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'joystick3d':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_joystick" data-type="avatar" data-current="'+entry.defaultValueX+'|'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-z" class="inp_sliderH" data-type="avatar" data-min="0" data-max="100" data-current="'+(entry.defaultValueZ * 100)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputsingle':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputvector2':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'-x" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-y" class="inp_number" data-type="avatar" data-caption="Y" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputvector3':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName+'-x" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-y" class="inp_number" data-type="avatar" data-caption="Y" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName+'-z" class="inp_number" data-type="avatar" data-caption="Z" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueZ+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
        }
    }

    if(_list.length == 0){
        html = "There are no advanced settings configured for this avatar.";
    }

    contentElement.innerHTML = html;

    var avatarSettings = document.getElementById('avatar-settings');
    avatarSettings.classList.remove('hidden');
    avatarSettings.classList.add('in');

    for(var i=0; i < _list.length; i++){
        var entry = _list[i];

        switch(entry.type){
            case 'toggle':
                new inp_toggle(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName));
                break;
            case 'dropdown':
                new inp_dropdown(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName));
                break;
            case 'colorpicker':
                new inp_slider(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-r'));
                new inp_slider(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-g'));
                new inp_slider(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-b'));
                break;
            case 'slider':
                new inp_slider(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName));
                break;
            case 'joystick2d':
                new inp_joystick(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName));
                break;
            case 'joystick3d':
                new inp_joystick(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName));
                new inp_sliderH(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-z'));
                break;
            case 'inputsingle':
                new inp_number(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName));
                break;
            case 'inputvector2':
                new inp_number(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-x'));
                new inp_number(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-y'));
                break;
            case 'inputvector3':
                new inp_number(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-x'));
                new inp_number(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-y'));
                new inp_number(document.querySelector('#avatar-settings .list-content #AVS_'+entry.parameterName+'-z'));
                break;
        }
    }

}
*/












// showAvatarSettings();


