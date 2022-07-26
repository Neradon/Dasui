

var backgroundClasses = ".btn-region .region-select, .world-instancing, .user-settings-dialog, .content, .toolbar, #world-detail, #instance-detail, #user-detail, #avatar-detail, #avatar-settings, #keyboard, #numpad, #alert, #alertTimed, #confirm, #loading, #push, .valueList";
var backgroundClassesDisabled = ".action-btn.disabled, .world-instancing .content-btn.disabled, .world-instancing .content-btn.disabled:hover, .content-instance-buttons .instance-btn.disabled, .world-instancing .content-btn.disabled:hover, .world-instancing .content-btn.disabled:hover, .avatar-toolbar .toolbar-btn.disabled, .avatar-toolbar .toolbar-btn.disabled:hover, .user-toolbar .toolbar-btn.disabled, .user-toolbar .toolbar-btn.disabled:hover";
var accentClassesBorder = ".world-instancing, .support-code-display, .inp_search, .noMessagesInfo, .inp_slider_custom, .content, .message-box, #keyboard, .advAvtrProfName, .advAvtrProfSave, .advAvtrProfDelete, .filter-option, .inp_dropdown, .toolbar-btn-double, .toolbar-btn, .toolbar, .content-btn, .action-btn, .content-avatar-functions, .content-panic, .content-debug, .content-shortcuts ,.content-feed, .content-call, .inp_toggle, .imperialDisplay, .inp_btn_action, .inp_button, .inp_slider, .content-cell, .content-world-information, .content-world-actions, .content-world-author, .content-world-author-worlds, .content-world-instances, .content-world-intancing, .world-instance, .close-btn, .content-instance-owner, .content-instance-world, .content-instance-information, .content-instance-buttons, .content-instance-players, .user-sidebar, .user-settings-dialog, .user-toolbar, .tab-contents,#tab-content-activity .player-instance-rules, .activityDataUnavailableInfo, .tab-btn, #tab-content-activity .player-instance-players, .avatar-sidebar, .avatar-maininformation, .avatar-toolbar, .favorite-category-selection, .valueList";
var accentClassesBorderTop = ".keyboard-row + .keyboard-row, .valueList .listValue + .listValue";
var accentClassesBorderLeft = ".btn-region .region-select + .region-select, .btn-rule .rule-select + .rule-select, .list-content, .content-instance-buttons .instance-btn + .instance-btn, .keyboard-key + .keyboard-key, .keyboard-key + .keyboard-mod, .keyboard-key + .keyboard-func, .keyboard-mod + .keyboard-key, .keyboard-mod + .keyboard-mod, .keyboard-mod + .keyboard-func, .keyboard-func + .keyboard-key, .keyboard-func + .keyboard-mod, .keyboard-func + .keyboard-func";
var specialClasses = ".inp_slider .valueBar, .inp_toggle.checked, .inp_slider_custom .valueBar";
var highlightClasses = ".content-world-actions .data-worldFavorite:hover, .btn-region .region-select.active, .btn-region .region-select:hover, .btn-rule .rule-select.active, .btn-rule .rule-select:hover, .world-instancing .content-btn.active, .keyboard-key:hover, .keyboard-mod:hover, .keyboard-func:hover, .keyboard-key.active, .keyboard-mod.active, .keyboard-func.active, .advAvtrProfName:hover, .advAvtrProfSave:hover, .advAvtrProfDelete:hover, .filter-option.active, .filter-option:hover, .content-btn:hover, .toolbar-btn:hover, .toolbar-btn.active, .action-btn:hover, .close-btn:hover, .avatar-toolbar .toolbar-btn:hover, .user-toolbar .toolbar-btn:hover, .content-instance-buttons .instance-btn:hover, .inp_dropdown .valueList .listValue:hover, .inp_dropdown:hover";
var textClasses = "h1, h2, h3, div, p, a, div.toolbar-btn, .list-filter h1, .inp_slider .valueLabel, .inp_search, .inp_button, .imperialDisplay, .valueLabel, .inp_slider_custom .valueLabel";

