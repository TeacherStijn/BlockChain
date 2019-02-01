webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = "main {\r\n  padding: 2em;\r\n}\r\n\r\nh1 {\r\n  color: green;\r\n}\r\n\r\n.form-group {\r\n  width: 33%;\r\n  float: left;\r\n  /* border: dotted 1px gray;*/\r\n  padding: 1em;\r\n}\r\n\r\n#overzicht {\r\n  clear: left;\r\n  padding: 1em;\r\n}\r\n"

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<main>\n  <h1>BlockChain App</h1>\n  <div id=\"nodes\" class=\"form-group\">\n    <h2>Node registreren:</h2>\n    <!-- Onderstaand nog een regexp mask toevoegen -->\n      <label for=\"node\">IP adres / Hostname: </label>\n      <input disabled type=\"text\" id=\"node\" [(ngModel)]=\"node\" class=\"form-control\" placeholder=\"Ip adres of hostname\"/>\n     <br/>\n    <button disabled (click)=\"clickRegistreerNode()\" class=\"btn btn-success\">Nieuwe node</button><br/><br/>\n    <h2>Geregistreerde nodes:</h2>\n    <ul>\n      <li *ngFor=\"let node of nodes$ | async\">{{ node.node }}</li>\n    </ul>\n  </div>\n\n  <div id=\"transacties\" class=\"form-group\">\n    <h2>Transacties:</h2>\n    <ul>\n      <li *ngFor=\"let transactie of openTransacties$ | async\">{{ transactie.zender }} naar: {{ transactie.ontvanger }} data: {{ transactie.amount }}</li>\n    </ul>\n      <button *ngIf=\"!voegToeBlok\" (click)=\"voegToeBlok = !voegToeBlok\" class=\"btn btn-success\">Nieuwe transactie</button>\n      <div id=\"voegToe\" *ngIf=\"voegToeBlok\">\n        <label for=\"zender\">Zender:</label><input type=\"text\" id=\"zender\" [(ngModel)]=\"zender\" class=\"form-control\" /><br/>\n        <label for=\"ontvanger\">Ontvanger:</label><input type=\"text\" id=\"ontvanger\" [(ngModel)]=\"ontvanger\" class=\"form-control\" /><br/>\n        <label for=\"amount\">Amount:</label><input type=\"text\" id=\"amount\" [(ngModel)]=\"amount\" class=\"form-control\"/><br/>\n        <button (click)=\"clickNewTransaction()\"  class=\"btn btn-info\">Voeg toe</button><br/><br/>\n      </div>\n  </div>\n\n  <div id=\"blocks\" class=\"form-group\">\n    <h2>Blocks:</h2>\n    <button (click)=\"clickMineBlock()\" class=\"btn btn-success\">Mine block</button>\n  </div>\n\n  <div id=\"overzicht\">\n\n    <h2>Blockchain:</h2>\n    <button (click)=\"clickValidate()\" class=\"btn btn-success\">Validate chain</button>\n    <ul>\n      <li *ngFor=\"let block of blockChain$ | async\">\n        <span><strong>{{ block.index }} op datum: {{ block.timestamp }}</strong></span>\n        <details>\n          <summary>Transacties:</summary>\n          <span *ngFor=\"let transactie of block.transactions\">\n              {{ transactie.zender }} -> {{ transactie.ontvanger }} ({{ transactie.amount }})<br/>\n          </span>\n        </details>\n        <br/>\n      </li>\n    </ul>\n  </div>\n</main>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_services_blockservice__ = __webpack_require__("./src/shared/services/blockservice.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/map.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = /** @class */ (function () {
    function AppComponent(blockservice) {
        this.blockservice = blockservice;
        this.voegToeBlok = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.blockChain$ = this.blockservice.getChain();
        this.openTransacties$ = this.blockservice.getTransacties();
        this.nodes$ = this.blockservice.getNodes();
    };
    AppComponent.prototype.clickRegistreerNode = function () {
        this.blockservice.postNode(this.node);
    };
    AppComponent.prototype.clickNewTransaction = function () {
        // Forms gebruiken hier is netter (voor o.a. validatie)
        this.blockservice.postTransactie(this.zender, this.ontvanger, this.amount);
        this.voegToeBlok = false;
    };
    AppComponent.prototype.clickValidate = function () {
        this.blockservice.getValidate()
            .subscribe(function (result) { return console.log('Chain gevalideerd'); }, function (error) { return console.log('Validatie aanroep mislukt: ' + error); });
    };
    AppComponent.prototype.clickMineBlock = function () {
        console.log('We gaan een block minen...');
        this.blockservice.getMineBlock()
            .subscribe(function (result) {
            /*
            if (!result.status) {
              this.minedBlock = <Block>result;
            } else {
              console.log('Er zijn geen transacties');
            }*/
        }, function (error) { console.log('Ophalen van het geminede block mislukt'); });
    };
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__shared_services_blockservice__["a" /* BlockService */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_services_blockservice__ = __webpack_require__("./src/shared/services/blockservice.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_5__shared_services_blockservice__["a" /* BlockService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ "./src/shared/services/blockservice.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BlockService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BlockService = /** @class */ (function () {
    function BlockService(http) {
        this.http = http;
        this.port = '8001';
    }
    BlockService.prototype.getChain = function () {
        return this.http.get('http://localhost:' + this.port + '/chain');
    };
    BlockService.prototype.getTransacties = function () {
        return this.http.get('http://localhost:' + this.port + '/transacties');
    };
    BlockService.prototype.getNodes = function () {
        return this.http.get('http://localhost:' + this.port + '/nodes');
    };
    BlockService.prototype.postNode = function (node) {
        console.log(node + " wordt zo toegevoegd... ");
        this.http.post('http://localhost:' + this.port + '/nodes/registreer', {
            "node": node
        }).subscribe(function (result) { console.log("posten data gelukt met resultaat: " + JSON.stringify(result)); }, function (error) { console.log('iets met posten mis gegaan: ' + error.status); });
    };
    BlockService.prototype.postTransactie = function (zender, ontvanger, amount) {
        console.log("Transactie wordt zo toegevoegd...\n                " + zender + " en " + ontvanger + " en " + amount);
        this.http.post('http://localhost:' + this.port + '/transacties/nieuw', {
            "zender": zender,
            "ontvanger": ontvanger,
            "amount": amount
        }).subscribe(function (result) { console.log("posten data gelukt met resultaat: " + JSON.stringify(result)); }, function (error) { console.log('iets met posten mis gegaan: ' + error); });
    };
    BlockService.prototype.getValidate = function () {
        return this.http.get('http://localhost:' + this.port + '/nodes/structure');
    };
    BlockService.prototype.getMineBlock = function () {
        return this.http.get('http://localhost:' + this.port + '/minen');
    };
    BlockService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], BlockService);
    return BlockService;
}());



/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map