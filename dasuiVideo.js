document.styleSheets[0].insertRule(".content-debug { height: 15% !important; top: 85% !important;}");
document.styleSheets[0].insertRule(".content-shortcuts { height: 74% !important;}");



cvr(".content-shortcuts").addHTML("<div class=\"btn-row-wrapper actions\"><div class=\"action-btn media prev\" onclick=\"engine.trigger('CVRAppVideoPastePlay');\"><img src=\"https://www.svgrepo.com/download/166990/paste.svg\">Paste</div><div class=\"action-btn media playpause\" onclick=\"engine.trigger('CVRAppVideoPlay');\"><img src=\"gfx/btn-media-play.svg\">V-Play</div><div class=\"action-btn media next\" onclick=\"engine.trigger('CVRAppVideoPause');\"><img src=\"gfx/btn-media-stop.svg\">V-Pause</div></div>")