var sheet1 = document.createElement('style')
var sheet2 = document.createElement('style')
var sheet3 = document.createElement('style')
var sheet4 = document.createElement('style')
document.body.appendChild(sheet1);
document.body.appendChild(sheet2);
document.body.appendChild(sheet3);
document.body.appendChild(sheet4);

var defaultValues = {
    "BGColor-r" : 23,
    "BGColor-g" : 69,
    "BGColor-b" : 47,
    "BGColor-a" : 255,
    "HLColor-r" : 89,
    "HLColor-g" : 136,
    "HLColor-b" : 93,
    "HLColor-a" : 255,
    "ACColor-r" : 89,
    "ACColor-g" : 136,
    "ACColor-b" : 93,
    "ACColor-a" : 255,
    "TXColor-r" : 255,
    "TXColor-g" : 255,
    "TXColor-b" : 255,
    "TXColor-a" : 255,
}

function HideAllBackgroundContent(){
    document.getElementById('friends').classList.add('out');
    document.getElementById('worlds').classList.add('out');
    document.getElementById('home').classList.add('out');
    document.getElementById('avatars').classList.add('out');
    document.getElementById('props').classList.add('out');
    document.getElementById('messages').classList.add('out');
}

function ShowAllBackgroundContent(){
    document.getElementById('friends').classList.remove('out');
    document.getElementById('worlds').classList.remove('out');
    document.getElementById('home').classList.remove('out');
    document.getElementById('avatars').classList.remove('out');
    document.getElementById('props').classList.remove('out');
    document.getElementById('messages').classList.remove('out');
}



function GetDefaultValue(_id){
    // console.log(_id);
    // console.log(defaultValues[_id]);
    return defaultValues[_id];
}


