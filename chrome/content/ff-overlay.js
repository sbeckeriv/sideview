var con = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

var sideviewBase = {
    onLoad: function() {
        // initialization code
        this.initialized = true;
        this.strings = document.getElementById("sideview-strings");
        this.initBrowser();
    },
    initBrowser: function(){
        con.logStringMessage('initBrowser');
        if(!window.sideview){
            setTimeout(function(){
                sideviewBase.initBrowser()
            },500);
            return false;
        }
        var tree = document.getElementById('threadTree');
        tree.addEventListener('select', sideviewBase.run, true);

    },
    run: function(){
        con.logStringMessage('run');
        try{
            window.sideview.injectBrowser();
            var tree = document.getElementById('threadTree');
            tree.removeEventListener('select', sideviewBase.run, true);
        }catch(e){
            con.logStringMessage('Error in sideviewBase.run:'+e)
        }

    },
};

window.addEventListener("load", function () { sideviewBase.onLoad(); }, false);


