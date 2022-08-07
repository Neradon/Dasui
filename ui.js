var categoriesLoaded = false;

var canChangeTab = true;
var searchOpened = false;

function changeTab(_id, _e){

    if (!canChangeTab) return;
    
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
                        //refreshWorlds();
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
    
    document.getElementById('search-btn').classList.remove('active');
    
    _e.classList.add('active');

    var content = document.querySelectorAll('.content.in');
    for(var i=0; content[i]; i++){
        content[i].classList.remove('in');
        content[i].classList.add('out');
    }
    setTimeout(hideTabs, 200);
    
    canChangeTab = false;

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
                    refreshWorlds();
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
        case 'search':
            if (!searchOpened) {
                displayKeyboard(document.getElementById('globalSearch'));
                searchOpened = true;
            }
            break;
    }
}

function hideTabs(){
    var content = document.querySelectorAll('.content.out');
    for(var i=0; content[i]; i++){
        content[i].classList.add('hidden');
        content[i].classList.remove('out');
    }
    canChangeTab = true;
}

function switchTab(_tabs, _contents, _content, _e){
    if(_e.className.includes('active')) return;

    var buttons = document.querySelectorAll(_tabs);
    for(var i=0; buttons[i]; i++){
        buttons[i].classList.remove('active');
    }
    _e.classList.add('active');
    var tabs = document.querySelectorAll('.active-overlay');
    for(var i=0; i < tabs.length; i++){
      tabs[i].innerHTML = ' ';
    }

    var content = document.querySelectorAll(_contents);
    for(var i=0; content[i]; i++){
        content[i].classList.remove('active');
    }

    document.querySelector(_content).classList.add('active');
}

var scrollTarget = null;

var mouseScrolling = false;
var pauseScrolling = false;

var startY = 0;
var startScrollY = 0;
var oldY = 0;
var speedY = 0;

var startX = 0;
var startScrollX = 0;
var oldX = 0;
var speedX = 0;

var scrollWheelTarget = null;

document.addEventListener('mousedown', function(e){
    var onclick = e.target.getAttribute("onclick");
    
    if (onclick == null && !e.target.classList.contains("no-scroll")) {
        scrollTarget = e.target.closest('.list-content');
        startY = e.clientY;
        startX = e.clientX;
        if (scrollTarget !== null) {
            mouseScrolling = true;
            startScrollY = scrollTarget.scrollTop;
            startScrollX = scrollTarget.scrollLeft;
        } else {
            scrollTarget = e.target.closest('.scroll-content');
            if (scrollTarget !== null) {
                mouseScrolling = true;
                startScrollY = scrollTarget.scrollTop;
                startScrollX = scrollTarget.scrollLeft;
            }
        }
    }
});

document.addEventListener('mousemove', function(e){
    if(scrollTarget !== null && mouseScrolling && !pauseScrolling){
        scrollTarget.scrollTop = startScrollY - e.clientY + startY;
        scrollTarget.scrollLeft = startScrollX - e.clientX + startX;
        speedY = e.clientY - oldY;
        speedX = e.clientX - oldX;
        oldY = e.clientY;
        oldX = e.clientX;
    }

    scrollWheelTarget = e.target.closest('.list-content');
    if(scrollWheelTarget == null){
        scrollWheelTarget = e.target.closest('.scroll-content');
    }
});

document.addEventListener('mouseup', function(e){
    mouseScrolling = false;
    if(scrollTarget != null){
        startScrollY = scrollTarget.scrollTop;
        startScrollX = scrollTarget.scrollLeft;
    }
});

window.setInterval(function(){
    if(!mouseScrolling && scrollTarget != null && (Math.abs(speedY) > 0.01 || Math.abs(speedX) > 0.01) && !pauseScrolling){
        speedY *= 0.95;
        speedX *= 0.95;

        scrollTarget.scrollTop -= speedY;
        scrollTarget.scrollLeft -= speedX;

    }else if(!mouseScrolling && scrollTarget != null){
        scrollTarget = null;
    }
}, 10);

window.addEventListener('wheel', function(e){
    if(scrollWheelTarget != null){
        scrollWheelTarget.scrollTop += e.deltaY;
        scrollWheelTarget.scrollLeft += e.deltaY;
    }

    e.preventDefault();
});

/*window.addEventListener('click', function(e){
    if(e.target.closest('div').getAttribute('onclick') !== null) {
        playSound("click");
    }
});*/

var avatarList = [];
var worldList = [];
var friendList = [];

function filterList(_list, _filter){
    var list = [];

    for(var i=0; _list[i]; i++){
        if(_list[i].FilterTags.split(',').includes(_filter) || _filter == ''){
            list.push(_list[i]);
        }
    }

    return list;
}

function filterContent(_ident, _filter){
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
                renderAvatars(list, true);
            break;
        case 'worlds':
                //var list = filterList(worldList, _filter);
                //renderWorlds(list);
                worldFilter = _filter;
                loadFilteredWorlds();
                //renderWorlds(list);
            break;
        case 'friends':
                //var list = filterList(friendList, _filter);
                //renderFriends(list);
                filterFriendList(_filter);
            break;
    }
}

//Avatars
function loadAvatars(_list){
    avatarList = _list;

    renderAvatars(_list);
}

function renderAvatars(_list, _forceRefresh){
    var contentList = document.querySelector('#avatars .list-content');

    /*var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){

        html += '<div data-id="'+_list[i].AvatarId+'" class="content-cell avatar"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><img class="content-image" src="'+
                _list[i].AvatarImageUrl+'"><div class="content-name">'+
                _list[i].AvatarName.makeSafe()+'</div><div class="content-btn first" onclick="GetAvatarDetails(\''+_list[i].AvatarId+'\');">Details</div>'+
                '<div class="content-btn second" onclick="changeAvatar(\''+_list[i].AvatarId+'\');">Change Avatar</div></div></div>';
    }

    html += '</div>';
    
    contentList.innerHTML = html;*/
    
    if (_forceRefresh === true) cvr('#avatars .list-content .flex-list').innerHTML('');

    for(var i=0; _list[i]; i++){
        if (cvr('#avatars .list-content .flex-list #avtr_'+_list[i].AvatarId+'').length == 0){
            AddAvatar(_list[i]);
        } else {
            UpdateAvatar(_list[i]);
        }
    }
}

function AddAvatar(_avatar){
    var html = '<div id="avtr_'+_avatar.AvatarId+'" class="content-cell avatar"><div class="content-cell-formatter"></div>'+
        '<div class="content-cell-content"><img class="content-image" src="'+
        _avatar.AvatarImageUrl+'"><div class="content-name">'+
        _avatar.AvatarName.makeSafe()+'</div><div class="content-btn first" onclick="GetAvatarDetails(\''+_avatar.AvatarId+'\');">Details</div>'+
        '<div class="content-btn second" onclick="changeAvatar(\''+_avatar.AvatarId+'\');">Change Avatar</div></div></div>';

    cvr('#avatars .list-content .flex-list').addHTML(html);
}

function UpdateAvatar(_avatar){
    cvr('#avatars .list-content .flex-list #avtr_'+_avatar.AvatarId+' .content-name').innerHTML(_avatar.AvatarName.makeSafe());
    if (cvr('#avatars .list-content .flex-list #avtr_'+_avatar.AvatarId+' .content-image').first().getAttribute('src') != _avatar.AvatarImageUrl) {
        cvr('#avatars .list-content .flex-list #avtr_'+_avatar.AvatarId+' .content-image').attr('src', _avatar.AvatarImageUrl);
    }
}

function RemoveAvatar(_avatar){
    cvr('#avatars .list-content .flex-list #avtr_'+_avatar.AvatarId+'').remove();
}

engine.on('AddAvatar', function(_avatar){
    AddAvatar(_avatar);
});

engine.on('UpdateAvatar', function(_avatar){
    UpdateAvatar(_avatar);
});

engine.on('RemoveAvatar', function(_avatar){
    RemoveAvatar(_avatar);
});

//Worlds
var worldFilter = 'wrldactive';
var worldsResetLoad = true;

function loadWorlds(_list){
    worldList = _list;

    renderWorlds(_list, worldsResetLoad);

    //worldsResetLoad = false;
}

function renderWorlds(_list, _forceRefresh){
    var contentList = document.querySelector('#worlds .list-content');

    /*var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){

        html += '<div data-id="'+_list[i].WorldId+'" class="content-cell world"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><img class="content-image" src="'+
                _list[i].WorldImageUrl+'"><div class="content-name">'+
                _list[i].WorldName.makeSafe()+'</div>'+
                '<div  onclick="getWorldDetails(\''+_list[i].WorldId+'\');" class="content-btn second">Details</div>'+
                '</div></div>';
    }

    html+= '</div>';

    contentList.innerHTML = html;*/

    if (_forceRefresh === true) cvr('#worlds .list-content .flex-list').innerHTML('');
    worldsResetLoad = false;
    
    for(var i=0; _list[i]; i++){
        if (cvr('#worlds .list-content .flex-list #wrld_'+_list[i].WorldId+'').length == 0){
            AddWorld(_list[i]);
        } else {
            UpdateWorld(_list[i]);
        }
    }
}

function AddWorld(_world){
    var html = '<div id="wrld_'+_world.WorldId+'" class="content-cell world"><div class="content-cell-formatter"></div>'+
        '<div class="content-cell-content"><img class="content-image" src="'+
        _world.WorldImageUrl+'"><div class="content-name">'+
        _world.WorldName.makeSafe()+'</div>'+
        '<div  onclick="getWorldDetails(\''+_world.WorldId+'\');" class="content-btn second">Details</div>'+
        '</div></div>';

    cvr('#worlds .list-content .flex-list').addHTML(html);
}

function UpdateWorld(_world){
    if (cvr('#worlds .list-content .flex-list #wrld_' + _world.WorldId + ' .content-image').first().getAttribute('src') != _world.WorldImageUrl) {
        cvr('#worlds .list-content .flex-list #wrld_' + _world.WorldId + ' .content-image').attr('src', _world.WorldImageUrl);
    }
    cvr('#worlds .list-content .flex-list #wrld_'+_world.WorldId+' .content-name').innerHTML(_world.WorldName.makeSafe());
}

function RemoveWorld(_world){
    cvr('#worlds .list-content .flex-list #wrld_'+_world.WorldId+'').remove();
}

engine.on('AddWorld', function(_world){
    AddWorld(_world);
});

engine.on('UpdateWorld', function(_world){
    UpdateWorld(_world);
});

engine.on('RemoveWorld', function(_world){
    RemoveWorld(_world);
});

//Friends
var userOnlineState = {};
userOnlineState["tmp"] = false;
function loadFriends(_list){
    friendList = _list;
    
    for (var i=0; i < friendList.length; i++){
        friendList[i].FilterTags += ','+(friendList[i].UserIsOnline?'frndonline':'frndoffline');
    }
    
    renderFriends(_list);
}

function updateUsersOnline(_list){
    for(var i=0; _list[i]; i++){
        userOnlineState["uo-" + _list[i].Id] = _list[i].IsOnline;

        cvr('#friends .list-content .flex-list #frnd_'+_list[i].Id).className('content-cell friend '+(userOnlineState["uo-" + _list[i].Id]?'frndonline':'frndoffline'));
        cvr('#friends .list-content .flex-list #frnd_'+_list[i].Id+' .online-state').className('online-state '+(userOnlineState["uo-" + _list[i].Id]?'online':'offline'));
    }
}

function renderFriends(_list){
    var contentList = document.querySelector('#friends .list-content');

    //var html = '<div class="flex-list">';

    /*for(var i=0; _list[i]; i++){

        html += '<div id="'+_list[i].UserId+'" class="content-cell friend"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><div class="online-state '+(_list[i].UserIsOnline?'online':'offline')+' '+_list[i].FilterTags+'"></div>'+
                '<img class="content-image" src="'+
                _list[i].UserImageUrl+'"><div class="content-name">'+
                _list[i].UserName.makeSafe()+'</div><div class="content-btn second" '+
                'onclick="getUserDetails(\''+_list[i].UserId+'\');">Details</div>'+
                '</div></div>';
    }*/

    //html+= '</div>';
    
    //contentList.innerHTML = html;

    for(var i=0; _list[i]; i++){
        if (cvr('#friends .list-content .flex-list #frnd_'+_list[i].UserId+'').length == 0){
            AddFriend(_list[i]);
        } else {
            UpdateFriend(_list[i]);
        }
    }
}

function filterFriendList(_filter){
    if (_filter == ""){
        cvr('#friends .list-content .flex-list .friend').show();
    } else {
        cvr('#friends .list-content .flex-list .friend').hide();
        cvr('#friends .list-content .flex-list .friend.'+_filter).show();
    }
}

function AddFriend(_friend){
    if (userOnlineState["uo-" + _friend.UserId] !== undefined){
        _friend.UserIsOnline = userOnlineState["uo-" + _friend.UserId];
    }
    
    var html = '<div id="frnd_'+_friend.UserId+'" class="content-cell friend '+(_friend.UserIsOnline?'frndonline':'frndoffline')+'"><div class="content-cell-formatter"></div>'+
        '<div class="content-cell-content"><div class="online-state '+(_friend.UserIsOnline?'online':'offline')+' '+_friend.FilterTags+'"></div>'+
        '<img class="content-image" src="'+
        _friend.UserImageUrl+'"><div class="content-name">'+
        _friend.UserName.makeSafe()+'</div><div class="content-btn second" '+
        'onclick="getUserDetails(\''+_friend.UserId+'\');">Details</div>'+
        '</div></div>';
    
    cvr('#friends .list-content .flex-list').addHTML(html);
}

function UpdateFriend(_friend){
    if (userOnlineState["uo-" + _friend.UserId] !== undefined){
        _friend.UserIsOnline = userOnlineState["uo-" + _friend.UserId];
    }
    
    cvr('#friends .list-content .flex-list #frnd_'+_friend.UserId).className('content-cell friend '+(_friend.UserIsOnline?'frndonline':'frndoffline'));
    cvr('#friends .list-content .flex-list #frnd_'+_friend.UserId+' .online-state').className('online-state '+(_friend.UserIsOnline?'online':'offline')+' '+_friend.FilterTags);
    if (cvr('#friends .list-content .flex-list #frnd_'+_friend.UserId+' .content-image').first().getAttribute('src') != _friend.UserImageUrl) {
        cvr('#friends .list-content .flex-list #frnd_' + _friend.UserId + ' .content-image').attr('src', _friend.UserImageUrl);
    }
    cvr('#friends .list-content .flex-list #frnd_'+_friend.UserId+' .content-name').innerHTML(_friend.UserName.makeSafe());
}

function RemoveFriend(_friend){
    cvr('#friends .list-content .flex-list [data-id="'+_friend.UserId+'"]').remove();
}

engine.on('AddFriend', function(_friend){
    AddFriend(_friend);
});

