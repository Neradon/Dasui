//#region versioncheck

var gameVersion = "-1";

var dasuiVersion = "2021r160 EV1";

var compatible = false;

var checkedVersion = false;


engine.on('UpdateGameDebugInformation', function(_info){
    if(checkedVersion == false){
        gameVersion = _info.Version.trim();
        if(gameVersion == dasuiVersion){
            compatible = true;
            initStuff();
        }
        else{
            compatible = false;
            uiAlertShow("DASUI", "DasUi is not compatible with this gameversion! Please update DasUi!", 12345);
        }
        checkedVersion = true;
    }
});

//#endregion

// #region custom saving



function isJson(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
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

function initStuff(){
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

    var el = document.getElementById('GeneralClockFormat');
    elClone = el.cloneNode(true);

    el.parentNode.replaceChild(elClone, el);

    var test = document.getElementById('GeneralClockFormat');
        while (test.firstChild) {
            test.removeChild(test.firstChild);
        }

    settings[16] = new inp_dropdown(test);


var dasuiFriends = document.createElement('script');
dasuiFriends.setAttribute('src','dasuiFriends.js');
document.head.appendChild(dasuiFriends);

var dasuiWorlds = document.createElement('script');
dasuiWorlds.setAttribute('src','dasuiWorlds.js');
document.head.appendChild(dasuiWorlds);

var dasuiStyles = document.createElement('script');
dasuiStyles.setAttribute('src','dasuiStyles.js');
document.head.appendChild(dasuiStyles);

var elements = document.querySelectorAll('link[rel=stylesheet]');
for(var i=0;i<elements.length;i++){
    elements[i].parentNode.removeChild(elements[i]);
}

var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '';
    link.media = 'all';
    head.appendChild(link);
}

document.styleSheets[0].insertRule(".time-display {margin-top: 0.35em !important;font-size: 2.5em !important;}")

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
		if(parsed[_key].some(x=>x.Guid === _value.Guid)){
			parsed[_key] = parsed[_key].filter(function(ele){
				return ele.Guid != _value.Guid;
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
		return "100";
	}
}




// #endregion


var mousedownlocation = {x:0,y:0};

function mousedowntest(e){
	mousedownlocation.x = e.clientX;
	mousedownlocation.y = e.clientY;
}

// #region clock css fix


// #endregion

