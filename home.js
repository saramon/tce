var http = require("http");
var observableArray = require("data/observable-array");
var listaTrasee = new observableArray.ObservableArray([]);
var listaTraseeCautare = new observableArray.ObservableArray([]);
var observableModule = require("data/observable");
var pageData = new observableModule.Observable();
var frames = require("ui/frame");
var platform = require("platform");
var vmModule = require("./main-view-model");
var twoPaneLayout = Math.min(platform.screen.mainScreen.widthDIPs, platform.screen.mainScreen.heightDIPs) > 600;
var observable = require("data/observable").Observable;


// encode(decode) html text into html entity
var decodeHtmlEntity = function(str) {
return str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
});
};

var encodeHtmlEntity = function(str) {
var buf = [];
for (var i=str.length-1;i>=0;i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
}
return buf.join('');
};

function onNavigatingTo(args) {
    var page = args.object;
    pageData.set('listaTrasee', listaTrasee);
    pageData.set('listaTraseeCautare', listaTraseeCautare);
    //select home as selectedPage for menu
    pageData.set("selectedPage", "home");
    page.bindingContext = pageData;
}
exports.onNavigatingTo = onNavigatingTo;

var topmost = require("ui/frame").topmost;
function toggleDrawer() {
    var page = topmost().currentPage;
    page.getViewById("drawer").toggleDrawerState();
}
exports.toggleDrawer = toggleDrawer;

function navigate(args) {
    var page = args.object;
    page.bindingContext = pageData;
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
exports.navigate = navigate;



function toateTraseele(args){
    if(listaTrasee.length > 0){
        listaTrasee.length = 0;
    }
    
    http.getJSON('http://tce.hontryke.com/wp-json/wp/v2/trasee?per_page=100&order=asc').then(function(r){
        // console.log(JSON.stringify(r));

        for(var i = 0; i < r.length; i++){
            var statii_tur = new observableArray.ObservableArray([]);
            var statii_retur = new observableArray.ObservableArray([]);
            for (var key in r[i].statii_tur[0]) {
                if (r[i].statii_tur[0].hasOwnProperty(key)) {
                    // console.log(key + " -> " + r[i].statii_tur[0][key]);
                    var statie = {nume_statie: r[i].statii_tur[0][key], nr_statie: key};
                    statii_tur.push(statie);
                }
            }
            for (var key in r[i].statii_retur[0]) {
                if (r[i].statii_retur[0].hasOwnProperty(key)) {
                    // console.log(key + " -> " + r[i].statii_tur[0][key]);
                    var statie = {nume_statie: r[i].statii_retur[0][key], nr_statie: key};
                    statii_retur.push(statie);
                }
            }
            
            var traseu = {
                nume:decodeHtmlEntity( r[i].title.rendered),
                content:r[i].content.rendered,
                numar: r[i].numar,
                nume_traseu: r[i].nume_traseu,
                tip_autovehicul: r[i].autovehicul[0].name,
                icon_autovehicul: r[i].autovehicul[0].icon,
                statii_tur: statii_tur,
                statii_retur: statii_retur
            }

            listaTrasee.push(traseu);
        }
    }, function(e){
        console.log(e);
    });
}
exports.toateTraseele = toateTraseele;

function cauta(){
    if(listaTraseeCautare.length > 0){
        listaTraseeCautare.length = 0;
    }
    var expresie = pageData.get("cauta_keyword");
    var termeni_cautare = expresie.replace(/\s/g,'+');
    
    
    http.getJSON('http://tce.hontryke.com/wp-json/wp/v2/trasee?filter[s]='+termeni_cautare+'&orderby=relevance&order=asc&per_page=100').then(function(r){
        // console.log(JSON.stringify(r));
        console.log(termeni_cautare);
        for(var i = 0; i < r.length; i++){
            var statii_tur = new observableArray.ObservableArray([]);
            var statii_retur = new observableArray.ObservableArray([]);
            for (var key in r[i].statii_tur[0]) {
                if (r[i].statii_tur[0].hasOwnProperty(key)) {
                    // console.log(key + " -> " + r[i].statii_tur[0][key]);
                    var statie = {nume_statie: r[i].statii_tur[0][key], nr_statie: key};
                    statii_tur.push(statie);
                }
            }
            for (var key in r[i].statii_retur[0]) {
                if (r[i].statii_retur[0].hasOwnProperty(key)) {
                    // console.log(key + " -> " + r[i].statii_tur[0][key]);
                    var statie = {nume_statie: r[i].statii_retur[0][key], nr_statie: key};
                    statii_retur.push(statie);
                }
            }
            var traseu = {
                nume:decodeHtmlEntity( r[i].title.rendered),
                numar: r[i].numar,
                nume_traseu: r[i].nume_traseu,
                tip_autovehicul: r[i].autovehicul[0].name,
                icon_autovehicul: r[i].autovehicul[0].icon,
                statii_tur: statii_tur,
                statii_retur: statii_retur
            }
            listaTraseeCautare.push(traseu);
        }
    }, function(e){
        console.log(e);
    });
}
exports.cauta = cauta;

function traseu(args) {
    if (!twoPaneLayout) {
        frames.topmost().navigate("traseu-page");
    }
    vmModule.mainViewModel.set("selectedItem", args.view.bindingContext);
}
exports.traseu = traseu;

