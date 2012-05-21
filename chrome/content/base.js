var Contacts = {
    selected_email: function (contacts) {
        viewModel.clearPeople();
        jQuery.each(contacts, function(index, value) { 
            var p = new Person(value.name,value.email);
            viewModel.addPerson(p);
        });
    }
};
var Person = function(name, email) {
    this.name = name;
    this.email= email;
    this.mug_url =function(){
        return "chrome://sideview/content/chess.png"
    }
}
var viewModel = {
    people: ko.observableArray(),
    showRenderTimes: ko.observable(false),
    addPerson: function(person) {this.people.push(person)},
    clearPeople: function(){this.people.remove(function(item) { return true })}
};
ko.applyBindings(viewModel);

shrink=function(){
    callPlugin("resize","shrink")
    $(".shrink").hide()
    $(".expand").show()
    $("body").addClass("small")
    $("body").removeClass("large")

}
$(".expand").hide()

expand=function(){
    callPlugin("resize","expand")
    $(".shrink").show()
    $(".expand").hide()
    $("body").removeClass("small")
    $("body").addClass("large")
}
callPlugin = function(event,data){
    var ev = document.createEvent("Events");
    ev.initEvent("Plugin.callback", true, false);
    var transport = $("#transport");
    //should prevent smashing
    if(transport.children.length > 20){
        jQuery.each(transport.children,function(index,node){
            if(index>10){ node.remove(); }
        })
    }
    transport.append($("<div style='display:none'><div id='eventname'></div><div id='eventdata'></div></div>"));
    var child = transport.children()[0];
    var eventnameNode = transport.find("#eventname");
    var eventdataNode = transport.find("#eventdata");
    eventnameNode.text(event);
    eventdataNode.text(data);
    child.dispatchEvent(ev);
}

