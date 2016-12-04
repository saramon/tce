var vmModule = require("./main-view-model");

function pageNavigatedTo(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel.get("selectedItem");
}
exports.pageNavigatedTo = pageNavigatedTo;

var frame = require("ui/frame");
exports.goBack = function(){
    frame.topmost().goBack();
};

