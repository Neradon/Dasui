renderWorlds = function(_list){
    var contentList = document.querySelector('#worlds .list-content');

    var html = '<div class="flex-list">';

    for(var i=0; _list[i]; i++){
				
		html += '<div data-id="'+_list[i].WorldId+'" class="content-cell friend" onclick="getWorldDetailsNew(\''+_list[i].WorldId+'\',event);" onmousedown="mousedowntest(event);"><div class="content-cell-formatter"></div>'+
                '<div class="content-cell-content"><div class="online-state-test">'+
                '<img class="content-image" src="'+
                _list[i].WorldImageUrl+'"></div><div class="content-name world">'+
                _list[i].WorldName.makeSafe()+'</div></div>'+
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

	if(Math.abs(dif.x) > 50 || Math.abs(dif.y) > 50){
		return;
	}
	mousedownlocation = {x:0,y:0};	
	
    engine.call('CVRAppCallGetWorldDetails', _uid);
}

AddWorld = function(_world){
    var html = '<div data-id="'+_list[i].WorldId+'" class="content-cell friend" onclick="getWorldDetailsNew(\''+_list[i].WorldId+'\',event);" onmousedown="mousedowntest(event);"><div class="content-cell-formatter"></div>'+
        '<div class="content-cell-content"><div class="online-state-test">'+
        '<img class="content-image" src="'+
        _list[i].WorldImageUrl+'"></div><div class="content-name world">'+
        _list[i].WorldName.makeSafe()+'</div></div>'+
        '</div>';

    cvr('#worlds .list-content .flex-list').addHTML(html);
}

UpdateWorld = function(_world){
    cvr('#worlds .list-content .flex-list [data-id="'+_world.WorldId+'"] .content-image').attr('src', _world.WorldImageUrl);
    cvr('#worlds .list-content .flex-list [data-id="'+_world.WorldId+'"] .content-name').innerHTML(_world.WorldName.makeSafe());
}

RemoveWorld = function(_world){
    cvr('#worlds .list-content .flex-list [data-id="'+_world.WorldId+'"]').remove();
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


loadWorldDetails = function(_data, _instances){
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

	document.querySelector('.data-worldFavorite').setAttribute('onclick', 'AddWorldToFavourites(\''+_data.WorldId+'\',\''+escape(_data.WorldName)+'\',\''+_data.WorldImageUrl+'\');');
    document.querySelector('.data-worldExplore').setAttribute('onclick', 'changeWorld(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldSetHome').setAttribute('onclick', 'setHome(\''+_data.WorldId+'\');');

    document.querySelector('.data-worldAuthorImage').src = _data.AuthorImageUrl;
    document.querySelector('.data-authorName').innerHTML = _data.AuthorName.makeSafe();
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


loadWorlds = function(_list){
    worldList = _list;

    renderWorlds(_list);

    worldsResetLoad = false;
}

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

RenderCategories = function(_categories){
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

    html = "<div class=\"searchBar\"> <input type=\"text\" class=\"inp_search\" id=\"cobaltSearchWorld\" placeholder=\"Search\" data-submit=\"cobaltSearchWorld();\" onclick=\"displayKeyboard(this);\" /> <div class=\"content-btn color-primary\" style=\"width: 60px; position: relative; left: auto;\" onclick=\"resetCobaltSearch();\" >X</div> </div>";
    
    html += '<div class="filter-option data-filter-favourites" onclick="filterContent(\'worlds\', \'favourites\');">Favourites</div>';

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
        if (categories[3][i].CategoryKey.length >= 50){
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



document.styleSheets[0].insertRule(".content-name.world{ line-height:1.5em !important; } ");
document.styleSheets[0].insertRule(".world .content-image { bottom: 7em !important; border-radius: 10px !important; }");
document.styleSheets[0].insertRule(".content-cell.world{ width: 18.5% !important; margin-right: 1.5% !important; margin-bottom: 1.5% !important; /* NEW */ background-color: rgba(150,150,150,0.6) !important; border: none !important; border-radius: 5px !important; /* box-shadow: 5px 5px 10px 5px rgba(181,175,174,0.5); */ } ");
document.styleSheets[0].insertRule(".content-cell-new-bottomtext{ position:absolute; right:0; left:0; margin:auto; bottom:10; text-align:center; overflow:hidden; }");
document.styleSheets[0].insertRule(".content-cell.world:hover { background-color: rgba(150,150,150,0.8) !important; } ");
document.styleSheets[0].insertRule(".world .content-cell-content{ left: 0px !important; top: 0px !important; bottom: 0px !important; margin: 0px 0px 0px 0px !important; padding: 0px 0px 0px 0px !important; }");
document.styleSheets[0].insertRule(" .world .content-cell-formatter{ margin-top: 2em !important; } ");
document.styleSheets[0].insertRule(".searchBar{display: flex;margin-bottom:1em; width:90%;}");
document.styleSheets[0].insertRule(".inp_search{ width: 33em; height: 4em; line-height: 1.7em; text-align: center; border-radius: 0.25em; } ");

engine.trigger('CVRAppTaskRefreshCategories');