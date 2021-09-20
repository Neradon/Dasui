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
}

renderFriends = function(_list){
    var contentList = document.querySelector('#friends .list-content');

    var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){
        html += '<div data-id="'+_list[i].UserId+'" class="content-cell friend" onclick="getUserDetailsNew(\''+_list[i].UserId+'\',event);" onmousedown="mousedowntest(event);"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><div class="online-state-test '+(_list[i].UserIsOnline?'online':'offline')+' '+_list[i].FilterTags+'">'+
                '<img class="content-image online-state-image '+(_list[i].UserIsOnline?'online':'offline')+'" src="'+
                _list[i].UserImageUrl+'"></div><div class="content-name">'+
                _list[i].UserName.makeSafe()+'</div></div>'+
                '</div>';
    }

    html += '</div>';

    contentList.innerHTML = html;
}

UpdateFriend = function(_friend){
    cvr('#friends .list-content .flex-list [data-id="'+_friend.UserId+'"] .online-state-test').className('online-state-test '+(_friend.UserIsOnline?'online':'offline')+' '+_friend.FilterTags);
    cvr('#friends .list-content .flex-list [data-id="'+_friend.UserId+'"] .online-state-image').className('online-state-image '+(_friend.UserIsOnline?'online':'offline')+' '+_friend.FilterTags);
    cvr('#friends .list-content .flex-list [data-id="'+_friend.UserId+'"] .content-image').attr('src', _friend.UserImageUrl);
    cvr('#friends .list-content .flex-list [data-id="'+_friend.UserId+'"] .content-name').innerHTML(_friend.UserName.makeSafe());
}

AddFriend = function(_friend){

    var html = '<div data-id="'+_list[i].UserId+'" class="content-cell friend" onclick="getUserDetailsNew(\''+_list[i].UserId+'\',event);" onmousedown="mousedowntest(event);"><div class="content-cell-formatter"></div>'+
    '<div class="content-cell-content"><div class="online-state-test '+(_list[i].UserIsOnline?'online':'offline')+' '+_list[i].FilterTags+'">'+
    '<img class="content-image online-state-image '+(_list[i].UserIsOnline?'online':'offline')+'" src="'+
    _list[i].UserImageUrl+'"></div><div class="content-name">'+
    _list[i].UserName.makeSafe()+'</div></div>'+
    '</div>';
    
    cvr('#friends .list-content .flex-list').addHTML(html);
}


document.styleSheets[0].insertRule(".friend .content-cell-formatter{ margin-top: 2em !important; }");
document.styleSheets[0].insertRule(".content-cell.friend{ width: 18.5% !important; margin-right: 1.5% !important; margin-bottom: 1.5% !important; /* NEW */ background-color: rgba(150,150,150,0.6) !important; border: none !important; border-radius: 5px !important; /* box-shadow: 5px 5px 10px 5px rgba(181,175,174,0.5); */ }");
document.styleSheets[0].insertRule(".content-cell.friend:hover { background-color: rgba(150,150,150,0.8) !important; }");
document.styleSheets[0].insertRule(".friend .content-cell-content{ left: 6% !important; }");
document.styleSheets[0].insertRule(".friend .online-state-test { position: absolute !important; width: 100% !important; height: auto !important; bottom: 2em !important; top: 0 !important; border-radius: 10px !important; }");
document.styleSheets[0].insertRule(".friend .online-state-test.online { box-shadow: 0px 0px 20px 10px #00cc00 !important; }");
document.styleSheets[0].insertRule(".friend .online-state-test.offline { box-shadow: 0px 0px 20px 10px #cc0000 !important; }");
document.styleSheets[0].insertRule(".friend .online-state-image.offline { filter: grayscale(100%) !important; }");
document.styleSheets[0].insertRule(".friend .content-name{ left: -6% !important; bottom: -6% !important; width: 112% !important; height: 2em !important; /* background-color: rgba(150,150,150,0.8); */ line-height:2em !important; }");
document.styleSheets[0].insertRule(".friend .content-image{ position: unset !important; width: 100% !important; height: 100% !important; bottom: unset !important; top: unset !important; border-radius: unset !important; }");



function getUserDetailsNew(_uid,e){
	var dif = {x:0,y:0};
	dif.x = e.clientX - mousedownlocation.x;
	dif.y = e.clientY - mousedownlocation.y;
	if(mousedownlocation.x === 0 && mousedownlocation.y === 0){
		dif = {x:0,y:0};
	}
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

