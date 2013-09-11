if(typeof(com)=="undefined"){
    com = {};
}

if(typeof(com.manatee) == "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.game) == "undefined"){
    com.manatee.game = {
        loop:null,
        world:null,
        initialize: function(worldLocation){
            var screenWidth = 800;
            var screenHeight = 600;
            com.manatee.graphics._createScreen(screenWidth,screenHeight);
            
            com.manatee.game.loop = new Worker("engine/game_loop.js");
            com.manatee.game.loop.onmessage = com.manatee.game._handleLoopMessage;
            
            $('body').keydown(function(ev){
                com.manatee.game.loop.postMessage({"action":"keydown","keycode":ev.keyCode})
                return false;
            });
            $('body').keyup(function(ev){
                com.manatee.game.loop.postMessage({"action":"keyup","keycode":ev.keyCode})
                return false;
            });
            
            $(window).focus(function(){
                com.manatee.game.loop.postMessage({"action":"resume"})
                document.title = document.title.replace( " - Paused","")
            })
            
            $(window).blur(function(){
                com.manatee.game.loop.postMessage({"action":"pause"})
                if(document.title.indexOf("Paused")==-1){
                    document.title = document.title + " - Paused"
                }
            })
            
            com.manatee.game.loop.postMessage({"action":"start",
                "baseUrl":document.location.href,
                "worldLocation": worldLocation,
                "screenHeight":screenHeight,
                "screenWidth":screenWidth})

            console.log("Initialized")
        },
        _handleLoopMessage:function(event){
            var data = event.data;
            switch(data.action){
                case "log":
                    console.log(data.message);
                    break;
                case "load":
                    if(data.type=="spriteset"){
                        com.manatee.spritesets.load(data.location)
                    }
                    break;
                case "draw":
                    com.manatee.graphics.drawAll(data.screenTop,data.screenLeft,JSON.parse(data.objects),data.debugText);
                    break;
                case "dialog":
                    com.manatee.graphics.showDialog(data.dialog);
                    break;
                case "config-change":
                    console.log("Config updated from loop");
                    com.manatee.config.setProperty(data.property, data.value);
                    break;
            }
            com.manatee.game.loop.postMessage({"action":"complete","completed":data.action})  
            
            
        }
    }
}