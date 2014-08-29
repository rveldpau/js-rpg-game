importScripts('configuration.js')

if(typeof(com)==="undefined"){
    com = {};
}

if(typeof(com.manatee) === "undefined"){
    com.manatee = {};
}

if(typeof(com.manatee.data) === "undefined"){
    com.manatee.data = (function(){
        var data = {};
        var xmlhttp = new XMLHttpRequest();
        
        data.load = function(dataLocation){
            return JSON.parse(data.loadText(dataLocation));
        };
        data.loadScript = function(dataLocation){
            return eval(data.loadText(dataLocation));
        }
        data.loadText = function(dataLocation){
            var url = com.manatee.config.getProperty(com.manatee.config.BASEURL);;
            if(url.slice(-1)!="/"){
                url += "/";
            }
            url += dataLocation;
            console.log("Loading... " + url)
            xmlhttp.open("GET",url,false);
            xmlhttp.send();
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                return xmlhttp.responseText;
            }else{
                console.log("Failed to get")
                throw {
                    "message": "Failed to get " + url,
                    "status": xmlhttp.status,
                    "statusText": xmlhttp.statusText
                };
            }
        }
        return data;
    })();
}