engine.on('UpdateFriend', function(_friend){
    UpdateFriend(_friend);
});

engine.on('RemoveFriend', function(_friend){
    RemoveFriend(_friend);
});

//Categories
engine.on('LoadCategories', function(_categories){
    RenderCategories(_categories);
    categoriesLoaded = true;
});

var categories = [];
categories[0] = [];
categories[1] = [];
categories[2] = [];
categories[3] = [];
categories[4] = [];
categories[500] = [];

function RenderCategories(_categories){
    for (var i=0; i < _categories.length; i++){
        var category = _categories[i];
        categories[category.CategoryParent.value__][category.CategoryKey] = category;
    }
    
    var html = '';
    for (var i in categories[0]){
        html += '<div class="filter-option data-filter-'+categories[0][i].CategoryKey+
            '" onclick="filterContent(\'friends\', \''+
            categories[0][i].CategoryKey+'\');">'+categories[0][i].CategoryClearTextName.makeSafe()+'</div>';
    }
    document.querySelector('#friends .filter-content').innerHTML = html;

    html = '';
    for (var i in categories[1]){
        html += '<div class="filter-option data-filter-'+categories[1][i].CategoryKey+
            '" onclick="filterContent(\'groups\', \''+
            categories[1][i].CategoryKey+'\');">'+categories[1][i].CategoryClearTextName.makeSafe()+'</div>';
    }
    //document.querySelector('#groups .filter-content').innerHTML = html;

    html = '';
    for (var i in categories[2]){
        html += '<div class="filter-option data-filter-'+categories[2][i].CategoryKey+
            '" onclick="filterContent(\'worlds\', \''+
            categories[2][i].CategoryKey+'\');">'+categories[2][i].CategoryClearTextName.makeSafe()+'</div>';
    }
    document.querySelector('#worlds .filter-content').innerHTML = html;
    
    html = '';
    for (var i in categories[3]){
        html += '<div class="filter-option data-filter-'+categories[3][i].CategoryKey+
            '" onclick="filterContent(\'avatars\', \''+
            categories[3][i].CategoryKey+'\');">'+categories[3][i].CategoryClearTextName.makeSafe()+'</div>';
        if (categories[3][i].CategoryKey.length >= 50 && !window.avatarCategories.some(item => item.CategoryKey == categories[3][i].CategoryKey)){
            window.avatarCategories.push(categories[3][i]);
        }
    }
    document.querySelector('#avatars .filter-content').innerHTML = html;

    html = '';
    for (var i in categories[4]){
        html += '<div class="filter-option data-filter-'+categories[4][i].CategoryKey+
            '" onclick="filterContent(\'props\', \''+
            categories[4][i].CategoryKey+'\');">'+categories[4][i].CategoryClearTextName.makeSafe()+'</div>';
    }
    document.querySelector('#props .filter-content').innerHTML = html;
}


//SearchResults
function filterSearch(_category){
    var resultsUsers = document.getElementById('searchResultsUsers');
    var resultsAvatars = document.getElementById('searchResultsAvatars');
    var resultsWorlds = document.getElementById('searchResultsWorlds');
    var resultsProps = document.getElementById('searchResultsProps');
    
    switch(_category){
        case '':
            resultsUsers.classList.remove('hidden');
            resultsAvatars.classList.remove('hidden');
            resultsWorlds.classList.remove('hidden');
            resultsProps.classList.remove('hidden');
            break;
        case 'users':
            resultsUsers.classList.remove('hidden');
            resultsAvatars.classList.add('hidden');
            resultsWorlds.classList.add('hidden');
            resultsProps.classList.add('hidden');
            break;
        case 'avatars':
            resultsUsers.classList.add('hidden');
            resultsAvatars.classList.remove('hidden');
            resultsWorlds.classList.add('hidden');
            resultsProps.classList.add('hidden');
            break;
        case 'worlds':
            resultsUsers.classList.add('hidden');
            resultsAvatars.classList.add('hidden');
            resultsWorlds.classList.remove('hidden');
            resultsProps.classList.add('hidden');
            break;
        case 'props':
            resultsUsers.classList.add('hidden');
            resultsAvatars.classList.add('hidden');
            resultsWorlds.classList.add('hidden');
            resultsProps.classList.remove('hidden');
            break;
    }

    document.querySelector('#search .list-content').scrollTop = 0;
}
function loadSearch(){
    var term = document.getElementById('globalSearch').value;
    console.log("Search for: "+term);
    engine.call('CVRAppCallSubmitSearch', term);
}

var searchUsers = [];
var searchAvatars = [];
var searchWorlds = [];
var searchProps = [];

function displaySearch(_results){
    var userCount = document.querySelector('#searchResultsUsers .result-count');
    var userCountSmall = document.querySelector('.data-filter-users .result-count');
    var userWrapper = document.querySelector('#searchResultsUsers .search-result-wrapper');
    var avatarCount = document.querySelector('#searchResultsAvatars .result-count');
    var avatarCountSmall = document.querySelector('.data-filter-avatars .result-count');
    var avatarWrapper = document.querySelector('#searchResultsAvatars .search-result-wrapper');
    var worldCount = document.querySelector('#searchResultsWorlds .result-count');
    var worldCountSmall = document.querySelector('.data-filter-worlds .result-count');
    var worldWrapper = document.querySelector('#searchResultsWorlds .search-result-wrapper');
    var propCount = document.querySelector('#searchResultsProps .result-count');
    var propCountSmall = document.querySelector('.data-filter-props .result-count');
    var propWrapper = document.querySelector('#searchResultsProps .search-result-wrapper');

    searchUsers = [];
    searchAvatars = [];
    searchWorlds = [];
    searchProps = [];
    
    for (var i=0; _results[i]; i++){
        switch(_results[i].ResultType){
            case "user":
                searchUsers.push(_results[i]);
                break;
            case "world":
                searchWorlds.push(_results[i]);
                break;
            case "avatar":
                searchAvatars.push(_results[i]);
                break;
            case "prop":
                searchProps.push(_results[i]);
                break;
        }
    }
    
    userCount.innerHTML = searchUsers.length;
    userCountSmall.innerHTML = searchUsers.length;
    avatarCount.innerHTML = searchAvatars.length;
    avatarCountSmall.innerHTML = searchAvatars.length;
    worldCount.innerHTML = searchWorlds.length;
    worldCountSmall.innerHTML = searchWorlds.length;
    propCount.innerHTML = searchProps.length;
    propCountSmall.innerHTML = searchProps.length;
    
    var userHtml = '';

    for(var i=0; searchUsers[i]; i++){
        if(i%5 === 0){
            if(i !== 0){
                userHtml += '</div>';
            }
            userHtml += '<div class="content-row">';
        }

        userHtml += '<div class="content-cell friend"><div class="content-cell-formatter"></div>'+
            '<div class="content-cell-content">'+
            '<img class="content-image" src="'+
            searchUsers[i].ResultImageUrl+'"><div class="content-name">'+
            searchUsers[i].ResultName.makeSafe()+'</div><div class="content-btn second" '+
            'onclick="getUserDetails(\''+searchUsers[i].ResultId+'\');">Details</div>'+
            '</div></div>';
    }

    userWrapper.innerHTML = userHtml;



    var avatarHtml = '';

    for(var i=0; searchAvatars[i]; i++){
        if(i%4 === 0){
            if(i !== 0){
                avatarHtml += '</div>';
            }
            avatarHtml += '<div class="content-row">';
        }

        avatarHtml += '<div class="content-cell avatar"><div class="content-cell-formatter"></div>'+
            '<div class="content-cell-content"><img class="content-image" src="'+
            searchAvatars[i].ResultImageUrl+'"><div class="content-name">'+
            searchAvatars[i].ResultName.makeSafe()+'</div><div class="content-btn first" onclick="GetAvatarDetails(\''+searchAvatars[i].ResultId+'\');">Details</div>'+
            '<div class="content-btn second" onclick="changeAvatar(\''+searchAvatars[i].ResultId+'\');">Change Avatar</div></div></div>';
    }

    avatarWrapper.innerHTML = avatarHtml;



    var worldHtml = '';

    for(var i=0; searchWorlds[i]; i++){
        if(i%4 === 0){
            if(i !== 0){
                worldHtml += '</div>';
            }
            worldHtml += '<div class="content-row">';
        }

        worldHtml += '<div class="content-cell world"><div class="content-cell-formatter"></div>'+
            '<div class="content-cell-content"><img class="content-image" src="'+
            searchWorlds[i].ResultImageUrl+'"><div class="content-name">'+
            searchWorlds[i].ResultName.makeSafe()+'</div>'+
            '<div onclick="getWorldDetails(\''+searchWorlds[i].ResultId+'\');" class="content-btn second">Details</div>'+
            '</div></div>';
    }

    worldWrapper.innerHTML = worldHtml;

    
    
    var propHtml = '';

    for(var i=0; searchProps[i]; i++){
        if(i%4 === 0){
            if(i !== 0){
                propHtml += '</div>';
            }
            propHtml += '<div class="content-row">';
        }

        propHtml += '<div class="content-cell prop"><div class="content-cell-formatter"></div>'+
            '<div class="content-cell-content"><img class="content-image" src="'+
            searchProps[i].ResultImageUrl+'"><div class="content-name">'+
            searchProps[i].ResultName.makeSafe()+'</div>'+
            '<div class="content-btn first disabled zero">Details</div>'+
            '<div class="content-btn first" onclick="SelectProp(\''+searchProps[i].ResultId+'\', \''+searchProps[i].ResultImageUrl+'\', \''+searchProps[i].ResultName.makeParameterSafe()+'\');">Select Prop</div>'+
            '<div onclick="SpawnProp(\''+searchProps[i].ResultId+'\');" class="content-btn second">Drop</div>'+
            '</div></div>';
    }

    propWrapper.innerHTML = propHtml;
}

//Invites
engine.on('LoadInvites', function(_list){
    renderInvites(_list);
});

function renderInvites(_list){
    var html = '';

    for(var i=0; _list[i]; i++){

        html += '<div class="message-content message-invite" data-id="'+_list[i].InviteMeshId+'">'+
            '        <img src="'+_list[i].WorldImageUrl+'" class="message-image">'+
            '        <div class="message-text-wrapper">'+
            '            <div class="message-name">'+_list[i].SenderUsername.makeSafe()+' invited you to join their session<br>'+_list[i].InstanceName.makeSafe()+'</div>'+
            '            <div class="message-text"></div>'+
            '        </div>'+
            '        <div class="message-btn" onclick="showInstanceDetails(\''+_list[i].InstanceMeshId+'\')">'+
            '            <img src="gfx/details.svg">'+
            '            Details</div>'+
            '        <div class="message-btn" onclick="respondeInvite(\''+_list[i].InviteMeshId+'\', \'accept\')">'+
            '            <img src="gfx/accept.svg">'+
            '            Accept</div>'+
            '        <div class="message-btn" onclick="respondeInvite(\''+_list[i].InviteMeshId+'\', \'deny\')">'+
            '            <img src="gfx/deny.svg">'+
            '            Deny</div>'+
            '        <div class="message-btn" onclick="respondeInvite(\''+_list[i].InviteMeshId+'\', \'silence\')">'+
            '            <img src="gfx/silence.svg">'+
            '            Silence</div>'+
            '    </div>';
    }

    html+= '';

    document.querySelector('#message-invites .message-list').innerHTML = html;
    document.querySelector('.messages-invites > .filter-number').innerHTML = _list.length;
}

function AddInvite(_invite){
    
    var html = '<div class="message-content message-invite" data-id="'+_invite.InviteMeshId+'">'+
        '        <img src="'+_invite.WorldImageUrl+'" class="message-image">'+
        '        <div class="message-text-wrapper">'+
        '            <div class="message-name">'+_invite.SenderUsername.makeSafe()+' invited you to join their session<br>'+_invite.InstanceName.makeSafe()+'</div>'+
        '            <div class="message-text"></div>'+
        '        </div>'+
        '        <div class="message-btn" onclick="showInstanceDetails(\''+_invite.InstanceMeshId+'\')">'+
        '            <img src="gfx/details.svg">'+
        '            Details</div>'+
        '        <div class="message-btn" onclick="respondeInvite(\''+_invite.InviteMeshId+'\', \'accept\')">'+
        '            <img src="gfx/accept.svg">'+
        '            Accept</div>'+
        '        <div class="message-btn" onclick="respondeInvite(\''+_invite.InviteMeshId+'\', \'deny\')">'+
        '            <img src="gfx/deny.svg">'+
        '            Deny</div>'+
        '        <div class="message-btn" onclick="respondeInvite(\''+_invite.InviteMeshId+'\', \'silence\')">'+
        '            <img src="gfx/silence.svg">'+
        '            Silence</div>'+
        '    </div>';

    cvr('#message-invites .message-list').addHTML(html);
    document.querySelector('.messages-invites > .filter-number').innerHTML = cvr('#message-invites .message-list .message-invite').length;
}

function UpdateInvite(_invite){
    //NOP
}

function RemoveInvite(_invite){
    cvr('#invites .list-content .flex-list [data-id="'+_invite.InviteMeshId+'"]').remove();
}

engine.on('AddInvite', function(_invite){
    AddInvite(_invite);
});

engine.on('UpdateInvite', function(_invite){
    UpdateInvite(_invite);
});

engine.on('RemoveInvite', function(_invite){
    RemoveInvite(_invite);
});

//Settings
function switchSettingCategorie(_id, _e){
    var buttons = document.querySelectorAll('#settings .filter-option');
    var categories = document.querySelectorAll('#settings .settings-categorie');

    for(var i = 0; i < buttons.length; i++){
        buttons[i].classList.remove('active');
    }

    for(var i = 0; i < categories.length; i++){
        categories[i].classList.remove('active');
    }

    _e.classList.add('active');
    
    if (_id == "settings-audio")
    {
        LoadMicrophones();
    }

    if (_id == "settings-graphics")
    {
        LoadResolutions();
    }

    document.getElementById(_id).classList.add('active');
}

//Messages
function switchMessageCategorie(_id, _e){
    var buttons = document.querySelectorAll('#messages .filter-option');
    var categories = document.querySelectorAll('#messages .message-categorie');

    for(var i = 0; i < buttons.length; i++){
        buttons[i].classList.remove('active');
    }

    for(var i = 0; i < categories.length; i++){
        categories[i].classList.remove('active');
    }

    _e.classList.add('active');

    document.getElementById(_id).classList.add('active');
}

