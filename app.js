"use strict";
var application = require('application');
application.on(application.launchEvent, function (args) {
   var mainPage = require("./home");
   mainPage.toateTraseele();
})
if(application.ios) {
  GMSServices.provideAPIKey("GOOGLE_MAPS_API_KEY");
}
var nativescript_fonticon_1 = require('nativescript-fonticon');
nativescript_fonticon_1.TNSFontIcon.debug = false;
nativescript_fonticon_1.TNSFontIcon.paths = {
    'fa': 'font-awesome.css'
};
nativescript_fonticon_1.TNSFontIcon.loadCss();
application.resources['fonticon'] = nativescript_fonticon_1.fonticon;

application.start({ moduleName: "home" });
