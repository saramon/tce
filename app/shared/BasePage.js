var topmost = require("ui/frame").topmost;
var Observable = require("data/observable").Observable;

var appViewModel = new Observable();

function BasePage() {}
BasePage.prototype.viewModel = appViewModel
BasePage.prototype.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = appViewModel;
    var receivedData = page.navigationContext;
    appViewModel.set("selectedPage", receivedData.name);
    // console.log(receivedData.name);
}
BasePage.prototype.toggleDrawer = function() {
    var page = topmost().currentPage;
    page.getViewById("drawer").toggleDrawerState();
}
BasePage.prototype.navigate = function(args) {
    var pageName = args.view.text.toLowerCase();
    if(pageName == 'trasee'){
        var navigationOptions={
            moduleName:'home',
            context:{name: pageName}
        }
    } else {
        var navigationOptions={
            moduleName:'pages/' + pageName + '/' + pageName,
            context:{name: pageName}
        }
    }
    topmost().navigate(navigationOptions);
}

module.exports = BasePage;