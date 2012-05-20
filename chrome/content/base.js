var Contacts = {
    selected_email: function (contacts) {
        viewModel.clearPeople();
        jQuery.each(contacts, function(index, value) { 
            var p = new Person(value.name,value.email);
            viewModel.addPerson(p);
        });
        // body...
    }
};
var Person = function(name, email) {
    this.name = name;
    this.email= email;
}

var viewModel = {
    people: ko.observableArray(),
    showRenderTimes: ko.observable(false),
    addPerson: function(person) {this.people.push(person)},
    clearPeople: function(){this.people.remove(function(item) { return true })}
};

ko.applyBindings(viewModel);

