if(typeof(com)==='undefined'){
    com = {};
}

if(typeof(com.manatee)==='undefined'){
    com.manatee = {};
}

com.manatee._engineBase = "/engine/"

if(!console){
    console = {
        _warned: false,
        log: function(data){
            if(!console._warned){
                alert("No console available...");
            }
        }
    }
}

if (!importScripts) {
    var importedScripts = [];
    var importScripts = (function(globalEval) {
        var xhr = new XMLHttpRequest;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            var len = args.length;
            var i = 0;
            var meta;
            var data;
            var content;

            for (; i < len; i++) {
                if (args[i].substr(0, 5).toLowerCase() === "data:") {
                    data = args[i];
                    content = data.indexOf(",");
                    meta = data.substr(5, content).toLowerCase();
                    data = decodeURIComponent(data.substr(content + 1));

                    if (/;\s*base64\s*[;,]/.test(meta)) {
                        data = atob(data); // decode base64
                    }
                    if (/;\s*charset=[uU][tT][fF]-?8\s*[;,]/.test(meta)) {
                        data = decodeURIComponent(escape(data)); // decode UTF-8
                    }
                } else {
                    if($.inArray(args[i],importedScripts) === -1){
                        xhr.open("GET", com.manatee._engineBase + args[i], false);
                        xhr.send(null);
                        data = xhr.responseText;
                        importedScripts.push(args[i]);
                    }
                }
                globalEval(data);
            }
        };
    }(eval));

}

importScripts('game.js');