function loadMessages(_invites, _friendrequests, _votes, _systems, _dms){
    var html = '';
    for(var i=0; i < _invites.length; i++){
        html += displayMessageInvite(_invites[i]);
    }
    if(_invites.length == 0){
        html = '<div class="noMessagesWrapper">'+
'            <div class="noMessagesInfo">'+
'                <img src="gfx\\attention.svg">'+
'                <div>'+
'                    No invites found.'+
'                </div>'+
'            </div>'+
'        </div>';
    }
    document.querySelector('#message-invites .message-list').innerHTML = html;
    document.querySelector('.messages-invites > .filter-number').innerHTML = _invites.length;

    html = '';
    for(i=0; i < _friendrequests.length; i++){
        html += displayMessageFriendRequest(_friendrequests[i]);
    }
    if(_friendrequests.length == 0){
        html = '<div class="noMessagesWrapper">'+
'            <div class="noMessagesInfo">'+
'                <img src="gfx\\attention.svg">'+
'                <div>'+
'                    No friend requests found.'+
'                </div>'+
'            </div>'+
'        </div>';
    }
    document.querySelector('#message-friendrequests .message-list').innerHTML = html;
    document.querySelector('.message-friendrequests > .filter-number').innerHTML = _friendrequests.length;

    html = '';
    for(i=0; i < _votes.length; i++){
        html += displayMessageVote(_votes[i]);
    }
    if(_votes.length == 0){
        html = '<div class="noMessagesWrapper">'+
'            <div class="noMessagesInfo">'+
'                <img src="gfx\\attention.svg">'+
'                <div>'+
'                    No votes found.'+
'                </div>'+
'            </div>'+
'        </div>';
    }
    document.querySelector('#message-votes .message-list').innerHTML = html;
    document.querySelector('.message-votes > .filter-number').innerHTML = _votes.length;

    html = '';
    for(i=0; i < _systems.length; i++){
        html += displayMessageSystem(_systems[i]);
    }
    if(_systems.length == 0){
        html = '<div class="noMessagesWrapper">'+
'            <div class="noMessagesInfo">'+
'                <img src="gfx\\attention.svg">'+
'                <div>'+
'                    No system messages found.'+
'                </div>'+
'            </div>'+
'        </div>';
    }
    document.querySelector('#message-system .message-list').innerHTML = html;
    document.querySelector('.message-system > .filter-number').innerHTML = _systems.length;

    html = '';
    for(i=0; i < _dms.length; i++){
        html += displayMessageDM(_dms[i]);
    }
    if(_dms.length == 0){
        html = '<div class="noMessagesWrapper">'+
'            <div class="noMessagesInfo">'+
'                <img src="gfx\\attention.svg">'+
'                <div>'+
'                    No direct messages found.'+
'                </div>'+
'            </div>'+
'        </div>';
    }
    document.querySelector('#message-dm .message-list').innerHTML = html;
    document.querySelector('.message-dm > .filter-number').innerHTML = _dms.length;
}

function displayMessageInvite(_invite){
    return '<div class="message-content message-invite" id="notification_invite_'+_invite.InviteId+'">'+
'        <img src="'+_invite.WorldImageUrl+'" class="message-image">'+
'        <div class="message-text-wrapper">'+
'            <div class="message-name">'+_invite.SenderUsername.makeSafe()+' invited you to join their session<br>'+_invite.InstanceName.makeSafe()+'</div>'+
'            <div class="message-text"></div>'+
'        </div>'+
'        <div class="message-btn" onclick="showInstanceDetails(\''+_invite.InstanceName+'\')">'+
'            <img src="gfx/details.svg">'+
'            Details</div>'+
'        <div class="message-btn" onclick="respondeInvite(\''+_invite.InviteMeshId+'\', \'accept\')">'+
'            <img src="gfx/accept.svg">'+
'            Accept</div>'+
'        <div class="message-btn" onclick="respondeInvite(\''+_invite.InviteMeshId+'\', \'deny\')">'+
'            <img src="gfx/deny.svg">'+
'            Deny</div>'+
'        <div class="message-btn" onclick="respondeInvite(\''+_invite.InviteMeshId+'\', \'silence\')">'+
'            <img src="gfx/silence.svg">'+
'            Silence</div>'+
'    </div>';
}

function displayMessageInviteRequest(_request){
    return '<div class="message-content message-invite" id="notification_invite_request_'+_invite.InviteId+'">'+
        '        <img src="'+_invite.WorldImageUrl+'" class="message-image">'+
        '        <div class="message-text-wrapper">'+
        '            <div class="message-name">'+_invite.RequestMessage.makeSafe()+'</div>'+
        '            <div class="message-text"></div>'+
        '        </div>'+
        '        <div class="message-btn" onclick="respondeInviteRequest(\''+_invite.InviteId+'\', \'accept\')">'+
        '            <img src="gfx/accept.svg">'+
        '            Accept</div>'+
        '        <div class="message-btn" onclick="respondeInviteRequest(\''+_invite.InviteId+'\', \'deny\')">'+
        '            <img src="gfx/deny.svg">'+
        '            Deny</div>'+
        '        <div class="message-btn" onclick="respondeInviteRequest(\''+_invite.InviteId+'\', \'silence\')">'+
        '            <img src="gfx/silence.svg">'+
        '            Silence</div>'+
        '    </div>';
}

function respondeInvite(_guid, _response){
    engine.call('CVRAppCallRespondToInvite', _guid, _response);
}

function respondeInviteRequest(_guid, _response){
    engine.call('CVRAppCallRespondToInviteRequest', _guid, _response);
}

function displayMessageFriendRequest(_friendrequest){
    return '<div class="message-content message-friendrequest" id="notification_friend_request_'+_friendrequest.UserId+'">'+
'        <img src="'+_friendrequest.UserImageUrl+'" class="message-image">'+
'        <div class="message-text-wrapper">'+
'            <div class="message-name">'+_friendrequest.UserName.makeSafe()+' sent you a friend request</div>'+
'            <div class="message-text"></div>'+
'        </div>'+
'        <div class="message-btn" onclick="getUserDetails(\''+_friendrequest.UserId+'\');">'+
'            <img src="gfx/details.svg">'+
'            Profile</div>'+
'        <div class="message-btn" onclick="acceptFriend(\''+_friendrequest.UserId+'\')">'+
'            <img src="gfx/accept.svg">'+
'            Accept</div>'+
'        <div class="message-btn" onclick="denyFriend(\''+_friendrequest.UserId+'\')">'+
'            <img src="gfx/deny.svg">'+
'            Deny</div>'+
'    </div>';
}

function displayMessageVote(_vote){
    return '<div class="message-content message-vote">'+
'        <img src="gfx/home.svg" class="message-image">'+
'        <div class="message-text-wrapper">'+
'            <div class="message-name">Name</div>'+
'            <div class="message-text"></div>'+
'        </div>'+
'        <div class="message-btn" onclick="respondeVote(\'\', true)">'+
'            <img src="gfx/accept.svg">'+
'            Yes</div>'+
'        <div class="message-btn" onclick="respondeVote(\'\', false)">'+
'            <img src="gfx/deny.svg">'+
'            No</div>'+
'    </div>';
}

function respondeVote(_guid, _response){
    engine.call('CVRAppCallRespondToVote', _guid, _response);
}

function displayMessageSystem(_system){
    return '<div class="message-content message-system">'+
'        <img src="gfx/home.svg" class="message-image">'+
'        <div class="message-text-wrapper">'+
'            <div class="message-name">'+_system.HeaderText.makeSafe()+'</div>'+
'            <div class="message-text">'+_system.LongText.makeSafe()+'</div>'+
'        </div>'+
'        <div class="message-btn" onclick="respondeSystem(\'\', true)">'+
'            <img src="gfx/accept.svg">'+
'            Okay</div>'+
'        <div class="message-btn" onclick="respondeSystem(\'\', false)">'+
'            <img src="gfx/deny.svg">'+
'            Dismiss</div>'+
'    </div>';
}

function respondeSystem(_guid, _response){
    engine.call('CVRAppCallRespondToSystem', _guid, _response);
}

function displayMessageDM(_dm){
    return '<div class="message-content message-dm">'+
'        <img src="gfx/home.svg" class="message-image">'+
'        <div class="message-text-wrapper">'+
'            <div class="message-name">Name</div>'+
'            <div class="message-text"></div>'+
'        </div>'+
'        <div class="message-btn">'+
'            <img src="gfx/chat.svg">'+
'            Chat</div>'+
'    </div>';
}

function loadMessagesSingle(_cat, _list){
    switch(_cat){
        case 'invites':
                var html = '';
                for(var i=0; i < _list.length; i++){
                    html += displayMessageInvite(_list[i]);
                }
                if(_list.length == 0){
                    html = '<div class="noMessagesWrapper">'+
                        '            <div class="noMessagesInfo">'+
                        '                <img src="gfx\\attention.svg">'+
                        '                <div>'+
                        '                    No invites found.'+
                        '                </div>'+
                        '            </div>'+
                        '        </div>';
                }
                document.querySelector('#message-invites .message-list').innerHTML = html;
                document.querySelector('.messages-invites > .filter-number').innerHTML = _list.length;
            break;
        case 'invite-requets':
            var html = '';
            for(var i=0; i < _list.length; i++){
                html += displayMessageInviteRequest(_list[i]);
            }
            if(_list.length == 0){
                html = '<div class="noMessagesWrapper">'+
                    '            <div class="noMessagesInfo">'+
                    '                <img src="gfx\\attention.svg">'+
                    '                <div>'+
                    '                    No invite requests found.'+
                    '                </div>'+
                    '            </div>'+
                    '        </div>';
            }
            document.querySelector('#message-invite-requests .message-list').innerHTML = html;
            document.querySelector('.messages-invite-requests > .filter-number').innerHTML = _list.length;
            break;
        case 'system-notifications':
            var html = '';
            for(var i=0; i < _list.length; i++){
                //html += displayMessageInvite(_list[i]);
            }
            if(_list.length == 0){
                html = '<div class="noMessagesWrapper">'+
                    '            <div class="noMessagesInfo">'+
                    '                <img src="gfx\\attention.svg">'+
                    '                <div>'+
                    '                    No System Notifications found.'+
                    '                </div>'+
                    '            </div>'+
                    '        </div>';
            }
            document.querySelector('#message-system .message-list').innerHTML = html;
            document.querySelector('.messages-system > .filter-number').innerHTML = _list.length;
            break;
        case 'friend-requests':
            var html = '';
            for(var i=0; i < _list.length; i++){
                html += displayMessageFriendRequest(_list[i]);
            }
            if(_list.length == 0){
                html = '<div class="noMessagesWrapper">'+
                    '            <div class="noMessagesInfo">'+
                    '                <img src="gfx\\attention.svg">'+
                    '                <div>'+
                    '                    No Friend Request found.'+
                    '                </div>'+
                    '            </div>'+
                    '        </div>';
            }
            document.querySelector('#message-friendrequests .message-list').innerHTML = html;
            document.querySelector('.message-friendrequests > .filter-number').innerHTML = _list.length;
            break;
    }
}

var propList = [];
//Props
function loadProps(_list){
    propList = _list;

    renderProps(_list);
}

function renderProps(_list){
    var contentList = document.querySelector('#props .list-content');

    /*var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){

        html += '<div data-id="'+_list[i].SpawnableId+'" class="content-cell prop"><div class="content-cell-formatter"></div>'+
            '<div class="content-cell-content"><img class="content-image" src="'+
            _list[i].SpawnableImageUrl+'"><div class="content-name">'+
            _list[i].SpawnableName.makeSafe()+'</div><div class="content-btn first disabled zero">Details</div>'+
            '<div class="content-btn first" onclick="SelectProp(\''+_list[i].SpawnableId+'\', \''+_list[i].SpawnableImageUrl+'\', \''+_list[i].SpawnableName.makeParameterSafe()+'\');">Select Prop</div>'+
            '<div class="content-btn second" onclick="SpawnProp(\''+_list[i].SpawnableId+'\');">Drop Prop</div></div></div>';
    }

    html += '</div>';
    
    contentList.innerHTML = html;*/

    for(var i=0; _list[i]; i++){
        if (cvr('#props .list-content .flex-list #prp_'+_list[i].SpawnableId+'').length == 0){
            AddProp(_list[i]);
        } else {
            UpdateProp(_list[i]);
        }
    }
}

function AddProp(_prop){
    var html = '<div id="prp_'+_prop.SpawnableId+'" class="content-cell prop"><div class="content-cell-formatter"></div>'+
        '<div class="content-cell-content"><img class="content-image" src="'+
        _prop.SpawnableImageUrl+'"><div class="content-name">'+
        _prop.SpawnableName.makeSafe()+'</div><div class="content-btn first disabled zero">Details</div>'+
        '<div class="content-btn first" onclick="SelectProp(\''+_prop.SpawnableId+'\', \''+_prop.SpawnableImageUrl+'\', \''+_prop.SpawnableName.makeParameterSafe()+'\');">Select Prop</div>'+
        '<div class="content-btn second" onclick="SpawnProp(\''+_prop.SpawnableId+'\');">Drop Prop</div></div></div>';

    cvr('#props .list-content .flex-list').addHTML(html);
}

function UpdateProp(_prop){
    if (cvr('#props .list-content .flex-list #prp_' + _prop.SpawnableId + ' .content-image').first().getAttribute('src') != _prop.SpawnableImageUrl) {
        cvr('#props .list-content .flex-list #prp_' + _prop.SpawnableId + ' .content-image').attr('src', _prop.SpawnableImageUrl);
    }
    cvr('#props .list-content .flex-list #prp_'+_prop.SpawnableId+' .content-name').innerHTML(_prop.SpawnableName.makeSafe());
}

function RemoveProp(_prop){
    cvr('#props .list-content .flex-list #prp_'+_prop.SpawnableId+'').remove();
}

engine.on('AddProp', function(_prop){
    AddProp(_prop);
});

engine.on('UpdateProp', function(_prop){
    UpdateProp(_prop);
});

engine.on('RemoveProp', function(_prop){
    RemoveProp(_prop);
});

function SpawnProp(_uid){
    engine.call('CVRAppCallSpawnProp', _uid);
}
function SelectProp(_uid, _image, _name){
    engine.call('CVRAppCallSelectProp', _uid, _image, _name);
}
function DeletePropMode(){
    engine.trigger('CVRAppCallDeletePropMode');
}
function ReloadAllAvatars(){
    engine.trigger('CVRAppActionReloadAllAvatars');
}

