

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

document.styleSheets[0].insertRule(".inp_slider_custom.color { width: 80%;}");
document.styleSheets[0].insertRule(".inp_slider_custom .valueLabel { position: absolute; top: 0; left: 0; width: 100%; height: 100%; text-align: center; /*text-shadow: 0 0 2px #000;*/ line-height: 1.333333em; font-size: 1.5em; color: white; }");
document.styleSheets[0].insertRule(".inp_slider_custom .valueBar { position: absolute; height: 100%; /* background: grey !important; */ color: white; }");
document.styleSheets[0].insertRule(".inp_slider_custom { width: 100%; height: 2em; position: relative; margin-bottom: 1em; }");
document.styleSheets[0].insertRule(".inp_slider .valueLabel{ color: white !important; } ");
document.styleSheets[0].insertRule(".toolbar-btn + .toolbar-btn { border-left: 0px solid #59885d !important; } ");
document.styleSheets[0].insertRule(".content { background: top / 2560px 1440px no-repeat url('coui://UIResources/CVRTest/background.png'); }");
document.styleSheets[0].insertRule(".toolbar { background: bottom / 2560px 1440px no-repeat url('coui://UIResources/CVRTest/background.png'); } ");
// document.styleSheets[0].insertRule("");

var newItem = document.createElement("div");
newItem.innerHTML = "<div class=\"filter-option\" style=\"position:absolute\" onclick=\"switchSettingCategorie('settings-dasui', this)\">DasUI</div>";
var list = document.getElementById("settings").getElementsByClassName("list-filter")[0];

list.insertBefore(newItem.firstChild,list.childNodes[0]);

var sheet1 = document.createElement('style')
var sheet2 = document.createElement('style')
var sheet3 = document.createElement('style')
document.body.appendChild(sheet1);
document.body.appendChild(sheet2);
document.body.appendChild(sheet3);


cvr("#settings .list-content").addHTML("<div id=\"settings-dasui\" class=\"settings-categorie\"><div class=\"row-wrapper\" style='margin-bottom:50px'>\r\n                            <div class=\"option-caption\">Background Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_BGColor\" class=\"color-preview\" data-r=\"100\" data-g=\"100\" data-b=\"100\" data-a=\"255\"  style=\"background-color: rgba(100,100,100,1);\"></div>\r\n                                    <div id=\"CVR_BGColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_BGColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_BGColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_BGColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                </div>\r\n                        </div>\r\n                        <div class=\"row-wrapper\" style='margin-bottom:50px'>\r\n                            <div class=\"option-caption\">Highlight Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_HLColor\" class=\"color-preview\" data-r=\"100\" data-g=\"100\" data-b=\"100\" data-a=\"255\"  style=\"background-color: rgba(100,100,100,1);\"></div>\r\n                                    <div id=\"CVR_HLColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_HLColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_HLColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_HLColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                </div>\r\n                        </div>\r\n                        <div class=\"row-wrapper\">\r\n                            <div class=\"option-caption\">Border Color:</div>\r\n                                <div class=\"option-input\">\r\n                                    <div id=\"CVR_PREV_ACColor\" class=\"color-preview\" data-r=\"100\" data-g=\"100\" data-b=\"100\" data-a=\"255\"  style=\"background-color: rgba(100,100,100,1);\"></div>\r\n                                    <div id=\"CVR_ACColor-r\" class=\"inp_slider_custom color\" data-caption=\"Red: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_ACColor-g\" class=\"inp_slider_custom color\" data-caption=\"Green: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_ACColor-b\" class=\"inp_slider_custom color\" data-caption=\"Blue: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                    <div id=\"CVR_ACColor-a\" class=\"inp_slider_custom color\" data-caption=\"Alpha: \" data-type=\"dasui\" data-min=\"0\" data-max=\"255\" data-current=\"100\" data-saveOnChange=\"true\"></div>\r\n                                </div>\r\n                        </div>\r\n                    </div>")

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
            settings[settings.length] = new inp_slider_custom(sliderinos[i]);
        }
    }
}

updateGameSettingsValue("GeneralClockFormat",game_settings["GeneralClockFormat"]);