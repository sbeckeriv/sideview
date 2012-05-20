window.addEventListener("load", function(event) { (function(loader) {
    loader.loadSubScript("chrome://sideview/content/jquery.js");
})(
Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(
    Components.interfaces.mozIJSSubScriptLoader));
    var Sideview = function(){
        this.sandbox = null;
        //todo: cache?
        this.mainwindow = function () {
            return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
        };
        this.injectBrowser = function(){
            var doc = this.mainwindow().document;
            if(doc.getElementById('sideviewContent')){ return true; }
            var v = doc.createElement("vbox");
            var height = doc.getElementById("messengerBox").clientHeight;
            v.setAttribute("width","150")
            v.setAttribute("id","sideviewContent");
            v.setAttribute("class","chomeclass-extrachrome");
            v.setAttribute("height",height);
            v.setAttribute("style","height:"+height+"px;")
            var box = doc.createElement('browser');
            box.setAttribute("id","sideviewBody");
            box.setAttribute("width","60")
            box.setAttribute("id","sideviewBody");
            box.setAttribute("class","chomeclass-extrachrome");
            box.setAttribute("height",height);
            box.setAttribute("flex","1");
            box.setAttribute("type","content");
            box.setAttribute("allowevents","true");
            box.setAttribute("style","height:"+height+"px;")
            box.setAttribute("src","chrome://sideview/content/index.html")
            box.addEventListener("load",window.sideview.onLoad,true)
            var r = doc.createElement("resizer")
            r.setAttribute("dir","topleft")
            r.setAttribute("height","2")
            r.setAttribute("style","cursor: nw-resize;")
            v.appendChild(box);
            this.sandbox = null;
            doc.getElementById('messengerBox').appendChild(v) 
        };
        this.setSandbox = function(){
            try{
                if(window.sideview.sandbox) {return true }
                var doc = window.sideview.mainwindow().document;
                var body = doc.getElementById("sideviewBody")
                if(body){
                    var view = body.contentDocument.defaultView;
                    //build sandbox and set the window back.
                    this.sandbox = Components.utils.Sandbox(view);
                    this.sandbox.window = view;
                    //view.document.addEventListener("Plugin.callback",window.sideview.pluginCallback,true);
                }
            }catch(e){alert("setSandbox"+e)}
        };
        this.onLoad = function(e){
            try{
                var main = window.sideview.mainwindow()
                var appcontent = main.document.getElementById("tabmail-container");
                var tree = document.getElementById('threadTree');

                tree.addEventListener('select', function(e){
                    window.sideview.onEmailSelect();
                }, true);
                window.sideview.setSandbox()

                window.sideview.onEmailSelect();
            }catch(e){window.sideview.log("onload"+e)}

        };
        this.log = function(message, state) {
            var con = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
            con.logStringMessage(message);
        };  

        this.onEmailSelect = function(){
            var messages = []
            var seen = {};
            var message = gMessageDisplay.displayedMessage;
            if (!message) {
                var selected = gFolderDisplay.selectedMessages;
                if(!selected || selected.length<1){
                    return false 
                }
                messages = messages.concat(selected);
            }else{ messages.push(message);}
            var contacts = [];
            var emails = [];
            jQuery.each(messages,function(index,message){
                emails = emails.concat(message.author.split(","),message.recipients.split(","),message.ccList.split(","),message.bccList.split(','));
            });
            for (var i = 0; i < emails.length; i++) {
                if (emails[i].length > 0) {
                    var email_parts = emails[i].split(/<|>/);
                    if (email_parts.length > 1) {
                        if(!seen[email_parts[1]+email_parts[0]]){
                            contacts.push({ email: [email_parts[1]], name: email_parts[0] })
                            seen[email_parts[1]+email_parts[0]]=true;
                        }
                    } else {
                        if(!seen[email_parts[0]]){
                            contacts.push({ email: [email_parts[0]] })

                            seen[email_parts[0]]=true;
                        }
                    }
                }
            }
            if (contacts.length > 0) {
                window.sideview.sendContacts(contacts);
            }
        };
        this.sendContacts = function(contacts){
            try{
                window.sideview.setSandbox();
                if(window.sideview.sandbox){
                    var json = JSON.stringify(contacts);
                    var s="(function() {window.wrappedJSObject.Contacts.selected_email("+json+")})();"
                    //s="(function() { window.wrappedJSObject.alert(window.Contacts)})()"
                    return Components.utils.evalInSandbox(s,window.sideview.sandbox);
                }
            }catch(e){alert(e); window.sideview.log("sendcontacts:"+e)} 
        };
        this.pluginCallback = function(e){
            alert(e)
        };
    };
    if (typeof(window.sideview) === 'undefined') {
        window.sideview = new Sideview();
    }
},false)