function inp_slider_custom(_obj){
    this.obj = _obj;
    this.minValue = parseFloat(_obj.getAttribute('data-min'));
    this.maxValue = parseFloat(_obj.getAttribute('data-max'));
    this.percent  = 0;
    this.color = _obj.id.substr(_obj.id.length - 2, _obj.id.length);
    this.name = _obj.id.replace('CVR_', '').replace(this.color, '');
    this.value = GetFromCustom(this.name+this.color);
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
    if(self.value == -1){
        self.value = GetDefaultValue(self.name+self.color);
    }

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
                    for (let i = 0; i < document.styleSheets[1].cssRules.length; i++) {
                        document.styleSheets[1].deleteRule(i);
                    }
                    document.styleSheets[1].insertRule(backgroundClasses+"{background-color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[1].insertRule(backgroundClassesDisabled+"{background-color: rgba("+(red-50)+","+(green-50)+","+(blue-50)+","+alpha/255+") !important}");

                    // document.styleSheets[1].cssRules[0].style.backgroundColor = "rgba("+red+","+green+","+blue+","+alpha/255+")";
                break;
                case "ACColor":
                    for (let i = 0; i < document.styleSheets[2].cssRules.length; i++) {
                        document.styleSheets[2].deleteRule(i);
                    }
                    document.styleSheets[2].insertRule(accentClassesBorder+"{border: 3px solid rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[2].insertRule(accentClassesBorderTop+"{border-top: 3px solid rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[2].insertRule(accentClassesBorderLeft+"{border-left: 3px solid rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                break;
                case "HLColor":
                    for (let i = 0; i < document.styleSheets[3].cssRules.length; i++) {
                        document.styleSheets[3].deleteRule(i);
                    }
                    document.styleSheets[3].insertRule(highlightClasses+"{background-color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                    document.styleSheets[3].insertRule(specialClasses+"{background-color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
                break;
                case "TXColor":
                    for (let i = 0; i < document.styleSheets[4].cssRules.length; i++) {
                        document.styleSheets[4].deleteRule(i);
                    }
                    document.styleSheets[4].insertRule(textClasses+"{color: rgba("+red+","+green+","+blue+","+alpha/255+") !important}");
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
      updateValue: this.updateValue,
      updatePreview: this.UpdatePreview
    }
}

document.styleSheets[0].insertRule(".inp_slider_custom.color { width: 80%;}");
document.styleSheets[0].insertRule(".inp_slider_custom .valueLabel { position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-align: center; /*text-shadow: 0 0 2px #000;*/ line-height: 1.333333em; font-size: 1.5em; color: white; }");
document.styleSheets[0].insertRule(".inp_slider_custom .valueBar { position: absolute; height: 100%; /* background: grey !important; */ color: white; }");
document.styleSheets[0].insertRule(".inp_slider_custom { width: 100%; height: 2em; position: relative; margin-bottom: 1em; }");
document.styleSheets[0].insertRule(".inp_slider .valueLabel{ color: white !important; } ");
document.styleSheets[0].insertRule(".toolbar-btn + .toolbar-btn { border-left: 0px solid #59885d !important; } ");
document.styleSheets[0].insertRule(".content { background: top / 2560px 1440px no-repeat url('coui://UIResources/CVRTest/background.png');  }");
document.styleSheets[0].insertRule(".toolbar { background: bottom / 2560px 1440px no-repeat url('coui://UIResources/CVRTest/background.png'); } ");
document.styleSheets[0].insertRule(".tab-contents {background-color: rgba(0,0,0,0) !important} ");

var newItem = document.createElement("div");
newItem.innerHTML = "<div class=\"filter-option\" onclick=\"switchSettingCategorie('settings-dasui', this)\">DasUI</div>";
// var list = document.getElementById("settings").getElementsByClassName("filter-content")[0];
var list = document.querySelector("div#settings .list-filter .scroll-content .filter-content")

list.insertBefore(newItem.firstChild,list.childNodes[0]);




cvr("#settings .list-content").addHTML(""
    +"<div id=\"settings-dasui\" class=\"settings-categorie\">"
    +"<div class=\"row-wrapper\" style='margin-bottom:50px'>\r\n                            <div class=\"option-caption\">Background Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_BGColor\" class=\"color-preview\" data-r=\"222\" data-g=\"100\" data-b=\"222\" data-a=\"255\"  style=\"background-color: rgba(222,222,222,1);\"></div>\r\n                                    <div id=\"CVR_BGColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_BGColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_BGColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_BGColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div></div></div>"
    +"<div class=\"row-wrapper\" style='margin-bottom:50px'>\r\n                            <div class=\"option-caption\">Highlight Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_HLColor\" class=\"color-preview\" data-r=\"222\" data-g=\"100\" data-b=\"222\" data-a=\"255\"  style=\"background-color: rgba(222,222,222,1);\"></div>\r\n                                    <div id=\"CVR_HLColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_HLColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_HLColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_HLColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div></div></div>"
    +"<div class=\"row-wrapper\" style='margin-bottom:50px'>\r\n                            <div class=\"option-caption\">Border Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_ACColor\" class=\"color-preview\" data-r=\"222\" data-g=\"222\" data-b=\"222\" data-a=\"255\"  style=\"background-color: rgba(222,222,222,1);\"></div>\r\n                                    <div id=\"CVR_ACColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_ACColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_ACColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_ACColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div></div></div>"
    +"<div class=\"row-wrapper\">\r\n                            <div class=\"option-caption\">Text Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_TXColor\" class=\"color-preview\" data-r=\"255\" data-g=\"255\" data-b=\"255\" data-a=\"255\"  style=\"background-color: rgba(255,255,255,1);\"></div>\r\n                                    <div id=\"CVR_TXColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_TXColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_TXColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_TXColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"255\" data-saveOnChange=\"true\"></div></div></div></div>");
var fixed = false;

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
            var slid = new inp_slider_custom(sliderinos[i]);
            settings[settings.length] = slid;
        }
    }
}
updateGameSettingsValue("GeneralClockFormat",game_settings["GeneralClockFormat"]);
setTimeout(()=>updateGameSettingsValue("GeneralClockFormat",game_settings["GeneralClockFormat"]),100);