//World Details
function getWorldDetails(_uid){
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

var currentWorldDetails = {};

function loadWorldDetails(_data, _instances){
    currentWorldDetails = _data;
    var detailPage = document.getElementById('world-detail');

    document.querySelector('#world-detail h1').innerHTML = 'World: '+_data.WorldName.makeSafe();
    document.querySelector('.data-worldName').innerHTML = _data.WorldName.makeSafe();
    document.querySelector('.data-description').innerHTML = _data.WorldDescription.makeSafe();
    document.querySelector('.data-adminTags').innerHTML = _data.AdminTags.replace(/,/g, ' ').makeSafe();
    document.querySelector('.data-safetyTags').innerHTML = _data.SafetyTags.replace(/,/g, ' ').makeSafe();
    document.querySelector('.data-fileSize').innerHTML = _data.WorldSize;
    document.querySelector('.data-uploaded').innerHTML = _data.UploadedAt;
    document.querySelector('.data-updated').innerHTML = _data.UpdatedAt;

    document.querySelector('.data-worldImage').src = _data.WorldImageUrl;
    document.querySelector('.data-worldPreload').setAttribute('onclick', 'preloadWorld(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldExplore').setAttribute('onclick', 'changeWorld(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldSetHome').setAttribute('onclick', 'setHome(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldAuthorImage').src = _data.AuthorImageUrl;
    document.querySelector('.data-authorName').innerHTML = _data.AuthorName.makeSafe();
    document.querySelector('.action-btn.data-author-profile').setAttribute('onclick', 'getUserDetails(\''+_data.AuthorId+'\');');

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

function updateWorldDetailInstances(_instances){
    var html = '';

    for(var i=0; i < _instances.length; i++){
        html += generateInstanceHTML(_instances[i]);
    }

    if(_instances.length == 0){
        html = '<div class="world-instances-empty-message">There are currently no open instances for this world</div>';
    }

    document.querySelector('.data-worldInstances').innerHTML = html;
}

function addWorldDetailInstance(_instance){
    uiLoadingClose();

    var instances = document.querySelectorAll('#world-detail .world-instance');

    for(var i=0; i < instances.length; i++){
        instances[i].classList.remove('new');
    }

    var html = generateInstanceHTML(_instance, true);
    document.querySelector('.data-worldInstances').insertAdjacentHTML('afterbegin', html);

    var empty = document.querySelector('.world-instances-empty-message');
    if(empty != null){
        empty.parentNode.removeChild(empty);
    }
}

function generateInstanceHTML(_instance, _new){
    return '<div class="world-instance '+(_new === true?'new':'')+'" onclick="showInstanceDetails(\''+_instance.InstanceId+'\');">'+
                '    <div style="background-image: url('+currentWorldDetails.WorldImageUrl+');" class="instance-image"></div>'+
                '    <div class="playerCount">'+_instance.CurrentPlayerCount+'</div>'+
                '    <div class="instanceRegion">'+_instance.InstanceRegion+'</div>'+
                '    <div class="instanceName">'+_instance.InstanceName.makeSafe()+'</div>'+
                '</div>';
}

function closeWorldDetail(){
    var detailPage = document.getElementById('world-detail');
    detailPage.classList.remove('in');
    detailPage.classList.add('out');
    setTimeout(function(){
        detailPage.classList.add('hidden');
        detailPage.classList.remove('out');
    }, 200);
}

function showCreateInstance(){
    var createInstance = document.getElementById('world-instance-create');
    createInstance.classList.remove('hidden');
    createInstance.classList.add('in');
}

function instancingChangeType(_type, _e){
    document.getElementById('instancing-type').value = _type;

    var buttons = document.querySelectorAll('.instancing-type-btn');
    for(var i=0; buttons[i]; i++){
        buttons[i].classList.remove('active');
    }

    _e.classList.add('active');
}

function instancingChangeRegion(_region, _e){
    document.getElementById('instancing-region').value = _region;

    var buttons = document.querySelectorAll('.region-select');
    for(var i=0; buttons[i]; i++){
        buttons[i].classList.remove('active');
    }

    _e.classList.add('active');
}

function instancingChangeRule(_region, _e){
    document.getElementById('instancing-rule').value = _region;

    var buttons = document.querySelectorAll('.rule-select');
    for(var i=0; buttons[i]; i++){
        buttons[i].classList.remove('active');
    }

    _e.classList.add('active');
}

function instancingCreateInstance(_uid){
    var type = document.getElementById('instancing-type').value;
    var region = document.getElementById('instancing-region').value;
    var rule = document.getElementById('instancing-rule').value;

    engine.call('CVRAppCallCreateInstance', _uid, type, region, rule);
    hideCreateInstance();
    uiLoadingShow('Your instance is being created.');
}

function hideCreateInstance(){
    var createInstance = document.getElementById('world-instance-create');

    createInstance.classList.remove('in');
    createInstance.classList.add('out');
    setTimeout(function(){
        createInstance.classList.add('hidden');
        createInstance.classList.remove('out');
    }, 200);
}

//Instance Detail
function closeInstanceDetail(){
    var detailPage = document.getElementById('instance-detail');
    detailPage.classList.remove('in');
    detailPage.classList.add('out');
    setTimeout(function(){
        detailPage.classList.add('hidden');
        detailPage.classList.remove('out');
    }, 200);
}

function showInstanceDetails(_uid){
    engine.call('CVRAppCallGetInstanceDetails', _uid);
}

engine.on('LoadInstanceDetails', function (_instance) {
    loadInstanceDetail(_instance);
});

function loadInstanceDetail(_instance){
    var detailPage = document.getElementById('instance-detail');
    closeAvatarSettings();
    
    document.querySelector('#instance-detail h1').innerHTML = "Instance: "+_instance.InstanceName.makeSafe();

    document.querySelector('#instance-detail .profile-image').src = _instance.Owner.UserImageUrl;
    document.querySelector('#instance-detail .content-instance-owner h2').innerHTML = _instance.Owner.UserName.makeSafe();
    document.querySelector('#instance-detail .content-instance-owner h3').innerHTML = _instance.Owner.UserRank;

    document.querySelector('#instance-detail .profile-badge img').src = _instance.Owner.FeaturedBadgeImageUrl;
    document.querySelector('#instance-detail .profile-badge p').innerHTML = _instance.Owner.FeaturedBadgeName;

    document.querySelector('#instance-detail .profile-group img').src = _instance.Owner.FeaturedGroupImageUrl;
    document.querySelector('#instance-detail .profile-group p').innerHTML = _instance.Owner.FeaturedGroupName.makeSafe();

    document.querySelector('#instance-detail .profile-avatar img').src = _instance.Owner.CurrentAvatarImageUrl;
    document.querySelector('#instance-detail .profile-avatar p').innerHTML = _instance.Owner.CurrentAvatarName.makeSafe();


    document.querySelector('#instance-detail .world-image').src = _instance.World.WorldImageUrl;
    document.querySelector('#instance-detail .content-instance-world h2').innerHTML = _instance.World.WorldName.makeSafe();
    document.querySelector('#instance-detail .content-instance-world p').innerHTML = 'by '+_instance.World.AuthorName.makeSafe();
    document.querySelector('#instance-detail .content-instance-world p').setAttribute(
        'onclick', 'getUserDetails(\''+_instance.World.AuthorId+'\');');


    document.querySelector('#instance-detail .data-type').innerHTML = _instance.Privacy;
    document.querySelector('#instance-detail .data-region').innerHTML = _instance.Region;
    document.querySelector('#instance-detail .data-gamemode').innerHTML = _instance.GameMode;
    document.querySelector('#instance-detail .data-maxplayers').innerHTML = _instance.MaxPlayer;
    document.querySelector('#instance-detail .data-currplayers').innerHTML = _instance.CurrentPlayer;


    document.querySelector('#instance-detail .instance-btn.joinBtn').
        setAttribute('onclick', 'joinInstance(\''+_instance.InstanceId+'\', \''+_instance.World.WorldId+'\');');
    document.querySelector('#instance-detail .instance-btn.portalBtn').
        setAttribute('onclick', 'dropInstancePortal(\''+_instance.InstanceId+'\');');


    var html = '';

    for(var i=0; i < _instance.Users.length; i++){
        html += '<div class="instancePlayer" onclick="getUserDetails(\''+_instance.Users[i].UserId+'\');"><img class="instancePlayerImage" src="'+
            _instance.Users[i].UserImageUrl+'"><div class="instancePlayerName">'+
            _instance.Users[i].UserName.makeSafe()+'</div></div>';
    }

    document.querySelector('#instance-detail .content-instance-players .scroll-content').innerHTML = html;

    document.querySelector('#instance-detail .content-instance-players .scroll-content').scrollTop = 0;
    
    detailPage.classList.remove('hidden');
    detailPage.classList.add('in');
}

//User Details
function getUserDetails(_uid){
    engine.call('CVRAppCallGetUserDetails', _uid);
}

var PlayerData = {};

var userProfileMute;
var userProfileVolume;
var userProfilePlayerAvatarsBlocked;
var userProfileBundleVerifierBypass;
var userProfileAvatarBlocked;
var userProfilePropBlocked;

function loadUserDetails(_data, _profile){
    PlayerData = _data;
    var detailPage = document.getElementById('user-detail');

    document.querySelector('#user-detail h1').innerHTML = 'Profile: '+_data.UserName.makeSafe();

    document.querySelector('#user-detail .online-state').className = 'online-state '+(_data.OnlineState?'online':'offline');
    document.querySelector('#user-detail .profile-image').src = _data.UserImageUrl;
    document.querySelector('#user-detail .user-sidebar h2').innerHTML = _data.UserName.makeSafe();
    document.querySelector('#user-detail .user-sidebar h3').innerHTML = _data.UserRank;

    document.querySelector('#user-detail .profile-badge img').src = _data.FeaturedBadgeImageUrl;
    document.querySelector('#user-detail .profile-badge p').innerHTML = _data.FeaturedBadgeName;

    document.querySelector('#user-detail .profile-group img').src = _data.FeaturedGroupImageUrl;
    document.querySelector('#user-detail .profile-group p').innerHTML = _data.FeaturedGroupName.makeSafe();

    document.querySelector('#user-detail .profile-avatar img').src = _data.CurrentAvatarImageUrl;
    document.querySelector('#user-detail .profile-avatar p').innerHTML = _data.CurrentAvatarName.makeSafe();
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
    if(_data.IsBlocked){
        blockBtn.setAttribute('onclick', 'unBlock(\''+_data.UserId+'\');');
        blockBtn.innerHTML = '<img src="gfx/unblock.svg">Unblock';
    }else{
        blockBtn.setAttribute('onclick', 'block(\''+_data.UserId+'\');');
        blockBtn.innerHTML = '<img src="gfx/block.svg">Block';
    }

    /*var muteBtn = document.querySelector('#user-detail .mute-btn');
    if(_data.IsMuted){
        muteBtn.setAttribute('onclick', 'unMute(\''+_data.Guid+'\');');
        muteBtn.innerHTML = '<img src="gfx/user-unmute.svg">Unmute';
    }else{
        muteBtn.setAttribute('onclick', 'mute(\''+_data.Guid+'\');');
        muteBtn.innerHTML = '<img src="gfx/user-mute.svg">Mute';
    }*/

    var kickBtn = document.querySelector('#user-detail .kick-btn');
    kickBtn.setAttribute('onmousedown', 'kickUser(\''+_data.UserId+'\');');

    var moderationView = document.querySelector('#user-detail .user-settings-dialog');
    
    var userSettingsTools = '<p>User Settings</p><div class="action-btn" onclick="hideUserSettings();">Back</div>';

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

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">User Bundle Verifier:</div>\n' +
        '                            <div class="option-input">\n' +
        '                                <div id="SelfModerationBundleVerifierAvatar" class="inp_dropdown" data-options="0:Dont Verify,1:Use global settings,2:Always Verify" data-current="' + (_profile.userBundleVerifierBypass) + '" data-saveOnChange="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>'

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Player Props:</div>\n' +
        '                            <div class="option-input">\n' +
        '                                <div id="SelfModerationUsersProps" class="inp_dropdown" data-options="0:Hide,1:Use content filter,2:Show" data-current="' + (_profile.userPropVisibility) + '" data-saveOnChange="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>'

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Mute Player:</div>\n' +
        '                            <div class="option-input">\n' +
        '                                <div id="SelfModerationMute" class="inp_toggle" data-current="' + (_profile.mute?'True':'False') + '" data-saveOnChange="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>';

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="option-caption">Voice Volume:</div>\n' +
        '                            <div class="option-input">\n' +
        '                              <div id="SelfModerationVolume" class="inp_slider" data-min="0" data-max="100" data-current="' + (_profile.voiceVolume * 100) + '" data-saveOnChange="true" data-continuousUpdate="true"></div>\n' +
        '                            </div>\n' +
        '                        </div>';

    userSettingsTools += '<div class="row-wrapper">\n' +
        '                            <div class="content-btn" onclick="ReloadAvatar(\'' + _data.CurrentAvatarId + '\');">Reload Avatar</div>\n' +
        '                        </div>'

    moderationView.innerHTML = userSettingsTools;

    userProfileMute = new inp_toggle(document.getElementById('SelfModerationMute'));
    userProfileVolume = new inp_slider(document.getElementById('SelfModerationVolume'));
    userProfilePlayerAvatarsBlocked = new inp_dropdown(document.getElementById('SelfModerationUsersAvatars'));
    userProfileAvatarBlocked = new inp_dropdown(document.getElementById('SelfModerationAvatar'));
    userProfileBundleVerifierBypass = new inp_dropdown(document.getElementById('SelfModerationBundleVerifierAvatar'));
    userProfilePropBlocked = new inp_dropdown(document.getElementById('SelfModerationUsersProps'));

    moderationView.classList.add('hidden');
    
    detailPage.classList.remove('hidden');
    detailPage.classList.add('in');

    updateUserDetailsActivity(_data.Instance, _data.Users);
}

function showUserSettings(){
    var moderationView = document.querySelector('#user-detail .user-settings-dialog');
    moderationView.classList.remove('hidden');
    moderationView.classList.add('in');
}

function hideUserSettings(){
    var moderationView = document.querySelector('#user-detail .user-settings-dialog');
    moderationView.classList.remove('in');
    moderationView.classList.add('out');
    setTimeout(function(){
        moderationView.classList.add('hidden');
        moderationView.classList.remove('out');
    }, 200);
}

function ReloadAvatar(_userId){
    engine.call('CVRAppCallReloadAvatar', _userId);
}

function unFriend(_guid){
    uiConfirmShow("Unfriend", "Are you sure you want to remove this person from your friendslist?", "removeFriend", _guid);
}

function addFriend(_guid){
    engine.call('CVRAppCallRelationsManagement', _guid, 'Add');
}

function acceptFriend(_guid){
    engine.call('CVRAppCallRelationsManagement', _guid, 'Accept');
}

function denyFriend(_guid){
    engine.call('CVRAppCallRelationsManagement', _guid, 'Deny');
}

function block(_guid){
    engine.call('CVRAppCallRelationsManagement', _guid, 'Block');
}

function unBlock(_guid){
    engine.call('CVRAppCallRelationsManagement', _guid, 'Unblock');
}

var kickTimer;
var kickGuid = "";
document.addEventListener('mouseup', resetKickTimer);
function kickUser(_guid){
    kickGuid = _guid;
    kickTimer = window.setTimeout(kickUserAction, 3000);
}
function resetKickTimer(){
    kickGuid = "";
    window.clearTimeout(kickTimer);
}
function kickUserAction(){
    engine.call('CVRAppCallKickUser', kickGuid);
}

function updateUserDetailsActivity(_activity, _instanceUsers){
    if(_activity.IsInJoinableInstance == true && PlayerData.IsFriend && PlayerData.OnlineState) {

        document.querySelector('#tab-content-activity .player-instance-world-image').src = _activity.WorldImageUrl;
        document.querySelector('#tab-content-activity .player-instance-details h2').innerHTML = _activity.WorldName.makeSafe();
        document.querySelector('#tab-content-activity .player-instance-details .data-gamemode').innerHTML = _activity.GameModeName.makeSafe();
        document.querySelector('#tab-content-activity .player-instance-details .data-maxplayers').innerHTML = _activity.MaxPlayer;
        document.querySelector('#tab-content-activity .player-instance-details .data-currplayers').innerHTML = _activity.CurrentPlayer;

        var html = '';

        for (var i = 0; i < _instanceUsers.length; i++) {
            html += '<div class="instancePlayer" onclick="getUserDetails(\''+_instanceUsers[i].UserId+'\');"><img class="instancePlayerImage" src="' +
                _instanceUsers[i].UserImageUrl + '"><div class="instancePlayerName">' +
                _instanceUsers[i].UserName.makeSafe() + '</div></div>';
        }

        document.querySelector('#tab-content-activity .player-instance-players .scroll-content').innerHTML = html;

        document.querySelector('#tab-content-activity .activityDataAvailable').className = 'activityDataAvailable';
        document.querySelector('#tab-content-activity .activityDataUnavailable').className = 'activityDataUnavailable hidden';
        document.querySelector('#tab-content-activity .activityDataPrivate').className = 'activityDataPrivate hidden';
        document.querySelector('#tab-content-activity .activityDataOffline').className = 'activityDataOffline hidden';

    }else if(_activity.IsInJoinableInstance == true && PlayerData.IsFriend && PlayerData.OnlineState){
        document.querySelector('#tab-content-activity .activityDataAvailable').className = 'activityDataAvailable hidden';
        document.querySelector('#tab-content-activity .activityDataUnavailable').className = 'activityDataUnavailable hidden';
        document.querySelector('#tab-content-activity .activityDataPrivate').className = 'activityDataPrivate hidden';
        document.querySelector('#tab-content-activity .activityDataOffline').className = 'activityDataOffline';
    }else if(_activity.IsInJoinableInstance == false && PlayerData.OnlineState){
        document.querySelector('#tab-content-activity .activityDataAvailable').className = 'activityDataAvailable hidden';
        document.querySelector('#tab-content-activity .activityDataUnavailable').className = 'activityDataUnavailable hidden';
        document.querySelector('#tab-content-activity .activityDataPrivate').className = 'activityDataPrivate';
        document.querySelector('#tab-content-activity .activityDataOffline').className = 'activityDataOffline hidden';
    }else{
        document.querySelector('#tab-content-activity .activityDataAvailable').className = 'activityDataAvailable hidden';
        document.querySelector('#tab-content-activity .activityDataUnavailable').className = 'activityDataUnavailable';
        document.querySelector('#tab-content-activity .activityDataPrivate').className = 'activityDataPrivate hidden';
        document.querySelector('#tab-content-activity .activityDataOffline').className = 'activityDataOffline hidden';
    }

    var joinBtn = document.querySelector('#user-detail .join-btn');
    var inviteBtn = document.querySelector('#user-detail .invite-btn');

    if(PlayerData.OnlineState && _activity.IsInJoinableInstance){
        if(_activity.InstanceId !== null){
            joinBtn.setAttribute('onclick', 'joinInstance(\''+_activity.InstanceId+'\', \''+_activity.WorldId+'\');');
            joinBtn.classList.remove('disabled');
        }else{
            joinBtn.setAttribute('onclick', '');
            joinBtn.classList.add('disabled');
        }

        inviteBtn.setAttribute('onclick', 'invitePlayer(\''+PlayerData.UserId+'\');');
        inviteBtn.classList.remove('disabled');
    }else if(PlayerData.IsFriend) {
        joinBtn.setAttribute('onclick', '');
        joinBtn.classList.add('disabled');

        inviteBtn.setAttribute('onclick', 'invitePlayer(\''+PlayerData.UserId+'\');');
        inviteBtn.classList.remove('disabled');
    }else{
        joinBtn.setAttribute('onclick', '');
        joinBtn.classList.add('disabled');

        inviteBtn.setAttribute('onclick', '');
        inviteBtn.classList.add('disabled');
    }
}

function closeUserDetail(){
    var detailPage = document.getElementById('user-detail');
    detailPage.classList.remove('in');
    detailPage.classList.add('out');
    setTimeout(function(){
        detailPage.classList.add('hidden');
        detailPage.classList.remove('out');
    }, 200);
}

//Avatar Details
engine.on('LoadAvatarDetails', function(_AvatarDetails){
    displayAvatarDetails(_AvatarDetails);
});

window.avatarCategories = [];
window.avatarCurrentCategories = [];

function displayAvatarDetails(_AvatarDetails){
    window.avatarCurrentCategories = _AvatarDetails.FilterTags.split(',');
    var detailPage = document.getElementById('avatar-detail');
    
    cvr('#avatar-detail h1').innerHTML(_AvatarDetails.AvatarName.makeSafe());
    cvr('#avatar-detail .avatar-image').attr('src', _AvatarDetails.AvatarImageUrl);
    
    cvr('#avatar-detail .author').innerHTML(_AvatarDetails.AuthorName.makeSafe());

    cvr('#avatar-detail .privacy span').innerHTML(_AvatarDetails.IsPublic?'Public':'Private');
    cvr('#avatar-detail .uploaded span').innerHTML(_AvatarDetails.UploadedAt);
    cvr('#avatar-detail .updated span').innerHTML(_AvatarDetails.UpdatedAt);
    cvr('#avatar-detail .size span').innerHTML(_AvatarDetails.FileSize);
    
    cvr('#avatar-detail .description').innerHTML(_AvatarDetails.AvatarDesc.makeSafe());
    cvr('#avatar-detail .tags').innerHTML(_AvatarDetails.Tags.replace(/,/g, ' ').makeSafe());

    if (_AvatarDetails.IsPublic || _AvatarDetails.IsSharedWithMe || _AvatarDetails.IsMine){
        cvr('#avatar-detail .change-btn').removeClass('disabled').attr('onclick', 'changeAvatar("'+_AvatarDetails.AvatarId+'");');
        cvr('#avatar-detail .fav-btn').removeClass('disabled').attr('onclick', 'favoriteAvatar("'+_AvatarDetails.AvatarId+'");');
    }else{
        cvr('#avatar-detail .change-btn').addClass('disabled').attr('onclick', '');
        cvr('#avatar-detail .fav-btn').addClass('disabled').attr('onclick', '');
    }

    window.pickedAvatarCategories = [];
    
    detailPage.classList.remove('hidden');
    detailPage.classList.add('in');
}

function closeAvatarDetail(){
    var detailPage = document.getElementById('avatar-detail');
    detailPage.classList.remove('in');
    detailPage.classList.add('out');
    setTimeout(function(){
        detailPage.classList.add('hidden');
        detailPage.classList.remove('out');
    }, 200);
    closeAvatarDetailFavorite();
}

window.pickedAvatarForCategorie = '';
window.pickedAvatarCategories = [];

function favoriteAvatar(_guid){
    window.pickedAvatarForCategorie = _guid;
    
    var html = '';
    
    for (var i=0; i < window.avatarCategories.length; i++){
        if(window.avatarCurrentCategories.includes(window.avatarCategories[i].CategoryKey)){
            window.pickedAvatarCategories[window.avatarCategories[i].CategoryKey] = true;
            html += '<div class="favorite-category"><div class="inp_toggle checked" onclick="changeAvatarCategory(\''+
                window.avatarCategories[i].CategoryKey+'\', this);"></div><span>'+window.avatarCategories[i].CategoryClearTextName.makeSafe()+'</span></div>';
        }else{
            window.pickedAvatarCategories[window.avatarCategories[i].CategoryKey] = false;
            html += '<div class="favorite-category"><div class="inp_toggle" onclick="changeAvatarCategory(\''+
                window.avatarCategories[i].CategoryKey+'\', this);"></div><span>'+window.avatarCategories[i].CategoryClearTextName.makeSafe()+'</span></div>';
        }
    }
    
    cvr('#avatar-detail .favorite-categories').innerHTML(html);

    cvr('#avatar-detail .favorite-category-selection').removeClass('hidden').addClass('in');
}

function closeAvatarDetailFavorite(){
    var detailPage = document.querySelector('#avatar-detail .favorite-category-selection');
    detailPage.classList.remove('in');
    detailPage.classList.add('out');
    setTimeout(function(){
        detailPage.classList.add('hidden');
        detailPage.classList.remove('out');
    }, 200);
}

function changeAvatarCategory(_categoryIdentifier, _e){
    if (_e.classList.contains('checked')){
        var index = window.avatarCurrentCategories.indexOf(_categoryIdentifier);
        if (index > -1) {
            window.avatarCurrentCategories.splice(index, 1);
        }
        
        window.pickedAvatarCategories[_categoryIdentifier] = false;
        _e.classList.remove('checked');
    }else{
        window.avatarCurrentCategories.push(_categoryIdentifier);
        
        window.pickedAvatarCategories[_categoryIdentifier] = true;
        _e.classList.add('checked');
    }
}

function sendAvatarCategoryUpdate(){
    var categoryList = [];
    
    for (var k in window.pickedAvatarCategories){
        if (window.pickedAvatarCategories[k]){
            categoryList[categoryList.length] = k;
        }
    }
    
    engine.call("CVRAppCallUpdateAvatarCategories", window.pickedAvatarForCategorie, categoryList.join(','));
    closeAvatarDetailFavorite();
}

//Ui Masseges e.g. alerts, coinfirms
var messageList = [];

function uiMessageActive(){
    var messageBoxes = document.querySelectorAll('.message-box');
    var messageActive = false;

    for(var i = 0; i < messageBoxes.length; i++){
        if(!messageBoxes[i].className.includes('hidden')){
            messageActive = true;
        }
    }

    return messageActive;
}

function uiCheckForAdditionalMessage(){
    if(messageList.length > 0){
        var data = messageList.shift();
        switch(data.type){
            case 'alert':
                uiAlertShow(data.headline, data.text, data.id);
                break;
            case 'confirm':
                uiConfirmShow(data.headline, data.text, data.id, data.data);
                break;
            case 'alertTimed':
                uiAlertTimedShow(data.headline, data.text, data.time, data.id);
                break;
            case 'push':
                uiPushShow(data.text, data.time, data.id);
                break;
        }
    }
}

function uiAlertShow(_headline, _text, _id){
    var alertBox = document.getElementById('alert');

    if(uiMessageActive()){
        messageList.push({
            type: 'alert',
            headline: _headline,
            text: _text,
            id: _id
        });
        return;
    }

    alertBox.classList.remove('hidden');
    alertBox.classList.add('in');

    alertBox.setAttribute('data-index', _id);

    document.querySelector('#alert h2').innerHTML = _headline.makeSafe();
    document.querySelector('#alert p').innerHTML = _text.makeSafe();
}

function uiAlertClose(){
    var alertBox = document.getElementById('alert');

    var id = alertBox.getAttribute('data-index');

    alertBox.classList.remove('in');
    alertBox.classList.add('out');
    setTimeout(function(){
        alertBox.classList.add('hidden');
        alertBox.classList.remove('out');

        uiCheckForAdditionalMessage();
    }, 200);

    engine.call('CVRAppCallAlertClose', id);
}

window.setInterval(updateUiAlertTime, 25);
var uiAlertTimer = 0;
var uiAlertTime = 0;

function updateUiAlertTime(){
    uiAlertTimer += 0.025;
    
    var percent = Math.min((uiAlertTimer / uiAlertTime) * 100, 100);
    
    if(uiAlertTimer >= uiAlertTime){
        uiAlertTimedClose();
        uiAlertTimer = 0;
        uiAlertTime = 999999;
    }else{
        document.querySelector('#alertTimed .message-time-bar').setAttribute('style', 'width:'+percent+'%;');
    }
}

function uiAlertTimedShow(_headline, _text, _time, _id){
    var alertBox = document.getElementById('alertTimed');

    if(uiMessageActive()){
        messageList.push({
            type: 'alertTimed',
            headline: _headline,
            text: _text,
            time: _time,
            id: _id
        });
        return;
    }

    uiAlertTimer = 0;
    uiAlertTime = _time;

    alertBox.classList.remove('hidden');
    alertBox.classList.add('in');

    alertBox.setAttribute('data-index', _id);

    document.querySelector('#alertTimed h2').innerHTML = _headline.makeSafe();
    document.querySelector('#alertTimed p').innerHTML = _text.makeSafe();
    document.querySelector('#alertTimed .message-time-bar').setAttribute('style', 'width:0;');
}

function uiAlertTimedClose(){
    var alertBox = document.getElementById('alertTimed');

    var id = alertBox.getAttribute('data-index');

    alertBox.classList.remove('in');
    alertBox.classList.add('out');
    setTimeout(function(){
        alertBox.classList.add('hidden');
        alertBox.classList.remove('out');

        uiCheckForAdditionalMessage();
    }, 200);

    engine.call('CVRAppCallAlertClose', id);
}

window.setInterval(updateUiPushTime, 25);
var uiPushTimer = 0;
var uiPushTime = 0;

function updateUiPushTime(){
    uiPushTimer += 0.025;

    if(uiPushTimer >= uiPushTime){
        uiPushClose();
        uiPushTimer = 0;
        uiPushTime = 999999;
    }else{
        
    }
}

function uiPushShow(_text, _time, _id){
    var alertBox = document.getElementById('push');

    if(uiMessageActive()){
        messageList.push({
            type: 'push',
            text: _text,
            time: _time,
            id: _id
        });
        return;
    }

    uiPushTimer = 0;
    uiPushTime = _time;

    alertBox.classList.remove('hidden');
    alertBox.classList.add('in');

    alertBox.setAttribute('data-index', _id);

    document.querySelector('#push p').innerHTML = _text.makeSafe();
}

function uiPushClose(){
    var alertBox = document.getElementById('push');

    var id = alertBox.getAttribute('data-index');

    alertBox.classList.remove('in');
    alertBox.classList.add('out');
    setTimeout(function(){
        alertBox.classList.add('hidden');
        alertBox.classList.remove('out');

        uiCheckForAdditionalMessage();
    }, 200);

    engine.call('CVRAppCallAlertClose', id);
}

function uiLoadingShow(_text){
    var loadingBox = document.getElementById('loading');

    loadingBox.classList.remove('hidden');
    loadingBox.classList.add('in');

    document.querySelector('#loading p').innerHTML = _text.makeSafe();
    
    console.log("Display loading: " + _text);
}

function uiLoadingClose(){
    var loadingBox = document.getElementById('loading');

    loadingBox.classList.remove('in');
    loadingBox.classList.add('out');
    setTimeout(function(){
        loadingBox.classList.add('hidden');
        loadingBox.classList.remove('out');

        uiCheckForAdditionalMessage();
    }, 200);
}

function uiConfirmShow(_headline, _text, _id, _data){
    var alertBox = document.getElementById('confirm');

    if(uiMessageActive()){
        messageList.push({
            type: 'confirm',
            headline: _headline,
            text: _text,
            id: _id,
            data: _data
        });
        return;
    }

    alertBox.classList.remove('hidden');
    alertBox.classList.add('in');

    alertBox.setAttribute('data-index', _id);
    alertBox.setAttribute('data-storage', _data.makeSafe());

    document.querySelector('#confirm h2').innerHTML = _headline.makeSafe();
    document.querySelector('#confirm p').innerHTML = _text.makeSafe();
}

window.uiConfirm = {
    id: 0,
    value: "",
    data: ""
};

function uiConfirmClose(_value){
    var alertBox = document.getElementById('confirm');

    var id = alertBox.getAttribute('data-index');
    var data = alertBox.getAttribute('data-storage');

    alertBox.classList.remove('in');
    alertBox.classList.add('out');
    setTimeout(function(){
        alertBox.classList.add('hidden');
        alertBox.classList.remove('out');

        uiCheckForAdditionalMessage();
    }, 200);

    window.uiConfirm.id = id;
    window.uiConfirm.value = _value;
    window.uiConfirm.data = data;
    
    var event = new CustomEvent("uiConfirm");
    window.dispatchEvent(event);
    engine.call('CVRAppCallConfirmClose', id, _value, data);
}

window.addEventListener("uiConfirm", function(){    
    switch(window.uiConfirm.id){
        case "logout":
            if(window.uiConfirm.value == 'true') {
                engine.trigger('CVRAppTaskGameLogout');
            }
            break;
        case "removeFriend":
            if(window.uiConfirm.value == 'true') {
                engine.call('CVRAppCallRelationsManagement', window.uiConfirm.data, 'Unfriend');
            }
            break;
    }
});

function logout(){
    uiConfirmShow("Logout", "You will be logged out and the game will be closed. Are you sure?", "logout", "");
}

//Time Display
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function updateTime(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();

  h = checkTime(h);
  m = checkTime(m);

  if(game_settings && game_settings['GeneralClockFormat'] && game_settings['GeneralClockFormat'] != '24'){
      document.querySelector('.time-display').innerHTML = h%12+':'+m+' '+(h >= 12 ? 'PM' : 'AM');
  }else{
      document.querySelector('.time-display').innerHTML = h+':'+m;
  }
}
updateTime();
window.setInterval(updateTime, 1000);

//Quick menu
function updateAnimationNames(_names){
    var emote1 = document.querySelector('.quick-menu-wrapper .emote-1');
    if(emote1) emote1.innerHTML = _names.emote1.makeSafe();

    var emote2 = document.querySelector('.quick-menu-wrapper .emote-2');
    if(emote2) emote2.innerHTML = _names.emote2.makeSafe();

    var emote3 = document.querySelector('.quick-menu-wrapper .emote-3');
    if(emote3) emote3.innerHTML = _names.emote3.makeSafe();

    var emote4 = document.querySelector('.quick-menu-wrapper .emote-4');
    if(emote4) emote4.innerHTML = _names.emote4.makeSafe();

    var emote5 = document.querySelector('.quick-menu-wrapper .emote-5');
    if(emote5) emote5.innerHTML = _names.emote5.makeSafe();

    var emote6 = document.querySelector('.quick-menu-wrapper .emote-6');
    if(emote6) emote6.innerHTML = _names.emote6.makeSafe();

    var emote7 = document.querySelector('.quick-menu-wrapper .emote-7');
    if(emote7) emote7.innerHTML = _names.emote7.makeSafe();

    var emote8 = document.querySelector('.quick-menu-wrapper .emote-8');
    if(emote8) emote6.innerHTML = _names.emote8.makeSafe();


    var state1 = document.querySelector('.quick-menu-wrapper .state-1');
    if(state1) state1.innerHTML = _names.state1.makeSafe();

    var state2 = document.querySelector('.quick-menu-wrapper .state-2');
    if(state2) state2.innerHTML = _names.state2.makeSafe();

    var state3 = document.querySelector('.quick-menu-wrapper .state-3');
    if(state3) state3.innerHTML = _names.state3.makeSafe();

    var state4 = document.querySelector('.quick-menu-wrapper .state-4');
    if(state4) state4.innerHTML = _names.state4.makeSafe();

    var state5 = document.querySelector('.quick-menu-wrapper .state-5');
    if(state5) state5.innerHTML = _names.state5.makeSafe();

    var state6 = document.querySelector('.quick-menu-wrapper .state-6');
    if(state6) state6.innerHTML = _names.state6.makeSafe();

    var state7 = document.querySelector('.quick-menu-wrapper .state-7');
    if(state7) state7.innerHTML = _names.state7.makeSafe();

    var state8 = document.querySelector('.quick-menu-wrapper .state-8');
    if(state8) state6.innerHTML = _names.state8.makeSafe();
}

//Calls to cohtml
function refreshAvatars(){
    engine.trigger('CVRAppTaskRefreshAvatars');
}

function refreshWorlds(){
    worldsResetLoad = true;
    engine.trigger('CVRAppTaskRefreshWorlds');
}

function loadFilteredWorlds(){
    worldsResetLoad = true;
    engine.call('CVRAppCallLoadFilteredWorlds', worldFilter);
}

function refreshGameModes(){
    engine.trigger('CVRAppTaskRefreshGameModes');
}

function refreshFriends(){
    engine.trigger('CVRAppTaskRefreshFriends');
}

function refreshFeed(){
    engine.trigger('CVRAppTaskRefreshFeed');
}

function disconnect(){
    engine.trigger('CVRAppActionDisconnect');
}

function goHome(){
    engine.trigger('CVRAppActionGoHome');
}

function exit(){
    engine.trigger('CVRAppActionQuit');
}

function toggleMic(){
    engine.trigger('CVRAppActionMicToggle');
}

function toogleCamera(){
    engine.trigger('CVRAppActionCameraToggle');
}
function tooglePathCamera(){
    engine.trigger('CVRAppActionPathCameraToggle');
}

function recalibrate(){
    engine.trigger('CVRAppActionRecalibrate');
}

function respawn(){
    engine.trigger('CVRAppActionRespawn');
}

function mediaPrev(){
    engine.trigger('CVRAppActionMediaPrev');
}

function mediaPlayPause(){
    engine.trigger('CVRAppActionMediaPlayPause');
}

function mediaStop(){
    engine.trigger('CVRAppActionMediaStop');
}

function mediaNext(){
    engine.trigger('CVRAppActionMediaNext');
}

function settingsReset(){
    engine.trigger('CVRAppActionSettingsReset');
}

function toogleSeatedPlay(){
    engine.trigger('CVRAppActionToggleSeatedPlay');
}

function toggleFlight(){
    engine.trigger('CVRAppActionToggleFlight');
}

function autoCalibrateHeight(){
    engine.trigger('CVRAppActionAutoCalibrateHeight');
}

function mouseUnlock(){
    engine.trigger('CVRAppActionMouseUnlock');
}

function refreshProps(){
    engine.trigger('CVRAppActionRefreshProps');
}

function deleteAllMyProps(){
    engine.trigger('CVRAppActionDeleteAllMyProps');
}

function changeAvatar(_uid){
    engine.call('CVRAppCallChangeAvatar', _uid);
}

function changeWorld(_uid){
    engine.call('CVRAppCallChangeWorld', _uid);
}

function preloadWorld(_uid){
    engine.call('CVRAppCallPreloadWorld', _uid);
}

function setHome(_uid){
    engine.call('CVRAppCallSetHomeWorld', _uid);
}

function joinInstance(_uid, _world){
    engine.call('CVRAppCallJoinInstance', _uid, _world);
}
function invitePlayer(_uid){
    engine.call('CVRAppCallInvitePlayer', _uid);
}

function playEmote(_id){
    engine.call('CVRAppCallPlayEmote', _id);
}

function changeState(_id){
    engine.call('CVRAppCallChangeState', _id);
}

function changeAnimatorParam(_name, _value){
    engine.call('CVRAppCallChangeAnimatorParam', _name, _value);
}

function changeGestureLeft(_id){
    engine.call('CVRAppCallChangeGestureLeft', _id);
}

function changeGestureRight(_id){
    engine.call('CVRAppCallChangeGestureRight', _id);
}

function dropInstancePortal(_instanceID){
    engine.call('CVRAppCallDropInstancePortal', _instanceID);
}

function loadSettings(){
    engine.trigger('CVRAppActionLoadSettings');
}

function playSound(sound){
    engine.trigger('CVRAppCallPlayAudio', sound);
}

function LoadMicrophones(){
    engine.trigger('CVRAppActionLoadMicrophones');
}

function LoadResolutions(){
    engine.trigger('CVRAppActionLoadResolutions');
}

function GetAvatarDetails(_guid){
    engine.call('CVRAppCallGetAvatarDetails', _guid);
}

function updateGameDebugInformation(_info){
    var ping = document.querySelector('.game-debug-ping');
    if(ping) ping.innerHTML = _info.Ping;

    var fps = document.querySelector('.game-debug-fps');
    if(fps) fps.innerHTML = _info.Fps;

    var version = document.querySelector('.game-debug-version');
    if(version) version.innerHTML = _info.Version;
}

//Advanced Avatar Settings
function showAvatarSettings(){
    engine.trigger('CVRAppActionLoadAvatarSettings');
}

function DisplayAvatarSettings(_list){
    var contentElement = document.querySelector('#avatar-settings .list-content');
    var html = '';

    for(var i=0; i < _list.length; i++){
        var entry = _list[i];

        switch(entry.type){
            case 'toggle':
            html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '    <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'" class="inp_toggle" data-type="avatar" data-current="'+(entry.defaultValueX==1?'True':'False')+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'dropdown':
                var settings = '';

                for(var j=0; j < entry.optionList.length; j++){
                    if(j != 0) settings += ',';
                    settings += j+':'+entry.optionList[j].makeParameterSafeFull();
                }

                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'" class="inp_dropdown" data-type="avatar" data-options="'+settings+'" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'colorpicker':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_PREV_'+entry.parameterName.makeSafe()+'" class="color-preview" data-r="'+parseInt(entry.defaultValueX * 255)+'" data-g="'+parseInt(entry.defaultValueY * 255)+'" data-b="'+parseInt(entry.defaultValueZ * 255)+'" '  +
                    'style="background-color: rgba('+parseInt(entry.defaultValueX * 255)+','+parseInt(entry.defaultValueY * 255)+','+parseInt(entry.defaultValueZ * 255)+',1);"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-r" class="inp_slider color" data-caption="Red: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueX * 255)+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-g" class="inp_slider color" data-caption="Green: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueY * 255)+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-b" class="inp_slider color" data-caption="Blue: " data-type="avatar" data-min="0" data-max="255" data-current="'+(entry.defaultValueZ * 255)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'slider':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'" class="inp_slider" data-type="avatar" data-min="0" data-max="100" data-current="'+(entry.defaultValueX * 100)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'joystick2d':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'" class="inp_joystick" data-type="avatar" data-current="'+entry.defaultValueX+'|'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'joystick3d':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'" class="inp_joystick" data-type="avatar" data-current="'+entry.defaultValueX+'|'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-z" class="inp_sliderH" data-type="avatar" data-min="0" data-max="100" data-current="'+(entry.defaultValueZ * 100)+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputsingle':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputvector2':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-x" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-y" class="inp_number" data-type="avatar" data-caption="Y" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '    </div>\n' +
                    '</div>';
                break;
            case 'inputvector3':
                html += '<div class="row-wrapper">\n' +
                    '    <div class="option-caption">'+entry.name.makeSafe()+':</div>\n' +
                    '        <div class="option-input">\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-x" class="inp_number" data-type="avatar" data-caption="X" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueX+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-y" class="inp_number" data-type="avatar" data-caption="Y" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueY+'" data-saveOnChange="true"></div>\n' +
                    '        <div id="AVS_'+entry.parameterName.makeSafe()+'-z" class="inp_number" data-type="avatar" data-caption="Z" data-min="-9999" data-max="9999" data-current="'+entry.defaultValueZ+'" data-saveOnChange="true"></div>\n' +
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
                new inp_toggle(document.getElementById('AVS_'+entry.parameterName.makeSafe()));
                break;
            case 'dropdown':
                new inp_dropdown(document.getElementById('AVS_'+entry.parameterName.makeSafe()));
                break;
            case 'colorpicker':
                new inp_slider(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-r'));
                new inp_slider(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-g'));
                new inp_slider(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-b'));
                break;
            case 'slider':
                new inp_slider(document.getElementById('AVS_'+entry.parameterName.makeSafe()));
                break;
            case 'joystick2d':
                new inp_joystick(document.getElementById('AVS_'+entry.parameterName.makeSafe()));
                break;
            case 'joystick3d':
                new inp_joystick(document.getElementById('AVS_'+entry.parameterName.makeSafe()));
                new inp_sliderH(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-z'));
                break;
            case 'inputsingle':
                new inp_number(document.getElementById('AVS_'+entry.parameterName.makeSafe()));
                break;
            case 'inputvector2':
                new inp_number(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-x'));
                new inp_number(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-y'));
                break;
            case 'inputvector3':
                new inp_number(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-x'));
                new inp_number(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-y'));
                new inp_number(document.getElementById('AVS_'+entry.parameterName.makeSafe()+'-z'));
                break;
        }
    }
}

function closeAvatarSettings(){
    closeKeyboard();
    closeNumpad();
    var avatarSettings = document.getElementById('avatar-settings');
    avatarSettings.classList.remove('in');
    avatarSettings.classList.add('out');
    setTimeout(function(){
        avatarSettings.classList.add('hidden');
        avatarSettings.classList.remove('out');
    }, 200);
}

function DisplayAvatarSettingsProfiles(_info){
    var html = '';
    
    for(var i=0; i < _info.length; i++){
        html += '<div class="advAvtrProfile">\n' +
            '    <div class="advAvtrProfName" onclick="loadAdvAvtrProfile(\''+_info[i].makeParameterSafe()+'\');">'+_info[i].makeSafe()+'</div>\n' +
            '    <div class="advAvtrProfSave" onclick="saveAdvAvtrProfile(\''+_info[i].makeParameterSafe()+'\');">S</div>\n' +
            '    <div class="advAvtrProfDelete" onclick="deleteAdvAvtrProfile(\''+_info[i].makeParameterSafe()+'\');">D</div>\n' +
            '</div>';
    }
    
    document.getElementById('savedProfiles').innerHTML = html;
}

function saveAdvAvtrProfileNew(){
    var profileName = document.getElementById('advAvtrProfileNameNew').value;
    saveAdvAvtrProfile(profileName);
    document.getElementById('advAvtrProfileNameNew').value = "";
}
function loadAdvAvtrProfileDefault(){
    engine.trigger('CVRAppActionLoadAdvAvtrSettingsDefault');
}
function saveAdvAvtrProfile(_name){
    engine.call('CVRAppCallSaveAdvAvtrSettingsProfile', _name);
    uiPushShow("The Profile was saved", 2, 'advAvtrCnfSav');
}
function loadAdvAvtrProfile(_name){
    engine.call('CVRAppCallLoadAdvAvtrSettingsProfile', _name);
}
var profileIndex = "";
function deleteAdvAvtrProfile(_name){
    profileIndex = _name;
    uiConfirmShow("Advanced Avatar Settings", 'Are you sure you want to delete the profile "'+ _name +'"', 'deleteAdvAvtrProfile', '');
}
window.addEventListener("uiConfirm", function(e){
    if(window.uiConfirm.id == "deleteAdvAvtrProfile" && window.uiConfirm.value == 'true'){
        engine.call('CVRAppCallDeleteAdvAvtrSettingsProfile', profileIndex);
        uiPushShow("The Profile was deleted", 2, 'advAvtrCnfDel');
    }
});

function vrInputChanged(_fullBodyActive){
    if (_fullBodyActive){
        cvr('#seatedPlayBtnHome').hide();
        cvr('#recalibrateBtnHome').show();
    } else {
        cvr('#seatedPlayBtnHome').show();
        cvr('#recalibrateBtnHome').hide();
    }
}

//Calls from cohtml
engine.on('LoadAvatars', function (_list) {
    loadAvatars(_list);
});

engine.on('LoadWorlds', function (_list) {
    loadWorlds(_list);
});

engine.on('LoadFriends', function (_list) {
    loadFriends(_list);
});

engine.on('UpdateUsersOnline', function (_list) {
    updateUsersOnline(JSON.parse(_list));
});

engine.on('LoadMessages', function(_invites, _friendrequests, _votes, _systems, _dms){
    loadMessages(_invites, _friendrequests, _votes, _systems, _dms);
});

engine.on('LoadMessagesSingle', function(_category, _list){
    loadMessagesSingle(_category, _list);
});

/*engine.on('LoadInvites', function(_list){
    loadMessagesSingle('invites', _list);
});*/

engine.on('LoadInviteRequests', function(_list){
    loadMessagesSingle('invite-requets', _list);
});

engine.on('LoadFriendRequests', function(_list){
    loadMessagesSingle('friend-requests', _list);
});

engine.on('AddInvites', function(_invite){
    addMessagesSingle('invites', [_invite]);
});

engine.on('AddFriendRequest', function(_friendRequest){
    addMessagesSingle('friend-requests', [_friendRequest]);
});

function addMessagesSingle(_cat, _list){
    switch(_cat){
        case 'invites':
            var html = '';
            for(var i=0; i < _list.length; i++){
                html += displayMessageInvite(_list[i]);
            }
            document.querySelector('#message-invites .message-list').innerHTML += html;
            break;
        case 'invite-requets':
            var html = '';
            for(var i=0; i < _list.length; i++){
                html += displayMessageInviteRequest(_list[i]);
            }
            document.querySelector('#message-invite-requests .message-list').innerHTML += html;
            break;
        case 'system-notifications':
            var html = '';
            for(var i=0; i < _list.length; i++){
                //html += displayMessageInvite(_list[i]);
            }
            document.querySelector('#message-system .message-list').innerHTML += html;
            break;
        case 'friend-requests':
            var html = '';
            for(var i=0; i < _list.length; i++){
                html += displayMessageFriendRequest(_list[i]);
            }
            document.querySelector('#message-friendrequests .message-list').innerHTML += html;
            break;
    }
}

engine.on('LoadSystemNotifications', function(_list){
    addMessagesSingle('system-notifications', _list);
});

engine.on('LoadWorldDetails', function (_data, _instances) {
    loadWorldDetails(_data, _instances);
});

engine.on('AddWorldDetailsInstance', function(_instance){
    addWorldDetailInstance(_instance);
});

engine.on('LoadUserDetails', function (_data, _profile) {
    loadUserDetails(_data, _profile);
});

engine.on('alert', function (_headline, _text, _id) {
    uiAlertShow(_headline, _text, _id);
});
engine.on('alertTimed', function (_headline, _text, _time, _id) {
    uiAlertTimedShow(_headline, _text, _time, _id);
});
engine.on('push', function (_text, _time, _id) {
    uiPushShow(_text, _time, _id);
});

engine.on('confirm', function (_headline, _text, _id) {
    uiConfirmShow(_headline, _text, _id);
});

engine.on('loadingShow', function (_text) {
    uiLoadingShow(_text);
});

engine.on('loadingClose', function () {
    uiLoadingClose();
});

engine.on('UpdateMute', function (_muted) {
    if(!_muted){
        var buttons = document.querySelectorAll('.action-mute');
        for(var i=0 ; i < buttons.length; i++){
            buttons[i].innerHTML = '<img src="gfx/mute.svg">Unmute</div>';
        }
    }else{
        var buttons = document.querySelectorAll('.action-mute');
        for(var i=0 ; i < buttons.length; i++){
            buttons[i].innerHTML = '<img src="gfx/unmute.svg">Mute</div>';
        }
    }
});

engine.on('ChangeCameraStatus', function (_active) {
    if(_active){
        document.querySelector('#home .action-camera').innerHTML = '<img src="gfx/camera-on.svg">Cam Off</div>';
    }else{
        document.querySelector('#home .action-camera').innerHTML = '<img src="gfx/camera-off.svg">Cam On</div>';
    }
});

engine.on('ChangePathCameraStatus', function (_active) {
    if(_active){
        document.querySelector('#home .action-path-camera').innerHTML = '<img src="gfx/camera-on.svg">PCam Off</div>';
    }else{
        document.querySelector('#home .action-path-camera').innerHTML = '<img src="gfx/camera-off.svg">PCam On</div>';
    }
});

engine.on('ChangeGlobalNSFW', function(_enabled){
    var nsfwSettings = document.getElementById('content-filter-nsfw-wrapper');
    var nsfwSettingsAdditional = document.getElementById('content-filter-nsfw-wrapper-second');
    var nsfwSettingsProp = document.getElementById('content-filter-nsfw-wrapper-props');
    var nsfwSettingsAdditionalProp = document.getElementById('content-filter-nsfw-wrapper-second-props');
    var nsfwSettingsNotice = document.getElementById('content-filter-nsfw-wrapper-notice');
    
    if(_enabled){
        nsfwSettings.style.display = 'block';
        nsfwSettingsAdditional.style.display = 'block';
        nsfwSettingsProp.style.display = 'block';
        nsfwSettingsAdditionalProp.style.display = 'block';
        nsfwSettingsNotice.style.display = 'none';
    }else{
        nsfwSettings.style.display = 'none';
        nsfwSettingsAdditional.style.display = 'none';
        nsfwSettingsProp.style.display = 'none';
        nsfwSettingsAdditionalProp.style.display = 'none';
        nsfwSettingsNotice.style.display = 'block';
    }
});

engine.on('UpdateAnimationNames', function(_names){
    updateAnimationNames(_names);
});

engine.on('UpdateGameDebugInformation', function(_info){
    updateGameDebugInformation(_info);
});

engine.on('ShowAvatarSettings', function(_info){
    DisplayAvatarSettings(_info);
});

engine.on('ShowAvatarSettingsProfiles', function(_info){
    DisplayAvatarSettingsProfiles(_info);
});

engine.on('LoadSpawnables', function (_list) {
    //changeTab('props', document.getElementById('props-btn'));
    loadProps(_list);
});

engine.on('vrInputChanged', function (_fullBody) {
    vrInputChanged(_fullBody);
});

//General Input Types
var settings = [];
var game_settings = [];

function saveSettings(){
    settings.forEach(function(_setting){
        engine.call('CVRAppCallSaveSetting', _setting.name, _setting.value());
    });
}

function inp_slider(_obj){
    this.obj = _obj;
    this.minValue = parseFloat(_obj.getAttribute('data-min'));
    this.maxValue = parseFloat(_obj.getAttribute('data-max'));
    this.percent  = 0;
    this.value    = parseFloat(_obj.getAttribute('data-current'));
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.dragActive = false;
    this.name = _obj.id;
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
            
            if(self.type == 'avatar'){
                var color = self.name.substr(self.name.length - 2, self.name.length);
                var name = self.name.replace('AVS_', '').replace(color, '');
                var preview = document.getElementById('AVS_PREV_' + name);
                if(preview){
                    var red = preview.getAttribute('data-r');
                    var green = preview.getAttribute('data-g');
                    var blue = preview.getAttribute('data-b');
                    
                    switch(color){
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
                    }
                    
                    preview.setAttribute('style', 'background-color: rgba('+red+','+green+','+blue+',1);');
                }
            }

            if(self.saveOnChange && (_write === true || self.type == 'avatar' || self.continuousUpdate == 'true')){
                if(self.type == 'avatar'){
                    changeAnimatorParam(self.name.replace('AVS_', ''), self.value / self.maxValue);
                }else{
                    engine.call('CVRAppCallSaveSetting', self.name, "" + self.value);
                    game_settings[self.name] = self.value;
                    self.displayImperial();
                }
            }
        }
    }

    this.mouseUp = function(_e){
        self.mouseMove(_e, true);
        self.dragActive = false;
    }

    _obj.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
    //_obj.addEventListener('mouseup', this.mouseUp);

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

    return {
      name: this.name,
      value: this.getValue,
      updateValue: this.updateValue
    }
}

var sliders = document.querySelectorAll('.inp_slider');
for(var i = 0; i < sliders.length; i++){
    settings[settings.length] = new inp_slider(sliders[i]);
}

function inp_dropdown(_obj){
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
                engine.call('CVRAppCallSaveSetting', self.name, self.value);
                game_settings[self.name] = self.value;
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

var dropdowns = document.querySelectorAll('.inp_dropdown');
for(var i = 0; i < dropdowns.length; i++){
    settings[settings.length] = new inp_dropdown(dropdowns[i]);
}

function inp_toggle(_obj){
    this.obj = _obj;
    this.value = _obj.getAttribute('data-current');
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.name = _obj.id;
    this.type = _obj.getAttribute('data-type');

    var self = this;

    this.mouseDown = function(_e){
        self.value = self.value=="True"?"False":"True";
        self.updateState();
    }

    this.updateState = function(){
        self.obj.classList.remove("checked");
        if(self.value == "True"){
            self.obj.classList.add("checked");
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

var toggles = document.querySelectorAll('.inp_toggle');
for(var i = 0; i < toggles.length; i++){
    settings[settings.length] = new inp_toggle(toggles[i]);
}

function inp_joystick(_obj){
    this.obj = _obj;
    this.minValue = 0;
    this.maxValue = 1;
    this.pos1     = 0;
    this.pos2     = 0;
    this.value    = _obj.getAttribute('data-current').split('|');
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.dragActive = false;
    this.name = _obj.id;
    this.type = _obj.getAttribute('data-type');
    this.caption = _obj.getAttribute('data-caption');

    var self = this;

    this.pointer = document.createElement('div');
    this.pointer.className = 'pointer';
    this.pointer.setAttribute('style', 'left: '+(parseFloat(this.value[0])*100)+'%; top: '+((1 - parseFloat(this.value[1]))*100)+'%;');
    this.obj.appendChild(this.pointer);

    this.mouseDown = function(_e){
        self.dragActive = true;
        self.mouseMove(_e, false);
        pauseScrolling = true;
    }

    this.mouseMove = function(_e, _write){
        if(self.dragActive){
            var rect = _obj.getBoundingClientRect();
            var startLeft = rect.left;
            var startTop = rect.top;
            self.pos1 = Math.min(Math.max((_e.clientX - startLeft) / rect.width, 0), 1);
            self.pos2 = 1 - Math.min(Math.max((_e.clientY - startTop) / rect.height, 0), 1);
            self.value = [self.pos1, self.pos2];
            
            self.pointer.setAttribute('style', 'left: '+(parseFloat(self.value[0])*100)+'%; top: '+((1 - parseFloat(self.value[1]))*100)+'%;');

            if(self.saveOnChange && (_write === true || self.type == 'avatar')){
                if(self.type == 'avatar'){
                    changeAnimatorParam(self.name.replace('AVS_', '')+'-x', self.value[0]);
                    changeAnimatorParam(self.name.replace('AVS_', '')+'-y', self.value[1]);
                }else{
                    engine.call('CVRAppCallSaveSetting', self.name, "" + self.value);
                    game_settings[self.name] = self.value;
                    self.displayImperial();
                }
            }
        }
    }

    this.mouseUp = function(_e){
        self.mouseMove(_e, true);
        self.dragActive = false;
        pauseScrolling = false;
    }

    _obj.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
    //_obj.addEventListener('mouseup', this.mouseUp);

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

    return {
        name: this.name,
        value: this.getValue,
        updateValue: this.updateValue
    }
}

var joysticks = document.querySelectorAll('.inp_joystick');
for(var i = 0; i < joysticks.length; i++){
    settings[settings.length] = new inp_joystick(joysticks[i]);
}

function inp_sliderH(_obj){
    this.obj = _obj;
    this.minValue = parseFloat(_obj.getAttribute('data-min'));
    this.maxValue = parseFloat(_obj.getAttribute('data-max'));
    this.percent  = 0;
    this.value    = parseFloat(_obj.getAttribute('data-current'));
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.dragActive = false;
    this.name = _obj.id;
    this.type = _obj.getAttribute('data-type');
    this.caption = _obj.getAttribute('data-caption');

    var self = this;

    this.valueBar = document.createElement('div');
    this.valueBar.className = 'valueBar';
    this.valueBar.setAttribute('style', 'height: '+(((this.value - this.minValue) / (this.maxValue - this.minValue)) * 100)+'%;');
    this.obj.appendChild(this.valueBar);

    this.valueLabel = document.createElement('div');
    this.valueLabel.className = 'valueLabel';
    this.valueLabel.innerHTML = this.caption + Math.round(this.value);
    this.obj.appendChild(this.valueLabel);

    this.mouseDown = function(_e){
        self.dragActive = true;
        self.mouseMove(_e, false);
        pauseScrolling = true;
    }

    this.mouseMove = function(_e, _write){
        if(self.dragActive){
            var rect = _obj.getBoundingClientRect();
            var start = rect.top;
            var end = rect.bottom;
            self.percent = 1 - Math.min(Math.max((_e.clientY - start) / rect.height, 0), 1);
            var value = self.percent;
            value *= (self.maxValue - self.minValue);
            value += self.minValue;
            self.value = value;

            self.valueBar.setAttribute('style', 'height: '+(self.percent * 100)+'%;');
            self.valueLabel.innerHTML = self.caption + Math.round(self.value);

            if(self.saveOnChange && (_write === true || self.type == 'avatar')){
                if(self.type == 'avatar'){
                    changeAnimatorParam(self.name.replace('AVS_', ''), self.value / self.maxValue);
                }else{
                    engine.call('CVRAppCallSaveSetting', self.name, "" + self.value);
                    game_settings[self.name] = self.value;
                    self.displayImperial();
                }
            }
        }
    }

    this.mouseUp = function(_e){
        self.mouseMove(_e, true);
        self.dragActive = false;
        pauseScrolling = false;
    }

    _obj.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
    //_obj.addEventListener('mouseup', this.mouseUp);

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

    return {
        name: this.name,
        value: this.getValue,
        updateValue: this.updateValue
    }
}

var slidersH = document.querySelectorAll('.inp_sliderH');
for(var i = 0; i < slidersH.length; i++){
    settings[settings.length] = new inp_sliderH(slidersH[i]);
}

function inp_number(_obj){
    this.obj = _obj;
    this.minValue = parseFloat(_obj.getAttribute('data-min'));
    this.maxValue = parseFloat(_obj.getAttribute('data-max'));
    this.value    = parseFloat(_obj.getAttribute('data-current'));
    this.saveOnChange = _obj.getAttribute('data-saveOnChange') == 'true';
    this.name = _obj.id;
    this.type = _obj.getAttribute('data-type');
    this.caption = _obj.getAttribute('data-caption');
    this.mode = _obj.getAttribute('data-mode');

    if(this.mode == "int"){
        this.obj.innerHTML = this.caption + ": " + this.value;
    }else{
        this.obj.innerHTML = this.caption + ": " + this.value.toFixed(4);
    }
    
    var self = this;

    this.mouseDown = function(_e){
        self.dragActive = true;
        pauseScrolling = true;
        displayNumpad(self);
    }

    this.updateValue = function(_value, _write){
        self.value = Math.min(9999, Math.max(-9999, _value));

        if(self.mode == "int"){
            _obj.innerHTML = self.caption + ": " + self.value;
        }else{
            _obj.innerHTML = self.caption + ": " + self.value.toFixed(4);
        }
        
        if(self.saveOnChange && (_write === true || self.type == 'avatar')){
            if(self.type == 'avatar'){
                changeAnimatorParam(self.name.replace('AVS_', ''), self.value);
            }else{
                engine.call('CVRAppCallSaveSetting', self.name, "" + self.value);
                game_settings[self.name] = self.value;
                self.displayImperial();
            }
        }
    }

    this.mouseUp = function(_e){
        self.dragActive = false;
        pauseScrolling = false;
    }

    _obj.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mouseup', this.mouseUp);

    this.getValue = function(){
        return self.value;
    }
    
    this.getMode = function(){
        return self.mode;
    }

    return {
        name: this.name,
        value: this.getValue,
        updateValue: this.updateValue,
        getMode: this.getMode
    }
}

var inputNumber = document.querySelectorAll('.inp_number');
for(var i = 0; i < inputNumber.length; i++){
    settings[settings.length] = new inp_number(inputNumber[i]);
}

function updateGameSettingsValue(_name, _value){
    for(var i = 0; i < settings.length; i++){
        if(settings[i].name == _name){
            settings[i].updateValue(_value);
            game_settings[_name] = _value;
        }
    }
}

engine.on('UpdateGameSettings', function(_name, _value){
    updateGameSettingsValue(_name, _value);
});

engine.on('UpdateGameSettingsBulk', function(_settings){
    for(var i = 0; i < _settings.length; i++){
        updateGameSettingsValue(_settings[i].Name, _settings[i].Value);
    }
});

function updateDropDownOptions(_name, _options){
    var optionString = [];
    
    for(var i = 0; i < _options.length; i++){
        optionString[optionString.length] = [_options[i].key, _options[i].value];
    }
    
    for(i = 0; i < window.settings.length; i++){
        if(window.settings[i].name == _name){
            window.settings[i].setOptions(optionString);
            window.settings[i].updateOptions();
        }
    }
}

engine.on('UpdateDropDownOptions', function(_name, _options){
    updateDropDownOptions(_name, _options);
});

function addSettingsValue(name, delta){
    for(var i = 0; i < settings.length; i++){
        if(settings[i].name == name){
            settings[i].updateValue(settings[i].value() + delta);
            engine.call('CVRAppCallSaveSetting', name, '' + (settings[i].value() + delta));
        }
    }
}

var keyboardTarget;
var keyboardMaxLength = 0;

function displayKeyboard(_e){
    var keyboard = document.getElementById('keyboard');
    document.getElementById('keyoard-input').value = _e.value;
    keyboardMaxLength = parseInt(_e.getAttribute("data-max-length"));
    
    keyboardTarget = _e;

    keyboard.classList.remove('hidden');
    keyboard.classList.add('in');

    document.getElementById('keyoard-input').focus();
}

function closeKeyboard(){
    var keyboard = document.getElementById('keyboard');
    keyboard.classList.remove('in');
    keyboard.classList.add('out');
    setTimeout(function(){
        keyboard.classList.add('hidden');
        keyboard.classList.remove('out');
    }, 200);
}

var keyboardKeys = document.querySelectorAll('.keyboard-key');
var keyboardModKeys = document.querySelectorAll('.keyboard-mod');
var keyboardFuncKeys = document.querySelectorAll('.keyboard-func');

var keyMod = "";
var modLock = false;

for(var i=0; i < keyboardKeys.length; i++){
    keyboardKeys[i].addEventListener('mousedown', sendKey);
}

for(var i=0; i < keyboardFuncKeys.length; i++){
    keyboardFuncKeys[i].addEventListener('mousedown', sendFuncKey);
}

for(var i=0; i < keyboardModKeys.length; i++){
    keyboardModKeys[i].addEventListener('mousedown', sendModKey);
}

function sendKey(_e){
    var input = document.getElementById('keyoard-input');
    if(keyboardMaxLength > 0 && input.value.length == keyboardMaxLength) return;
    input.value += _e.target.textContent;
    
    if(!modLock && keyMod != ""){
        keyMod = "";

        var list = document.querySelectorAll('#keyboard .active');
        for(var i=0; i < list.length; i++){
            list[i].classList.remove('active');
        }
        
        updateKeys();
    }
}

document.getElementById('keyoard-input').addEventListener("keyup", function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
        if (document.getElementById('keyboard').classList.contains('in')){
            var input = document.getElementById('keyoard-input');
            keyboardTarget.value = input.value;
            closeKeyboard();
            var submit = keyboardTarget.getAttribute('data-submit');
            if(submit != null) {
                eval(submit);
            }
        }
    }
});

function sendFuncKey(_e){
    var input = document.getElementById('keyoard-input');
    var func = _e.target.getAttribute('data-key-func');
    
    switch(func){
        case 'BACKSPACE':
            input.value = input.value.substring(0, input.value.length - 1);
            break;
        case 'CLEAR':
            input.value = '';
            break;
        case 'ENTER':
            keyboardTarget.value = input.value;
            closeKeyboard();
            var submit = keyboardTarget.getAttribute('data-submit');
            if(submit != null) {
                eval(submit);
            }
            break;
        case 'BACK':
            closeKeyboard();
            break;
        case 'PASTE':
            keyboardPasteFromClipboard();
            break;
    }
}

function sendModKey(_e){
    var mod = _e.target.getAttribute('data-key-mod');
    var lock = _e.target.getAttribute('data-key-mod-lock');
    
    if(mod == null && lock != null){
        modLock = true;
        mod = lock;
    }
    
    if(mod == keyMod){
        keyMod = "";
        modLock = false;
        
        var list = document.querySelectorAll('#keyboard .active');
        for(var i=0; i < list.length; i++){
            list[i].classList.remove('active');
        }
    }else{
        keyMod = mod;
        _e.target.classList.add('active');
    }
    updateKeys();
}

function updateKeys(){    
    for(var i=0; i < keyboardKeys.length; i++){
        var value = keyboardKeys[i].getAttribute('data-key');
        var dataValue = keyboardKeys[i].getAttribute('data-key-' + keyMod);
        keyboardKeys[i].textContent = dataValue!=null?dataValue:value;
    }
}

var numpadTarget;
var numpadHasDecimal = false;
var numpadDecimals = 0;
var hasPlaceholder = false;
var numpadMode = "";

function displayNumpad(_e){
    var numpad = document.getElementById('numpad');

    numpadMode = _e.getMode();

    if(numpadMode == "int"){
        document.getElementById('numpad-input').value = _e.getValue();
    }else{
        document.getElementById('numpad-input').value = _e.getValue().toFixed(4);
    }
    
    document.getElementById('numpad-input').classList.add("placeholder");

    numpadTarget = _e;
    numpadHasDecimal = false;
    numpadDecimals = 0;
    hasPlaceholder = true;

    numpad.classList.remove('hidden');
    numpad.classList.add('in');
}

var numpadKeys = document.querySelectorAll('.numpadButton');

for(var i=0; i < numpadKeys.length; i++){
    numpadKeys[i].addEventListener('mousedown', sendNumpadKey);
}

function sendNumpadKey(_e){
    var value = _e.target.getAttribute('data-value');
    var input = document.getElementById('numpad-input');
    var currentValue = parseFloat(input.value);
    if (hasPlaceholder) currentValue = 0;
    
    switch(value){
        case 'back':
            closeNumpad();
            break;
        case 'clear':
            input.value = 0;
            input.classList.remove("placeholder");
            hasPlaceholder = false;
            numpadHasDecimal = false;
            numpadDecimals = 0;
            break;
        case '-':
            currentValue *= -1;
            input.value = currentValue;
            break;
        case 'enter':
            numpadTarget.updateValue(currentValue);
            closeNumpad();
            break;
        case '.':
            if(numpadMode != "int") {
                if (!numpadHasDecimal) {
                    input.classList.remove("placeholder");
                    hasPlaceholder = false;
                    numpadHasDecimal = true;
                    numpadDecimals = 1;
                    input.value = currentValue + ".";
                }
            }
            break;
        default:
            input.classList.remove("placeholder");
            hasPlaceholder = false;
            if(!numpadHasDecimal){
                currentValue = currentValue * 10 + parseInt(value);
                input.value = currentValue;
            }else{
                currentValue = currentValue + (parseInt(value) / Math.pow(10, numpadDecimals));
                if(numpadMode == "int") {
                    input.value = currentValue;
                }else{
                    input.value = currentValue.toFixed(Math.min(numpadDecimals, 4));
                }
                numpadDecimals++;
            }
            break;
    }
}

function closeNumpad(){
    var numpad = document.getElementById('numpad');
    numpad.classList.remove('in');
    numpad.classList.add('out');
    setTimeout(function(){
        numpad.classList.add('hidden');
        numpad.classList.remove('out');
    }, 200);
}

//Call Menu
function acceptCall(callId){
    engine.call("CVRAppCallAcceptCall", callId);
}

function denyCall(callId){
    engine.call("CVRAppCallDenyCall", callId);
}

function endCall(callId){
    engine.call("CVRAppCallEndCall", callId);
}

engine.on("CallServiceCallIncoming", function(call){
    cvr('.call-profile').addClass('calling').attr('src', call.profimeImageUrl);
    
    cvr('.call-name').innerHTML(call.username.makeSafe());
    
    cvr('.call-duration').innerHTML('Incoming Call');
    
    cvr('.call-actions').innerHTML('<div class="action-btn" onclick="acceptCall(\''+call.callId+'\');"><img src="gfx/compass.svg"></div>'+
        '<div class="action-btn" onclick="denyCall(\''+call.callId+'\');"><img src="gfx/compass.svg"></div>');
});

engine.on("CallServiceCallStarted", function(call){
    cvr('.call-profile').removeClass('calling').attr('src', call.profimeImageUrl);

    cvr('.call-name').innerHTML(call.username.makeSafe());
    
    cvr('.call-duration').innerHTML('00:00:00');

    cvr('.call-actions').innerHTML('<div class="action-btn" onclick="endCall(\''+call.callId+'\');"><img src="gfx/compass.svg"></div>');
});

engine.on("CallServiceCallTimeUpdate", function(call){
    cvr('.call-duration').innerHTML(new Date(call.duration * 1000).toISOString().substr(11, 8));
});

engine.on("CallServiceCallEnded", function(call){
    cvr('.call-profile').removeClass('calling').attr('src', '');

    cvr('.call-actions').innerHTML('');
});

function ShowCurrentInstanceDetails(){
    engine.trigger("CVRAppActionShowCurrentInstanceDetails");
}

function RemovePlayerAvatars(){
    engine.trigger("CVRAppActionClearAllAvatars");
}

function PanicMute(){
    engine.trigger("CVRAppActionMuteAllChannels");
}

engine.on("OpenInWorldKeyboard", function(previousValue){
    var worldInput = document.getElementById('world-ui-input');
    worldInput.value = previousValue;
    
    displayKeyboard(worldInput);
});

engine.on("updateKeyboardFromClipboard", function(content){
    var input = document.getElementById('keyoard-input');
    if(keyboardMaxLength > 0 && input.value.length == keyboardMaxLength) return;
    input.value += content;
});

function keyboardPasteFromClipboard(){
    engine.trigger("CVRAppActionKeyboardPaste");
}

function sendToWorldUi(){
    var worldInput = document.getElementById('world-ui-input');
    
    engine.call("CVRAppCallSendToWorldUi", worldInput.value);
}

engine.on("RemoveNotification", function(type, id){
    var eid = "";
    switch (type) {
        case "friendRequest":
            eid = "notification_friend_request_"+id;
            break;
        case "invite":
            eid = "notification_invite_"+id;
            break;
    }
    var element = document.getElementById(eid);
    if (element) {
        element.parentNode.removeChild(element);
    }
});

function GenerateSupportCode(){
    engine.trigger("CVRAppActionGenerateSupportCode");
}

engine.on("DisplaySupportCode", function(code){
    cvr('#support-code-display').innerHTML(code).attr("onclick", "CopySupportCode('"+code+"');");
});

function CopySupportCode(text){
    engine.call("CVRAppCallCopyToClipboard", text);
}

engine.on("SwitchCategory", function(tab){
    changeTab(tab, cvr(".tab_btn_"+tab).first());
});

engine.trigger('CVRAppActionNextSendFullFriendsList');

engine.on("LoadSearchResults", function(_results){
    displaySearch(_results);
});