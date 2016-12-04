var observable = require("data/observable");
var observableArray = require("data/observable-array");


var ViewModelItem = (function () {
    function ViewModelItem(nume_traseu, numar, icon_autovehicul, content, statii_tur, statii_retur) {
        this.nume_traseu = nume_traseu;
        this.numar = numar;
        this.icon_autovehicul = icon_autovehicul;
        this.icon_autovehicul = tip_autovehicul;
        this.content = content;
        this.statii_tur = statii_tur;
        this.statii_retur = statii_retur;
    }
    return ViewModelItem;
}());
exports.ViewModelItem = ViewModelItem;

var items = new observableArray.ObservableArray([]);
var http = require("http");
    if(items.length > 0){
        items.length = 0;
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
            items.push(new ViewModelItem(traseu));
        }
    }, function(e){
        console.log(e);
    });

exports.mainViewModel = new observable.Observable();
exports.mainViewModel.set("items", items);
