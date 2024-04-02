"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentManagerProvider = exports.FileStat = void 0;
var vscode = require("vscode");
var FileStat = /** @class */ (function () {
    function FileStat(id, ctime, mtime, size, signed, version, content) {
        this.type = vscode.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.id = id;
        this.signed = signed;
        this.version = version;
        this.content = content;
        this.aligned = true;
        this.state = "";
        this.cstate = "";
    }
    return FileStat;
}());
exports.FileStat = FileStat;
var DECORATION_SIGNED = new vscode.FileDecoration('🔒', 'Signed', new vscode.ThemeColor('list.deemphasizedForeground'));
var DECORATION_UNSIGNED = new vscode.FileDecoration('', 'Unsigned', new vscode.ThemeColor('list.highlightForeground'));
var DECORATION_YANG = new vscode.FileDecoration('☯', 'YANG modules', new vscode.ThemeColor('list.warningForeground'));
var DECORATION_RESOURCE = new vscode.FileDecoration('❯', 'Resources', new vscode.ThemeColor('list.warningForeground'));
var DECORATION_VIEWS = new vscode.FileDecoration('⚯', 'Resources', new vscode.ThemeColor('list.warningForeground'));
var DECORATION_ALIGNED = new vscode.FileDecoration('✔', 'Aligned', new vscode.ThemeColor('list.highlightForeground'));
var DECORATION_MISALIGNED = new vscode.FileDecoration('✘', 'Misaligned', new vscode.ThemeColor('list.errorForeground'));
var DECORATION_NONACTIVE = new vscode.FileDecoration('✘', 'Inactive', new vscode.ThemeColor('list.deemphasizedForeground'));
var myStatusBarItem;
myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
myStatusBarItem.command = 'nokia-intent-manager.intentStatus';
/*
    Class implementing FileSystemProvider for Intent Manager
*/
var IntentManagerProvider = /** @class */ (function () {
    function IntentManagerProvider(nspAddr, username, secretStorage, port, timeout, fileIgnore) {
        this.intentCatalog = [];
        // --- manage file events
        this._emitter = new vscode.EventEmitter();
        this.onDidChangeFile = this._emitter.event;
        console.log("creating IntentManagerProvider(" + nspAddr + ")");
        this.nspAddr = nspAddr;
        this.username = username;
        this.password = "";
        this.nsp_version = "";
        this.timeout = timeout;
        this.fileIgnore = fileIgnore;
        this.secretStorage = secretStorage;
        // To be updated to only use standard ports.
        this.port = port;
        this.restport = port;
        if (port === "8545") {
            this.restport = "8547";
        }
        this.authToken = undefined;
        // Intents is a FileStat dictionary that is used to keep the file and folder info
        // including the file content.
        this.intents = {};
        this._eventEmiter = new vscode.EventEmitter();
        this.onDidChangeFileDecorations = this._eventEmiter.event;
    }
    IntentManagerProvider.prototype.dispose = function () {
        console.log("disposing IntentManagerProvider()");
        this._revokeAuthToken();
    };
    /*
        NSP authentication: Token management
    */
    IntentManagerProvider.prototype._getAuthToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("executing _getAuthToken()");
                        if (!this.authToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authToken];
                    case 1:
                        if (!(_b.sent())) {
                            this.authToken = undefined;
                        }
                        _b.label = 2;
                    case 2:
                        _a = this;
                        return [4 /*yield*/, this.secretStorage.get("nsp_im_password")];
                    case 3:
                        _a.password = _b.sent();
                        if (!this.authToken) {
                            this.authToken = new Promise(function (resolve, reject) {
                                console.log("No valid auth-token; getting a new one...");
                                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                                var fetch = require('node-fetch');
                                var base64 = require('base-64');
                                var timeout = new AbortController();
                                setTimeout(function () { return timeout.abort(); }, _this.timeout);
                                var url = "https://" + _this.nspAddr + "/rest-gateway/rest/api/v1/auth/token";
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Cache-Control': 'no-cache',
                                        'Authorization': 'Basic ' + base64.encode(_this.username + ":" + _this.password)
                                    },
                                    body: '{"grant_type": "client_credentials"}',
                                    signal: timeout.signal
                                }).then(function (response) {
                                    console.log("POST", url, response.status);
                                    if (!response.ok) {
                                        vscode.window.showErrorMessage("IM: NSP Auth Error");
                                        reject("Authentication Error!");
                                        throw new Error("Authentication Error!");
                                    }
                                    return response.json();
                                }).then(function (json) {
                                    console.log("new authToken:", json.access_token);
                                    resolve(json.access_token);
                                    // automatically revoke token after 10min
                                    setTimeout(function () { return _this._revokeAuthToken(); }, 600000);
                                }).catch(function (error) {
                                    console.error(error.message);
                                    // reject("Connection Error!");
                                    vscode.window.showWarningMessage("NSP is not reachable");
                                    resolve(undefined);
                                });
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    IntentManagerProvider.prototype._revokeAuthToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, fetch_1, base64, url_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.authToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authToken];
                    case 1:
                        token = _a.sent();
                        console.log("_revokeAuthToken(" + token + ")");
                        this.authToken = undefined;
                        fetch_1 = require('node-fetch');
                        base64 = require('base-64');
                        url_1 = "https://" + this.nspAddr + "/rest-gateway/rest/api/v1/auth/revocation";
                        fetch_1(url_1, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Basic ' + base64.encode(this.username + ":" + this.password)
                            },
                            body: 'token=' + token + '&token_type_hint=token'
                        })
                            .then(function (response) {
                            console.log("POST", url_1, response.status);
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IntentManagerProvider.prototype._callNSP = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var fetch, timeout, response;
            return __generator(this, function (_a) {
                fetch = require('node-fetch');
                timeout = new AbortController();
                setTimeout(function () { return timeout.abort(); }, this.timeout);
                options['signal'] = timeout.signal;
                response = new Promise(function (resolve, reject) {
                    fetch(url, options)
                        .then(function (response) { return resolve(response); })
                        .catch(function (error) {
                        console.log(error.message);
                        vscode.window.showWarningMessage("NSP is not reachable");
                        resolve(undefined);
                    });
                });
                return [2 /*return*/, response];
            });
        });
    };
    // In the current implementation, NSP OS version is needed to identify OpenSearch version to used in the headers. To investigate
    IntentManagerProvider.prototype.getNSPversion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, urlversion, response, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // get auth-token
                    return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        if (!(this.nsp_version === "")) return [3 /*break*/, 5];
                        console.log("Requesting NSP version");
                        urlversion = "https://" + this.nspAddr + "/internal/shared-app-banner-utils/rest/api/v1/appBannerUtils/release-version";
                        return [4 /*yield*/, this._callNSP(urlversion, {
                                method: "GET",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Getting NSP release failed');
                        }
                        console.log(response);
                        return [4 /*yield*/, response.json()];
                    case 4:
                        ret = _a.sent();
                        this.nsp_version = ret["response"]["data"]["nspOSVersion"];
                        vscode.window.showInformationMessage("NSP version: " + this.nsp_version);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            _createIntentFile

        Description:
            Creates a new resource, module or view file in your Intent-type.
            Called when adding a new empty file in the workspace under resources, yang or views.
    */
    IntentManagerProvider.prototype._createIntentFile = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var body, intent, method, url, isview, viewdata, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {};
                        if (name.split("/").length < 3)
                            throw vscode.FileSystemError.NoPermissions("Not allowed to create file in this directory");
                        intent = name.split("/")[2];
                        method = 'PUT';
                        url = 'https://' + this.nspAddr + ':' + this.port + '/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=' + intent.replace("_v", ",");
                        isview = false;
                        viewdata = "{}";
                        if (name.includes("intent-type-resources")) { // Generate URL and load intent-type content for resource update
                            if (this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"].hasOwnProperty("resource")) {
                                this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["resource"].push({ "name": decodeURIComponent(name.split("/").pop()), "value": data });
                            }
                            else {
                                this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["resource"] = [{ "name": decodeURIComponent(name.split("/").pop()), "value": data }];
                            }
                            body = this.intents["im:/intent-types/" + intent].intentContent;
                        }
                        else if (name.includes("yang-modules")) { // Generate URL and load intent-type content for Yang model update
                            this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["module"].push({ "name": decodeURIComponent(name.split("/").pop()), "yang-content": "module example-system {\n       yang-version 1.1;\n       namespace \"urn:example:system\";\n       prefix \"sys\";\n\n       organization \"Example Inc.\";\n       contact \"joe@example.com\";\n       description\n         \"The module for entities implementing the Example system.\";\n\n       revision 2007-06-09 {\n         description \"Initial revision.\";\n       }\n\n       container system {\n         leaf host-name {\n           type string;\n           description\n             \"Hostname for this system.\";\n         }\n\n         leaf-list domain-search {\n           type string;\n           description\n             \"List of domain names to search.\";\n         }\n\n         container login {\n           leaf message {\n             type string;\n             description\n               \"Message given at start of login session.\";\n           }\n           list user {\n             key \"name\";\n             leaf name {\n               type string;\n             }\n             leaf full-name {\n               type string;\n             }\n             leaf class {\n               type string;\n             }\n           }\n         }\n       }\n     }" });
                            body = this.intents["im:/intent-types/" + intent].intentContent;
                        }
                        else if (name.includes("views")) { // Handle view creation
                            if (name.includes(".viewConfig")) {
                                name = name.replace(".viewConfig", "");
                            }
                            if (name.includes(".schemaForm")) {
                                vscode.window.showErrorMessage("You cannot upload schemaForm, only viewConfig");
                                throw vscode.FileSystemError.Unavailable('You cannot upload schemaForm, only viewConfig');
                            }
                            if (this.intents.hasOwnProperty(name + ".viewConfig") || this.intents.hasOwnProperty(name + ".schemaForm")) {
                                vscode.window.showErrorMessage("View Exists!");
                                throw vscode.FileSystemError.Unavailable('View Exists!');
                            }
                            if (data.length !== 0) {
                                viewdata = data;
                            }
                            isview = true;
                            url = "https://" + this.nspAddr + ":" + this.restport + "/intent-manager/proxy/v1/restconf/data/nsp-intent-type-config-store:intent-type-config/intent-type-configs=" + intent.replace("_v", ",");
                            method = "PATCH";
                            body = {
                                "nsp-intent-type-config-store:intent-type-configs": [
                                    { "views": [
                                            {
                                                "name": decodeURIComponent(name.split("/").pop()),
                                                "viewconfig": viewdata
                                            }
                                        ]
                                    }
                                ]
                            };
                        }
                        else {
                            throw vscode.FileSystemError.NoPermissions("Not allowed to create file in this directory");
                        }
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(body)
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(body);
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Resource creation failed!');
                        }
                        if (isview) {
                            this.intents[name + ".viewConfig"] = new FileStat(name.split("/").pop() + ".viewConfig", Date.now(), Date.now(), 0, false, +intent.split("_v")[1], viewdata);
                            this.intents[name + ".schemaForm"] = new FileStat(name.split("/").pop() + ".schemaForm", Date.now(), Date.now(), 0, false, +intent.split("_v")[1], "");
                        }
                        else {
                            this.intents[name] = new FileStat(name, Date.now(), Date.now(), 0, false, +intent.split("_v")[1], "");
                        }
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        vscode.window.showInformationMessage("Succesfully created resource");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            _updateIntentType

        Description:
            Called when saving files in your intent-type.
            Due to API limitations, this method generates the full intent-type payload for updating a single file.
    */
    IntentManagerProvider.prototype._updateIntentType = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _, body, intent, url, resource_name, method, i, i, meta_local, meta_server, _i, _a, att, _b, _c, rname, _d, _e, rname, token, response, jsonResponse, show;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _ = require('lodash');
                        console.log("Updating intent.");
                        if (this.intents[name].signed) {
                            vscode.window.showErrorMessage("Unable to save SIGNED intent (read only).");
                            return [2 /*return*/];
                        }
                        body = {};
                        intent = name.split("/")[2];
                        url = 'https://' + this.nspAddr + ':' + this.port + '/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=' + intent.replace("_v", ",");
                        resource_name = name.split("/").pop();
                        method = 'PUT';
                        if (name.includes("intent-type-resources")) { // Generate URL and load intent-type content for resource update
                            for (i = 0; i < this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["resource"].length; i++) {
                                if (this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["resource"][i]["name"] === decodeURIComponent(resource_name)) {
                                    console.log("Resource found: " + resource_name);
                                    this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["resource"][i]["value"] = data;
                                }
                            }
                            body = JSON.stringify(this.intents["im:/intent-types/" + intent].intentContent);
                            vscode.window.showInformationMessage("Updating " + intent + " resource: " + decodeURIComponent(resource_name));
                        }
                        else if (name.includes("yang-modules")) { // Generate URL and load intent-type content for yang module update
                            for (i = 0; i < this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["module"].length; i++) {
                                if (this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["module"][i]["name"] === decodeURIComponent(resource_name)) {
                                    console.log("Resource found: " + resource_name);
                                    this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["module"][i]["yang-content"] = data;
                                }
                            }
                            body = JSON.stringify(this.intents["im:/intent-types/" + intent].intentContent);
                            vscode.window.showInformationMessage("Updating " + intent + " module: " + decodeURIComponent(resource_name));
                        }
                        else if (name.includes("script-content.js")) { // Update intent-type string content
                            this.intents["im:/intent-types/" + intent].intentContent["ibn-administration:intent-type"]["script-content"] = data;
                            body = JSON.stringify(this.intents["im:/intent-types/" + intent].intentContent);
                            vscode.window.showInformationMessage("Updating " + intent + " script-content.js");
                        }
                        else if (name.includes("views")) { // Update views
                            if ((resource_name === null || resource_name === void 0 ? void 0 : resource_name.includes("schemaForm")) || (resource_name === null || resource_name === void 0 ? void 0 : resource_name.includes("settings"))) {
                                vscode.window.showErrorMessage("Not allowed to save " + resource_name + ". Read-only file.");
                                throw vscode.FileSystemError.NoPermissions("Not allowed to save resource.");
                            }
                            url = 'https://' + this.nspAddr + ':' + this.restport + '/intent-manager/proxy/v1/restconf/data/nsp-intent-type-config-store:intent-type-config/intent-type-configs=' + intent.replace("_v", ",");
                            method = 'PATCH';
                            body = '{"nsp-intent-type-config-store:intent-type-configs":[{"views":[{"name":"' + decodeURIComponent(resource_name === null || resource_name === void 0 ? void 0 : resource_name.split(".")[0]) + '","viewconfig":"' + data.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"}]}]}';
                            vscode.window.showInformationMessage("Updating " + decodeURIComponent(resource_name) + " view in " + intent);
                        }
                        else if (name.includes("meta-info.json")) { // Update mate-info attributes
                            meta_local = JSON.parse(data);
                            meta_server = JSON.parse(this.intents[name].content);
                            for (_i = 0, _a = Object.keys(meta_local); _i < _a.length; _i++) {
                                att = _a[_i];
                                if (!_.isEqual(meta_local[att], meta_server[att])) {
                                    vscode.window.showInformationMessage("Updating " + intent + " config: " + att);
                                }
                            }
                            ;
                            url = 'https://' + this.nspAddr + ':' + this.port + '/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=' + intent.replace("_v", ",");
                            //UPDATING CONFIG REQUIRES INCLUDING KEYS(NAME;ID), MODULES AND RESOURCES.
                            meta_local["name"] = intent.split("_v")[0];
                            meta_local["version"] = +intent.split("_v")[1];
                            meta_local["script-content"] = this.intents[name.replace("meta-info.json", "script-content.js")].content;
                            meta_local["resource"] = [];
                            console.log(this.intents[name.replace("meta-info.json", "intent-type-resources")].content);
                            for (_b = 0, _c = JSON.parse(this.intents[name.replace("meta-info.json", "intent-type-resources")].content); _b < _c.length; _b++) {
                                rname = _c[_b];
                                meta_local["resource"].push({ "name": rname, "value": this.intents[name.replace("meta-info.json", "intent-type-resources") + "/" + encodeURIComponent(rname)].content });
                            }
                            meta_local["module"] = [];
                            console.log(this.intents[name.replace("meta-info.json", "yang-modules")].content);
                            for (_d = 0, _e = JSON.parse(this.intents[name.replace("meta-info.json", "yang-modules")].content); _d < _e.length; _d++) {
                                rname = _e[_d];
                                meta_local["module"].push({ "name": rname, "yang-content": this.intents[name.replace("meta-info.json", "yang-modules") + "/" + encodeURIComponent(rname)].content });
                            }
                            body = JSON.stringify({ "ibn-administration:intent-type": meta_local });
                            method = 'PUT';
                        }
                        console.log(body);
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _f.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _f.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: body
                            })];
                    case 3:
                        response = _f.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(body);
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!(!response.ok)) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        jsonResponse = _f.sent();
                        show = "Update Intent-type failed.";
                        if (Object.keys(jsonResponse).includes("ietf-restconf:errors"))
                            show = jsonResponse["ietf-restconf:errors"]["error"][0]["error-message"];
                        throw vscode.FileSystemError.Unavailable(show);
                    case 5:
                        this.intents[name].content = data;
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 6:
                        _f.sent();
                        vscode.window.showInformationMessage("Succesfully uploaded");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            _updateIntent

        Description:
            Called when saving an intent instance.
    */
    IntentManagerProvider.prototype._updateIntent = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var token, method, intent, intenttype, url, response, jsonResponse, show;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // get auth-token
                    return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        method = "PUT";
                        intent = name.split("/").pop();
                        intenttype = name.split("/")[2].split("_v")[0];
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn/intent=" + intent + "," + intenttype + "/intent-specific-data";
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: "{\"ibn:intent-specific-data\":" + data + "}"
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!!response.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        jsonResponse = _a.sent();
                        show = "Update Intent failed.";
                        if (Object.keys(jsonResponse).includes("ietf-restconf:errors"))
                            show = jsonResponse["ietf-restconf:errors"]["error"][0]["error-message"];
                        throw vscode.FileSystemError.Unavailable(show);
                    case 5:
                        this.intents[name].content = data;
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 6:
                        _a.sent();
                        vscode.window.showInformationMessage("Succesfully uploaded");
                        this._eventEmiter.fire(vscode.Uri.parse(name));
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            _updateIntent

        Description:
            Called when creating a new intent instance.
            As this extension is not yang-aware, it is recommended that the user creates new instances locally and pasting into the appropriate intent folder.
    */
    IntentManagerProvider.prototype._createIntent = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var token, method, intent, intenttype, intentversion, url, body, response, jsonResponse, show;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // get auth-token
                    return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        method = "POST";
                        intent = name.split("/").pop();
                        intenttype = name.split("/")[2].split("_v")[0];
                        intentversion = name.split("/")[2].split("_v")[1];
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn";
                        body = {};
                        body["ibn:intent"] = {};
                        body["ibn:intent"]["ibn:intent-specific-data"] = JSON.parse(data);
                        body["ibn:intent"]["target"] = intent;
                        body["ibn:intent"]["intent-type"] = intenttype;
                        body["ibn:intent"]["intent-type-version"] = intentversion;
                        body["ibn:intent"]["required-network-state"] = "active";
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(body)
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(JSON.stringify(body));
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!!response.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        jsonResponse = _a.sent();
                        show = "Intent creation failed.";
                        if (Object.keys(jsonResponse).includes("ietf-restconf:errors"))
                            show = jsonResponse["ietf-restconf:errors"]["error"][0]["error-message"];
                        throw vscode.FileSystemError.Unavailable(show);
                    case 5:
                        this.intents[name] = new FileStat(encodeURIComponent(name), Date.now(), Date.now(), 0, false, +intentversion, data);
                        this.intents[name].aligned = true;
                        this.intents[name].state = "active";
                        this.intents[name].cstate = "";
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 6:
                        _a.sent();
                        vscode.window.showInformationMessage("Succesfully uploaded");
                        this._eventEmiter.fire(vscode.Uri.parse(name));
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            _renderJSON

        Description:
            Generate web content for audit report from the json payload returned by IM.
    */
    IntentManagerProvider.prototype._renderJSON = function (obj, spaces) {
        'use strict';
        var keys = [], retValue = "";
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                retValue += "<div class='tree'>" + spaces + key;
                retValue += this._renderJSON(obj[key], spaces + "&nbsp&nbsp");
                retValue += "</div>";
            }
            else {
                retValue += "<div class='tree'><b>" + spaces + key + "</b> = <em>" + obj[key] + "</em></div>";
            }
            keys.push(key);
        }
        return retValue;
    };
    /*
        Method:
            _getWebviewContent

        Description:
            Generate webView for audit report based on the audit response from IM.
    */
    IntentManagerProvider.prototype._getWebviewContent = function (intent, intenttype, result, panel) {
        return __awaiter(this, void 0, void 0, function () {
            var extURI, onDiskPath, catGifSrc, YAML, html;
            return __generator(this, function (_a) {
                extURI = this.extContext.extensionUri;
                onDiskPath = vscode.Uri.joinPath(extURI, 'media', 'noklogo_black.svg');
                catGifSrc = panel.webview.asWebviewUri(onDiskPath);
                YAML = require('yaml');
                html = "<!doctype html><html><head><title>Audit Report</title><meta name=\"description\" content=\"Audit report\"><meta name=\"keywords\" content=\"Audit report\"><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@100;300&display=swap\" rel=\"stylesheet\"><style>*{ box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box;}body{ font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased; background-color: #F8F8F8;}h2{ font-family: 'Poppins', sans-serif; text-align: left; font-size: 14px; letter-spacing: 1px; color: #555; margin: 20px 3%; width: 94%;}h3{ font-family: 'Poppins', sans-serif; text-align: left; font-size: 12px; letter-spacing: 1px; color: #555; margin: 20px 3%; width: 94%;}.publish { height: 100px; width: 100%; overflow-y: auto; }.nokia { display: block; margin-left: auto; margin-right: auto; margin-top: 100px; width: 30%;}.icon { width: 20px; margin-right: 10px;}.accordion > input[type=\"checkbox\"] { position: absolute; left: -100vw;}.accordion .content { overflow-y: hidden; height: 0; transition: height 0.3s ease;}.accordion > input[type=\"checkbox\"]:checked ~ .content { height: auto; overflow: visible;}.accordion label { display: block;}/* Styling*/body { font: 16px/1.5em \"Overpass\", \"Open Sans\", Helvetica, sans-serif; color: #333; font-weight: 300;}.accordion { margin-bottom: 1em; margin-left: 3%; width: 94%;}.accordion > input[type=\"checkbox\"]:checked ~ .content { background: #F0F0F0 ; padding: 15px; border-bottom: 1px solid #9E9E9E;}.accordion .handle { margin: 0; font-size: 15px; line-height: 1.2em; width: 100%;}.accordion label { color: #555; cursor: pointer; font-weight: normal; padding: 15px; background: #F8F8F8; border-bottom: 1px solid #9E9E9E;}.accordion label:hover,.accordion label:focus { background: #BEBEBE; color: #001135;font-weight: 500;}/* Demo purposes only*/*,*:before,*:after { box-sizing: border-box;}body { padding: 40px;}a { color: #06c;}p { margin: 0 0 1em; font-size: 13px;}h1 { margin: 0 0 1.5em; font-weight: 600; font-size: 1.5em;}.accordion { max-width: 65em;}.accordion p:last-child { margin-bottom: 0;}</style></head><body><td><img class=\"nokia\" src=\"" + catGifSrc + "\"></td>";
                html = html + "<h2>Intent-type: " + intenttype + "</h2><h2>Intent: " + intent + "</h2><h2>Audit result:</h2><h3> <p>" + this._renderJSON(result, "") + "</p></h3>";
                html = html + "</body></html>";
                return [2 /*return*/, html];
            });
        });
    };
    /*
        Method:
            _getWebviewContentLogs

        Description:
            Generate webView for OpenSearch Logs coming from a particular intent instance. This is a beta functionality.
    */
    IntentManagerProvider.prototype._getWebviewContentLogs = function (intent, intenttype, result, panel) {
        return __awaiter(this, void 0, void 0, function () {
            var html, _i, result_1, hit, loginfo, d;
            return __generator(this, function (_a) {
                html = "<!doctype html><html> <head> <title>Intent Logs</title> <meta name=\"description\" content=\"Intent Logs report\"> <meta name=\"keywords\" content=\"Intent Logs report\"> <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"> <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin> <link href='https://fonts.googleapis.com/css?family=Space Mono' rel='stylesheet'><style> .console { position: absolute; font-family: 'Space Mono'; width: 90%; height: 90%; box-sizing: border-box; margin-top: 2%; margin-left: 2%;}.console header { border-top-left-radius: 15px; border-top-right-radius: 15px; background-color: #555; height: 45px; line-height: 45px; text-align: center; color: #DDD;}.console .consolebody { border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; box-sizing: border-box; padding: 20px; height: calc(100% - 40px); overflow: scroll; overflow-wrap: break-word; background-color: #000; color: #63de00;}.console .consolebody p { font-size: 12px; margin: 0px; padding: 0px; margin-bottom: 5px;}</style> </head> <body> <div class=\"console\"> <header> <p>" + intenttype + " " + intent + " logs </p> </header> <div class=\"consolebody\">";
                if (result.length === 0) {
                    html = html + "<p>> No logs available in the system </p>";
                }
                console.log(result.length);
                result.sort(function (a, b) { return new Date(b['_source']['@datetime']) - new Date(a['_source']['@datetime']); });
                for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                    hit = result_1[_i];
                    loginfo = JSON.parse(hit['_source'].log);
                    d = new Date(loginfo['date']);
                    if ((loginfo['message']) && (loginfo['message'].length !== 0)) {
                        console.log(loginfo['message']);
                        console.log(hit);
                        html = html + "<p>>[" + d.toISOString() + "] : " + loginfo['message'] + " </p>";
                    }
                }
                html = html + "</div></div></body></html>";
                return [2 /*return*/, html];
            });
        });
    };
    /*
        Method:
            getCustomeState

        Description:
            Maps custom states to the formal name shown by IM UI.
    */
    IntentManagerProvider.prototype.getCustomeState = function (documentPath) {
        var state = this.intents[documentPath].state;
        var cstate = this.intents[documentPath].cstate;
        if (state === "active") {
            return "Active";
        }
        else if (state === "suspend") {
            return "Suspended";
        }
        else if (state === "delete") {
            return "Not Present";
        }
        else if ((state === "custom") && (cstate === "saved")) {
            return "Saved";
        }
        else if ((state === "custom") && (cstate === "planned")) {
            return "Planned";
        }
        else if ((state === "custom") && (cstate === "deployed")) {
            return "Deployed";
        }
        return "";
    };
    IntentManagerProvider.prototype.shareStatusBarItem = function () {
        return myStatusBarItem;
    };
    IntentManagerProvider.prototype.exposeIntentStatus = function (documentPath) {
        return this.intents[documentPath].state;
    };
    /*
        Method:
            updateIntentNetworkStatus

        Description:
            Updates the network status for a given intent instance.
    */
    IntentManagerProvider.prototype.updateIntentNetworkStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, editor, document, documentPath, intent, intenttype, stats, currentState, _i, stats_1, s;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = [];
                        editor = vscode.window.activeTextEditor;
                        document = editor.document;
                        documentPath = document.uri.toString();
                        intent = documentPath.split("/").pop();
                        intenttype = documentPath.split("/")[2].split("_v")[0];
                        stats = ["Active", "Suspended", "Not Present", "Saved", "Planned", "Deployed"];
                        currentState = this.getCustomeState(documentPath);
                        for (_i = 0, stats_1 = stats; _i < stats_1.length; _i++) {
                            s = stats_1[_i];
                            if (s.toLowerCase() === currentState.toLowerCase())
                                items.push({ label: s, description: "✔" });
                            else
                                items.push({ label: s, description: "" });
                        }
                        return [4 /*yield*/, vscode.window.showQuickPick(items).then(function (selection) { return __awaiter(_this, void 0, void 0, function () {
                                var payload, url, method, token, response, payloadjs;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!selection) {
                                                return [2 /*return*/];
                                            }
                                            selection.label.toLowerCase();
                                            payload = "";
                                            switch (selection.label) {
                                                case "Active":
                                                    payload = "{\"required-network-state\":\"active\"}";
                                                    break;
                                                case "Suspended":
                                                    payload = "{\"required-network-state\":\"suspend\"}";
                                                    break;
                                                case "Not Present":
                                                    payload = "{\"required-network-state\":\"delete\"}";
                                                    break;
                                                case "Saved":
                                                    payload = "{\"required-network-state\":\"custom\",\"custom-required-network-state\":\"saved\"}";
                                                    break;
                                                case "Planned":
                                                    payload = "{\"required-network-state\":\"custom\",\"custom-required-network-state\":\"planned\"}";
                                                    break;
                                                case "Deployed":
                                                    payload = "{\"required-network-state\":\"custom\",\"custom-required-network-state\":\"deployed\"}";
                                                    break;
                                                default:
                                                    break;
                                            }
                                            url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn/intent=" + intent + "," + intenttype;
                                            method = "PATCH";
                                            return [4 /*yield*/, this._getAuthToken()];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.authToken];
                                        case 2:
                                            token = _a.sent();
                                            if (!token) {
                                                throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                                            }
                                            return [4 /*yield*/, this._callNSP(url, {
                                                    method: method,
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json',
                                                        'Authorization': 'Bearer ' + token
                                                    },
                                                    body: "{\"ibn:intent\":" + payload + "}"
                                                })];
                                        case 3:
                                            response = _a.sent();
                                            if (!response) {
                                                throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                                            }
                                            console.log(response);
                                            console.log(method, url, response.status);
                                            if (!response.ok) {
                                                throw vscode.FileSystemError.Unavailable('Intent creation failed!');
                                            }
                                            payloadjs = JSON.parse(payload);
                                            this.intents[documentPath].state = payloadjs["required-network-state"];
                                            if (payloadjs["required-network-state"] === "custom")
                                                this.intents[documentPath].cstate = payloadjs["custom-required-network-state"];
                                            else
                                                this.intents[documentPath].cstate = "";
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, vscode.commands.executeCommand("nokia-intent-manager.updateStatusBar")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 3:
                        _a.sent();
                        this._eventEmiter.fire(document.uri);
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            writeIntentType

        Description:
            Called when changes are detected in intent-type files (create/update).
    */
    IntentManagerProvider.prototype.writeIntentType = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("writeIntent(" + name + ")");
                        if (!(name in this.intents)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._updateIntentType(name, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (data.length === 0) {
                            data = "";
                        }
                        return [4 /*yield*/, this._createIntentFile(name, data)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            writeIntent

        Description:
            Called when changes are detected in intent-type files (create from copy).
            Empty files are not allowed (i.e. you cannot create an empty intent).
    */
    IntentManagerProvider.prototype.writeIntent = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var decname;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("writeIntent(" + name + ")");
                        decname = decodeURIComponent(name);
                        if (!(decname in this.intents)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._updateIntent(decname, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (data.length === 0) {
                            vscode.window.showErrorMessage("Cannot create empty intent");
                            throw vscode.FileSystemError.NoPermissions("Cannot create empty intent");
                        }
                        return [4 /*yield*/, this._createIntent(decname, data)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            uploadLocalIntent

        Description:
            Uploads a local intent-type to the remote NSP IM.
            This is only allowed from the meta-info.json at this stage.
            As meta-info does not contain intent-type name nor version, if the user does not
            include it manually, the system will request it from the user (input form).
    */
    IntentManagerProvider.prototype.uploadLocalIntent = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, resources, modules, views, filepath, editor, document, data, meta, intentnameversion, token, url, response, script, _i, modules_1, m, module, _a, resources_1, m, resource, del, _b, del_1, d, body, method, jsonResponse, show, _c, views_1, v, token_1, viewcontent, vbody, jsonResponse, show;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        fs = require('fs');
                        console.log("Uploading Local Intent " + uri);
                        console.log(vscode.workspace.getWorkspaceFolder(uri));
                        resources = [];
                        modules = [];
                        views = [];
                        filepath = uri.toString().replace("%20", " ").replace("file://", "");
                        // Raising exceptions if some resources are not available (missing files or folders)
                        if (!fs.existsSync(filepath.replace("meta-info.json", "script-content.js"))) {
                            vscode.window.showErrorMessage("Script not found");
                            throw vscode.FileSystemError.FileNotFound("Script not found");
                        }
                        if (!fs.existsSync(filepath.replace("meta-info.json", "intent-type-resources"))) {
                            vscode.window.showErrorMessage("Resources folder not found");
                            throw vscode.FileSystemError.FileNotFound("Resources folder not found");
                        }
                        fs.readdir(filepath.replace("meta-info.json", "intent-type-resources"), function (err, files) {
                            files.forEach(function (file) {
                                resources.push(file);
                            });
                        });
                        if (!fs.existsSync(filepath.replace("meta-info.json", "yang-modules"))) {
                            vscode.window.showErrorMessage("Modules folder not found");
                            throw vscode.FileSystemError.FileNotFound("Modules folder not found");
                        }
                        fs.readdir(filepath.replace("meta-info.json", "yang-modules"), function (err, files) {
                            files.forEach(function (file) {
                                modules.push(file);
                            });
                        });
                        if (fs.existsSync(filepath.replace("meta-info.json", "views"))) { // We allow upload of local intents with no Views
                            fs.readdir(filepath.replace("meta-info.json", "views"), function (err, files) {
                                files.forEach(function (file) {
                                    views.push(file);
                                });
                            });
                        }
                        else {
                            vscode.window.showWarningMessage("Views not found.");
                        }
                        console.log(resources);
                        console.log(modules);
                        editor = vscode.window.activeTextEditor;
                        document = editor.document;
                        data = document.getText();
                        meta = JSON.parse(data);
                        if (!(!("intent-type" in meta) || !("version" in meta))) return [3 /*break*/, 2];
                        return [4 /*yield*/, vscode.window.showInputBox({
                                placeHolder: "{lowercasename}_v{version}",
                                title: "Intent-type name or version not found in meta. Please insert.",
                                validateInput: function (text) {
                                    var regex = /^([a-z_]+_v+[1-9])$/g;
                                    return regex.test(text) ? null : '{lowercasename}_v{version}';
                                }
                            })];
                    case 1:
                        intentnameversion = _d.sent();
                        meta['intent-type'] = intentnameversion === null || intentnameversion === void 0 ? void 0 : intentnameversion.split("_v")[0];
                        meta['version'] = parseInt(intentnameversion === null || intentnameversion === void 0 ? void 0 : intentnameversion.split("_v")[1]);
                        _d.label = 2;
                    case 2: 
                    // get auth-token
                    return [4 /*yield*/, this._getAuthToken()];
                    case 3:
                        // get auth-token
                        _d.sent();
                        return [4 /*yield*/, this.authToken];
                    case 4:
                        token = _d.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=" + meta['intent-type'] + "," + meta.version;
                        return [4 /*yield*/, this._callNSP(url, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-cache',
                                    'Authorization': 'Bearer ' + token
                                }
                            })];
                    case 5:
                        response = _d.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        // Check if the intent-type already exists in NSP
                        console.log("GET", url, response.status);
                        meta["script-content"] = "";
                        script = fs.readFileSync(filepath.replace("meta-info.json", "script-content.js"), { encoding: 'utf8', flag: 'r' });
                        meta["script-content"] = script;
                        meta["module"] = [];
                        for (_i = 0, modules_1 = modules; _i < modules_1.length; _i++) {
                            m = modules_1[_i];
                            module = fs.readFileSync(filepath.replace("meta-info.json", "yang-modules") + "/" + m, { encoding: 'utf8', flag: 'r' });
                            meta["module"].push({ "name": m, "yang-content": module });
                        }
                        meta["resource"] = [];
                        for (_a = 0, resources_1 = resources; _a < resources_1.length; _a++) {
                            m = resources_1[_a];
                            resource = fs.readFileSync(filepath.replace("meta-info.json", "intent-type-resources") + "/" + m, { encoding: 'utf8', flag: 'r' });
                            meta["resource"].push({ "name": m, "value": resource });
                        }
                        meta["name"] = meta['intent-type'];
                        del = ["intent-type", "date", "category", "custom-field", "instance-depends-on-category", "resourceDirectory", "support-nested-type-in-es", "supports-network-state-suspend", "default-version", "author", "skip-device-connectivity-check", "return-config-as-json", "build", "composite", "support-aggregated-request", "notify-intent-instance-events", "supported-hardware-types"];
                        for (_b = 0, del_1 = del; _b < del_1.length; _b++) {
                            d = del_1[_b];
                            delete meta[d];
                        }
                        body = { "ibn-administration:intent-type": meta };
                        method = "POST";
                        if (response.ok) {
                            console.log("Intent already exist, updating");
                            vscode.window.showInformationMessage("Updating existing Intent-Type");
                            method = "PUT";
                        }
                        else {
                            console.log("New Intent");
                            vscode.window.showInformationMessage("Creating new Intent-Type");
                            url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn-administration:ibn-administration/intent-type-catalog";
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(body)
                            })];
                    case 6:
                        response = _d.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(method, url, response.status);
                        if (!!response.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, response.json()];
                    case 7:
                        jsonResponse = _d.sent();
                        show = "Upload local Intent-type failed.";
                        if (Object.keys(jsonResponse).includes("ietf-restconf:errors"))
                            show = jsonResponse["ietf-restconf:errors"]["error"][0]["error-message"];
                        vscode.window.showErrorMessage(show);
                        throw vscode.FileSystemError.Unavailable(show);
                    case 8:
                        _c = 0, views_1 = views;
                        _d.label = 9;
                    case 9:
                        if (!(_c < views_1.length)) return [3 /*break*/, 14];
                        v = views_1[_c];
                        if (!v.endsWith("viewConfig")) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.authToken];
                    case 10:
                        token_1 = _d.sent();
                        url = 'https://' + this.nspAddr + ':' + this.restport + '/intent-manager/proxy/v1/restconf/data/nsp-intent-type-config-store:intent-type-config/intent-type-configs=' + meta['name'] + "," + meta['version'];
                        viewcontent = fs.readFileSync(filepath.replace("meta-info.json", "views") + "/" + v, { encoding: 'utf8', flag: 'r' });
                        method = 'PATCH';
                        vbody = '{"nsp-intent-type-config-store:intent-type-configs":[{"views":[{"name":"' + v.split(".")[0] + '","viewconfig":"' + viewcontent.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"}]}]}';
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token_1
                                },
                                body: vbody
                            })];
                    case 11:
                        response = _d.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(method, url, response.status);
                        if (!!response.ok) return [3 /*break*/, 13];
                        return [4 /*yield*/, response.json()];
                    case 12:
                        jsonResponse = _d.sent();
                        show = "Upload view failed.";
                        if (Object.keys(jsonResponse).includes("ietf-restconf:errors"))
                            show = jsonResponse["ietf-restconf:errors"]["error"][0]["error-message"];
                        vscode.window.showErrorMessage(show);
                        _d.label = 13;
                    case 13:
                        _c++;
                        return [3 /*break*/, 9];
                    case 14:
                        vscode.window.showInformationMessage("Succesfully uploaded");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            createIntentFromScratch

        Description:
            Creates intent-type by only providing a name. The intent is generated using a basic template.
    */
    IntentManagerProvider.prototype.createIntentFromScratch = function (name, uris) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, modules, _i, uris_1, uri, token, url, response, meta, _a, modules_2, m, module, del, _b, del_2, d, body, method, json, show;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fs = require('fs');
                        console.log("Creating new intent " + name);
                        modules = [];
                        if (typeof uris !== "undefined") {
                            for (_i = 0, uris_1 = uris; _i < uris_1.length; _i++) {
                                uri = uris_1[_i];
                                modules.push(uri.toString().replace("%20", " ").replace("file://", ""));
                            }
                        }
                        ;
                        console.log(modules);
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _c.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _c.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=" + name + ",1";
                        return [4 /*yield*/, this._callNSP(url, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-cache',
                                    'Authorization': 'Bearer ' + token
                                }
                            })];
                    case 3:
                        response = _c.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        // Checking if the intent-type already exists
                        console.log("GET", url, response.status);
                        if (response.ok) {
                            vscode.window.showInformationMessage("Intent name already exist, cannot create");
                            throw vscode.FileSystemError.FileExists("Intent name already exist, cannot create");
                        }
                        meta = {
                            "ibn-administration:intent-type": {
                                "date": "-",
                                "support-nested-type-in-es": false,
                                "author": "Nokia IM vsCode",
                                "target-component": [
                                    {
                                        "i18n-text": "Device Name",
                                        "function-name": "suggestDeviceNames",
                                        "pattern-error-message": "",
                                        "name": "deviceName",
                                        "value-type": "STRING",
                                        "order": 1
                                    }
                                ],
                                "mapping-engine": "js-scripted",
                                "label": [
                                    "vsCode Intent"
                                ],
                                "priority": 50,
                                "version": 1,
                                "build": "-",
                                "lifecycle-state": "released",
                                "name": name,
                                "live-state-retrieval": false
                            }
                        };
                        meta["ibn-administration:intent-type"]["script-content"] = "\nvar RuntimeException = Java.type('java.lang.RuntimeException');\n\nvar prefixToNsMap = {\n  \"ibn\" : \"http://www.nokia.com/management-solutions/ibn\",\n  \"nc\" : \"urn:ietf:params:xml:ns:netconf:base:1.0\",\n  \"device-manager\" : \"http://www.nokia.com/management-solutions/anv\",\n};\n\nvar nsToModule = {\n  \"http://www.nokia.com/management-solutions/anv-device-holders\" : \"anv-device-holders\"\n};\n\nfunction synchronize(input) {\n  var result = synchronizeResultFactory.createSynchronizeResult();\n  // Code to synchronize goes here\n  \n  result.setSuccess(true);\n  return result;\n}\n\nfunction audit(input) {\n  var report = auditFactory.createAuditReport(null, null);\n  // Code to audit goes here\n\n  return report\n}\n\nfunction validate(syncInput) {\n  var contextualErrorJsonObj = {};\n  var intentConfig = syncInput.getJsonIntentConfiguration();\n  \n  // Code to validation here. Add errors to contextualErrorJsonObj.\n  // contextualErrorJsonObj[\"attribute\"] = \"Attribute must be set\";\n  \n  if (Object.keys(contextualErrorJsonObj).length !== 0) {\n        utilityService.throwContextErrorException(contextualErrorJsonObj);\n  }\n}\n\n";
                        meta["ibn-administration:intent-type"]["module"] = [];
                        if (typeof uris !== "undefined") {
                            for (_a = 0, modules_2 = modules; _a < modules_2.length; _a++) {
                                m = modules_2[_a];
                                module = fs.readFileSync(m, { encoding: 'utf8', flag: 'r' });
                                meta["ibn-administration:intent-type"]["module"].push({ "name": m.split("/").pop(), "yang-content": module });
                            }
                        }
                        else
                            meta["ibn-administration:intent-type"]["module"].push({ "name": name + ".yang", "yang-content": "module " + name + " {\n  namespace \"http://www.nokia.com/management-solutions/" + name + "\";\n  prefix \"" + name + "\";\n\n  organization        \"NOKIA Corp\";\n  contact \"\";\n  description \"\";\n  revision \"2023-03-07\" {\n    description\n      \"Initial revision.\";\n  }\n  grouping configuration-details {\n    container " + name + "{\n\n    }\n  }\n   \n  uses " + name + ":configuration-details;\n}\n" });
                        meta["ibn-administration:intent-type"]["resource"] = [];
                        meta["ibn-administration:intent-type"]["resource"].push({ "name": name + ".js", "value": "" });
                        del = ["intent-type", "date", "category", "custom-field", "instance-depends-on-category", "resourceDirectory", "support-nested-type-in-es", "supports-network-state-suspend", "default-version", "author", "skip-device-connectivity-check", "return-config-as-json", "build", "composite", "support-aggregated-request", "notify-intent-instance-events", "supported-hardware-types"];
                        for (_b = 0, del_2 = del; _b < del_2.length; _b++) {
                            d = del_2[_b];
                            delete meta["ibn-administration:intent-type"][d];
                        }
                        body = meta;
                        method = "POST";
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn-administration:ibn-administration/intent-type-catalog";
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(body)
                            })];
                    case 4:
                        response = _c.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(method, url, response.status);
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, response.json()];
                    case 5:
                        json = _c.sent();
                        show = "Upload local Intent-type failed.";
                        if (Object.keys(json).includes("ietf-restconf:errors"))
                            show = json["ietf-restconf:errors"]["error"][0]["error-message"];
                        vscode.window.showErrorMessage(show);
                        throw vscode.FileSystemError.Unavailable('Local Intent upload failed!');
                    case 6: return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 7:
                        _c.sent();
                        vscode.window.showInformationMessage("Succesfully created");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            openIntentCreation

        Description:
            Opens the intent-type view to allow user creating new intent instances.
    */
    IntentManagerProvider.prototype.openIntentCreation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var editor, document_1, documentPath, intent, url;
            return __generator(this, function (_a) {
                editor = vscode.window.activeTextEditor;
                if (editor) {
                    document_1 = editor.document;
                    documentPath = document_1.uri.toString();
                    intent = documentPath.split("/")[2];
                    url = "https://" + this.nspAddr + ":" + this.restport + "/intent-manager/intentTypes/" + intent.replace("_v", "/") + "/intents/createIntent";
                    vscode.env.openExternal(vscode.Uri.parse(url));
                }
                return [2 /*return*/];
            });
        });
    };
    /*
        Method:
            deleteIntentFile

        Description:
            Deletes an intent-type resource file.
            Meta-info or script are not allowed.
    */
    IntentManagerProvider.prototype.deleteIntentFile = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var intent, resource_name, url, method, body, view, viewspath, allviews, _i, allviews_1, v, token, response, schmUri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        intent = name.toString().split("/")[2];
                        resource_name = name.toString().split("/").pop();
                        url = "";
                        method = "DELETE";
                        body = {};
                        if (name.includes("intent-type-resources")) {
                            url = "https://" + this.nspAddr + ":" + this.restport + "/mdt/rest/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=" + intent.replace("_v", ",") + "/resource=" + resource_name;
                        }
                        else if (name.includes("yang-modules")) {
                            url = "https://" + this.nspAddr + ":" + this.restport + "/mdt/rest/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=" + intent.replace("_v", ",") + "/module=" + resource_name;
                        }
                        else if (name.includes("views")) {
                            url = "https://" + this.nspAddr + ":" + this.restport + "/intent-manager/proxy/v1/restconf/data/nsp-intent-type-config-store:intent-type-config/intent-type-configs=" + intent.replace("_v", ",");
                            method = "PUT";
                            body = {
                                "nsp-intent-type-config-store:intent-type-configs": [
                                    {
                                        "intent-type": intent.split("_v")[0],
                                        "version": parseInt(intent.split("_v").pop()),
                                        "yang-entry-point": "",
                                        "views": []
                                    }
                                ]
                            };
                            view = resource_name === null || resource_name === void 0 ? void 0 : resource_name.split(".")[0];
                            viewspath = name.replace("/" + resource_name, "");
                            allviews = JSON.parse(this.intents[viewspath].content);
                            for (_i = 0, allviews_1 = allviews; _i < allviews_1.length; _i++) {
                                v = allviews_1[_i];
                                if (!v.includes(decodeURIComponent(view)) && !v.includes("schemaForm") && !v.includes("settings")) {
                                    body["nsp-intent-type-config-store:intent-type-configs"][0]["views"].push({ "name": v.split(".")[0], "viewconfig": this.intents[viewspath + "/" + encodeURIComponent(v)].content });
                                }
                            }
                            body["nsp-intent-type-config-store:intent-type-configs"][0]["yang-entry-point"] = JSON.parse(this.intents[viewspath + "/view.settings"].content)["yang-entry-point"];
                        }
                        else {
                            throw vscode.FileSystemError.Unavailable("Unrecognize file: " + name);
                        }
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: JSON.stringify(body)
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(body);
                        console.log(method, url, response.status);
                        //Removing the resource from the extension registry.
                        console.log("Deleting registry for: " + name);
                        delete this.intents[name];
                        if (name.includes("views")) {
                            schmUri = name.replace("viewConfig", "schemaForm");
                            delete this.intents[schmUri];
                        }
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        vscode.window.showInformationMessage("Resource " + resource_name + " from intent " + intent + " intent successfully deleted");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            deleteIntentVersion

        Description:
            Deletes an intent-type (version) from the system
    */
    IntentManagerProvider.prototype.deleteIntentVersion = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var intent, url, method, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        intent = name.toString().split("/")[2];
                        url = "https://" + this.nspAddr + ":" + this.restport + "/mdt/rest/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=" + intent.replace("_v", ",");
                        method = "DELETE";
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Intent deletion failed!');
                        }
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        vscode.window.showInformationMessage("Intent " + intent + " intent successfully deleted");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            deleteIntent

        Description:
            Deletes an intent instance from the system
    */
    IntentManagerProvider.prototype.deleteIntent = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var intent, intenttype, intentversion, url, method, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        intent = name.split("/").pop();
                        intenttype = name.split("/")[2].split("_v")[0];
                        intentversion = name.split("/")[2].split("_v")[1];
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn/intent=" + intent + "," + intenttype;
                        method = "DELETE";
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/yang-data+json',
                                    'Accept': 'application/yang-data+json',
                                    'Authorization': 'Bearer ' + token
                                }
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Intent deletion failed!');
                        }
                        delete this.intents[name];
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        vscode.window.showInformationMessage("Intent " + intent + " intent successfully deleted");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            createNewIntentVersion

        Description:
            Creates a new intent-type version for the selected intent-type.
    */
    IntentManagerProvider.prototype.createNewIntentVersion = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var intent, url, method, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        intent = name.toString().split("/")[2];
                        url = "https://" + this.nspAddr + ":" + this.restport + "/mdt/rest/ibn/save/" + intent.replace("_v", "/");
                        method = "POST";
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: "{}"
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Intent creation failed!');
                        }
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        vscode.window.showInformationMessage("New " + intent.split("_v")[0] + " intent version created");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            cloneIntent

        Description:
            Clones an intent-type. The user is requested to provide a new valid name.
    */
    IntentManagerProvider.prototype.cloneIntent = function (name, newName) {
        return __awaiter(this, void 0, void 0, function () {
            var intent, url, method, token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Object.keys(this.intents).includes("im:/intent-types/" + newName + "_v1")) {
                            throw vscode.FileSystemError.FileExists("The intent " + newName + " already exists");
                        }
                        intent = name.toString().split("/")[2];
                        url = "https://" + this.nspAddr + ":" + this.restport + "/mdt/rest/ibn/save/" + intent.replace("_v", "/") + "?newIntentTypeName=" + newName;
                        method = "POST";
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                body: "{}"
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Intent creation failed!');
                        }
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        vscode.window.showInformationMessage("New " + intent.split("_v")[0] + " intent version created");
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            getLogs

        Description:
            Get the logs exposed by log/logger classes from OpenSearch for a particular intent instance (beta).
    */
    IntentManagerProvider.prototype.getLogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var editor, document, documentPath, intent, intenttype, url, method, token, osdversion, headers, response, json, panel, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        editor = vscode.window.activeTextEditor;
                        document = editor.document;
                        documentPath = decodeURIComponent(document.uri.toString());
                        intent = documentPath.split("/").pop();
                        intenttype = documentPath.split("/")[2].split("_v")[0];
                        url = "https://" + this.nspAddr + "/logviewer/api/console/proxy?path=nsp-mdt-logs-*/_search&method=GET";
                        method = 'POST';
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _b.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _b.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        osdversion = '2.6.0';
                        if (this.nsp_version.includes("23.11")) {
                            osdversion = '2.10.0';
                        }
                        headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Osd-Version': osdversion,
                            'Authorization': 'Bearer ' + token
                        };
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: headers,
                                body: '{"query": {"match_phrase": {"log": "\\"target\\":\\"' + intent + '\\""}},"sort": {"@datetime": "desc"},"size": 20}'
                            })];
                    case 3:
                        response = _b.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log('{"query": {"match_phrase": {"log": "\\"target\\":\\"' + intent + '\\""}},"sort": {"@datetime": "desc"},"size": 20}');
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            vscode.window.showErrorMessage('Error while getting logs');
                            throw vscode.FileSystemError.Unavailable('Error while getting logs');
                        }
                        return [4 /*yield*/, response.json()];
                    case 4:
                        json = _b.sent();
                        panel = vscode.window.createWebviewPanel('intentLogs', intent + ' Logs', vscode.ViewColumn.Two);
                        _a = panel.webview;
                        return [4 /*yield*/, this._getWebviewContentLogs(intent, intenttype, json["hits"]["hits"], panel)];
                    case 5:
                        _a.html = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            audit

        Description:
            Audits the intent instance and pulls the result to update the intent decoration. It allows to show misalignment details.
    */
    IntentManagerProvider.prototype.audit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var editor, document, documentPath, intent, intenttype, url, method, token, headers, response, json, path;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editor = vscode.window.activeTextEditor;
                        document = editor.document;
                        documentPath = document.uri.toString();
                        intent = documentPath.split("/").pop();
                        intenttype = documentPath.split("/")[2].split("_v")[0];
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn/intent=" + intent + "," + intenttype + "/audit";
                        method = 'POST';
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Authorization': 'Bearer ' + token
                        };
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: headers,
                                body: ""
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            vscode.window.showErrorMessage('Error while auditing');
                            throw vscode.FileSystemError.Unavailable('Error while auditing');
                        }
                        return [4 /*yield*/, response.json()];
                    case 4:
                        json = _a.sent();
                        path = require('path');
                        if (Object.keys(json["ibn:output"]["audit-report"]).includes("misaligned-attribute") || Object.keys(json["ibn:output"]["audit-report"]).includes("misaligned-object")) {
                            vscode.window.showWarningMessage("Intent Misaligned", "Details", "Cancel").then(function (selectedItem) { return __awaiter(_this, void 0, void 0, function () {
                                var panel, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!('Details' === selectedItem)) return [3 /*break*/, 2];
                                            //Beta
                                            console.log(path.join(this.extContext.extensionPath, 'media'));
                                            panel = vscode.window.createWebviewPanel('auditReport', intent + ' Audit', vscode.ViewColumn.Two, { localResourceRoots: [vscode.Uri.file(path.join(this.extContext.extensionPath, 'media'))] });
                                            _a = panel.webview;
                                            return [4 /*yield*/, this._getWebviewContent(intent, intenttype, json["ibn:output"]["audit-report"], panel)];
                                        case 1:
                                            _a.html = _b.sent();
                                            _b.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); });
                            ;
                            this.intents[documentPath].aligned = false;
                        }
                        else {
                            vscode.window.showInformationMessage("Intent Aligned");
                            this.intents[documentPath].aligned = true;
                        }
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 5:
                        _a.sent();
                        this._eventEmiter.fire(document.uri);
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            sync

        Description:
            Triggers the intent-type synchronize method for the particular intent instance.
    */
    IntentManagerProvider.prototype.sync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var editor, document, documentPath, intent, intenttype, url, method, token, headers, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editor = vscode.window.activeTextEditor;
                        document = editor.document;
                        documentPath = document.uri.toString();
                        intent = documentPath.split("/").pop();
                        intenttype = documentPath.split("/")[2].split("_v")[0];
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn/intent=" + intent + "," + intenttype + "/synchronize";
                        method = 'POST';
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Authorization': 'Bearer ' + token
                        };
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: headers,
                                body: ""
                            })];
                    case 3:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            vscode.window.showErrorMessage('Error during Synchronize');
                            throw vscode.FileSystemError.Unavailable('Error during Synchronize');
                        }
                        vscode.window.showInformationMessage("Intent Synchronized");
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 4:
                        _a.sent();
                        this._eventEmiter.fire(document.uri);
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            sync

        Description:
            Opens NSP IM web for an intent-type.
    */
    IntentManagerProvider.prototype.openInBrowser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var editor, document_2, documentPath, intent, url;
            return __generator(this, function (_a) {
                editor = vscode.window.activeTextEditor;
                if (editor) {
                    document_2 = editor.document;
                    documentPath = document_2.uri.toString();
                    intent = documentPath.split("/")[2];
                    url = "https://" + this.nspAddr + ":" + this.restport + "/intent-manager/intentTypes/" + intent.replace("_v", "/") + "/intents";
                    vscode.env.openExternal(vscode.Uri.parse(url));
                }
                return [2 /*return*/];
            });
        });
    };
    // --- implement FileDecorator    
    IntentManagerProvider.prototype.provideFileDecoration = function (uri) {
        if (uri.toString().startsWith('im:/intent-types/')) {
            if (this.intents[uri.toString()].signed)
                return DECORATION_SIGNED;
            else if (uri.toString().endsWith("yang-modules"))
                return DECORATION_YANG;
            else if (uri.toString().endsWith("intent-type-resources"))
                return DECORATION_RESOURCE;
            else if (uri.toString().endsWith("views"))
                return DECORATION_VIEWS;
            return DECORATION_UNSIGNED;
        }
        else if (uri.toString().startsWith('im:/intents/')) {
            var path = uri.toString();
            if (path.split("/").length === 3)
                return;
            if (this.intents[path].aligned)
                return DECORATION_ALIGNED;
            else
                return DECORATION_MISALIGNED;
        }
    };
    /*
        Method:
            readDirectory

        Description:
            This is the main method in charge of pulling the data from IM and keeping it updated in vsCode.
            It gets the full list of intent-types and instances, while loads the intent-type content when opening an intent-type.
            Is is called any time the user opens a folder, plus it is triggered when updating different content to keep the vscode
            content updated and in sync with the remote NSP.
    */
    IntentManagerProvider.prototype.readDirectory = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            function checkLabels(obj, ignoreLabels) {
                console.log(ignoreLabels);
                var filteredArray = ignoreLabels.label.filter(function (value) { return obj.includes(value); });
                ;
                if (filteredArray.length == 0) {
                    //console.log("Returning "+ignoreLabels.name);
                    return ignoreLabels;
                }
            }
            var httpreq, url, viewsurl, getviews, method, body, json, token, headers, response, result, filteredList, dlist, _i, dlist_1, d, modules, _a, _b, module, views, respviews, viewsjson, token, headers, _c, _d, view, viewconfigURI, schemaformURI, viewsettingsURI, resources, _e, _f, resource, intentTypeURI, del, _g, del_3, d, files, _h, files_1, f, _j, _k, intent;
            var _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        console.log("executing readDirectory(" + uri + ")");
                        httpreq = true;
                        console.log("workspace folder");
                        console.log(vscode.workspace.getWorkspaceFolder(uri));
                        url = undefined;
                        viewsurl = undefined;
                        getviews = false;
                        method = 'GET';
                        body = "";
                        if (uri.toString() === "im:/") { // Return two main folders. Nothing to be loaded from IM
                            return [2 /*return*/, [['intent-types', vscode.FileType.Directory], ['intents', vscode.FileType.Directory]]];
                        }
                        else if ((uri.toString() === "im:/intent-types") || (uri.toString() === "im:/intents")) { // Return full list of intent-types when opening intent types or intents folders
                            url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn-administration:ibn-administration/intent-type-catalog?fields=intent-type(name;date;version;lifecycle-state;mapping-engine;label)";
                        }
                        else if ((uri.toString().startsWith("im:/intent-types/")) && (uri.toString().split("/").length === 3)) { // Load full list of intent type scripts and resources
                            url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn-administration:ibn-administration/intent-type-catalog/intent-type=" + uri.toString().split("/").pop().replace("_v", ",");
                            getviews = true;
                            viewsurl = "https://" + this.nspAddr + ":" + this.restport + "/intent-manager/proxy/v1/restconf/data/nsp-intent-type-config-store:intent-type-config/intent-type-configs=" + uri.toString().split("/").pop().replace("_v", ",");
                        }
                        else if ((uri.toString().startsWith("im:/intents/")) && (uri.toString().split("/").length === 3)) { // Load full list of intent instances for an intent-type
                            url = "https://" + this.nspAddr + ":" + this.port + "/restconf/operations/ibn:search-intents";
                            method = 'POST';
                            body = "{\"ibn:input\": {\"filter\": {\"intent-type-list\": [{\"intent-type\": \"" + ((_l = uri.toString().split("/").pop()) === null || _l === void 0 ? void 0 : _l.split("_v")[0]) + "\",\"intent-type-version\": \"" + ((_m = uri.toString().split("/").pop()) === null || _m === void 0 ? void 0 : _m.split("_v")[1]) + "\"}]},\"page-number\": 0,\"page-size\": 100}}";
                        }
                        else if ((uri.toString().startsWith("im:/intent-types/"))) {
                            httpreq = false;
                        }
                        else {
                            throw vscode.FileSystemError.FileNotADirectory('Unknown resouce!');
                        }
                        if (!httpreq) return [3 /*break*/, 8];
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // get auth-token
                        _q.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        token = _q.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        // Getting the NSP version when reconnecting. Used to check OpenSearch client API version
                        this.getNSPversion();
                        headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Authorization': 'Bearer ' + token
                        };
                        response = void 0;
                        if (!(method === 'GET')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._callNSP(url, {
                                method: method,
                                headers: headers
                            })];
                    case 3:
                        response = _q.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this._callNSP(url, {
                            method: method,
                            headers: headers,
                            body: body
                        })];
                    case 5:
                        response = _q.sent();
                        _q.label = 6;
                    case 6:
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log(method, url, response.status);
                        if (!response.ok) {
                            throw vscode.FileSystemError.Unavailable('Cannot get intent list');
                        }
                        return [4 /*yield*/, response.json()];
                    case 7:
                        json = _q.sent();
                        _q.label = 8;
                    case 8:
                        result = [];
                        if (!((uri.toString() === "im:/intent-types") || (uri.toString() === "im:/intents"))) return [3 /*break*/, 9];
                        filteredList = json["ibn-administration:intent-type-catalog"]["intent-type"].filter(checkLabels.bind(this, this.fileIgnore));
                        result = (filteredList !== null && filteredList !== void 0 ? filteredList : []).map(function (entry) { return [entry.name + "_v" + entry.version, vscode.FileType.Directory]; });
                        return [3 /*break*/, 16];
                    case 9:
                        if (!((uri.toString().startsWith("im:/intent-types/")) && (uri.toString().split("/").length === 3))) return [3 /*break*/, 15];
                        // adding Yang modules
                        result.push(["yang-modules", vscode.FileType.Directory]);
                        this.intents[uri.toString()] = new FileStat("", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify(json["ibn-administration:intent-type"], null, "\t"));
                        this.intents[uri.toString()].intentContent = JSON.parse(JSON.stringify(json));
                        dlist = ["default-version", "supports-health", "skip-device-connectivity-check", "support-aggregated-request"];
                        for (_i = 0, dlist_1 = dlist; _i < dlist_1.length; _i++) {
                            d = dlist_1[_i];
                            delete this.intents[uri.toString()].intentContent["ibn-administration:intent-type"][d];
                        }
                        modules = [];
                        for (_a = 0, _b = json["ibn-administration:intent-type"]["module"]; _a < _b.length; _a++) {
                            module = _b[_a];
                            this.intents[vscode.Uri.parse(uri.toString() + "/yang-modules/" + module.name).toString()] = new FileStat(module.name, Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, module["yang-content"]);
                            modules.push(module.name);
                        }
                        ;
                        this.intents[uri.toString() + "/yang-modules"] = new FileStat("yang-modules", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify(modules));
                        //adding views
                        result.push(["views", vscode.FileType.Directory]);
                        views = [];
                        respviews = void 0;
                        viewsjson = void 0;
                        return [4 /*yield*/, this.authToken];
                    case 10:
                        token = _q.sent();
                        headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Authorization': 'Bearer ' + token
                        };
                        return [4 /*yield*/, this._callNSP(viewsurl, {
                                method: method,
                                headers: headers
                            })];
                    case 11:
                        respviews = _q.sent();
                        if (!respviews) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(respviews);
                        console.log(method, viewsurl, respviews.status);
                        if (!!respviews.ok) return [3 /*break*/, 12];
                        console.log("Error retrieveing views.");
                        vscode.window.showWarningMessage("Unable to load views for intent-type: " + uri.toString().split("/").pop().replace("_v", ","));
                        return [3 /*break*/, 14];
                    case 12: return [4 /*yield*/, respviews.json()];
                    case 13:
                        viewsjson = _q.sent();
                        if (viewsjson["nsp-intent-type-config-store:intent-type-configs"][0].hasOwnProperty("views")) {
                            for (_c = 0, _d = viewsjson["nsp-intent-type-config-store:intent-type-configs"][0]["views"]; _c < _d.length; _c++) {
                                view = _d[_c];
                                viewconfigURI = vscode.Uri.parse(uri.toString() + "/views/" + encodeURIComponent(view.name) + ".viewConfig").toString();
                                schemaformURI = vscode.Uri.parse(uri.toString() + "/views/" + encodeURIComponent(view.name) + ".schemaForm").toString();
                                console.info('Adding viewconfig ', viewconfigURI);
                                console.info('Adding schemaform ', schemaformURI);
                                this.intents[viewconfigURI] = new FileStat(view.name + ".viewConfig", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, view.viewconfig);
                                this.intents[schemaformURI] = new FileStat(view.name + ".schemaForm", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify(JSON.parse(view.schemaform), null, 2));
                                views.push(view.name + ".viewConfig");
                                views.push(view.name + ".schemaForm");
                            }
                        }
                        viewsettingsURI = vscode.Uri.parse(uri.toString() + "/views/" + "view.settings").toString();
                        this.intents[viewsettingsURI] = new FileStat("view.settings", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify({ "yang-entry-point": viewsjson["nsp-intent-type-config-store:intent-type-configs"][0]["yang-entry-point"] }));
                        views.push("view.settings");
                        _q.label = 14;
                    case 14:
                        this.intents[uri.toString() + "/views"] = new FileStat("views", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify(views));
                        // adding resources
                        result.push(["intent-type-resources", vscode.FileType.Directory]);
                        resources = [];
                        if (json["ibn-administration:intent-type"].hasOwnProperty("resource")) {
                            for (_e = 0, _f = json["ibn-administration:intent-type"]["resource"]; _e < _f.length; _e++) {
                                resource = _f[_e];
                                intentTypeURI = vscode.Uri.parse(uri.toString() + "/intent-type-resources/" + encodeURIComponent(resource.name)).toString();
                                console.warn('intent-type URI', intentTypeURI);
                                this.intents[intentTypeURI] = new FileStat(resource.name, Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, resource.value);
                                resources.push(resource.name);
                            }
                        }
                        ;
                        this.intents[uri.toString() + "/intent-type-resources"] = new FileStat("intent-type-resources", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify(resources));
                        result.push(["script-content.js", vscode.FileType.File]);
                        this.intents[uri.toString() + "/script-content.js"] = new FileStat("script-content.js", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, json["ibn-administration:intent-type"]["script-content"]);
                        result.push(["meta-info.json", vscode.FileType.File]);
                        del = ["script-content", "module", "resource", "date", "support-nested-type-in-es", "supports-network-state-suspend", "default-version", "author", "version", "skip-device-connectivity-check", "return-config-as-json", "build", "composite", "name", "support-aggregated-request", "notify-intent-instance-events"];
                        for (_g = 0, del_3 = del; _g < del_3.length; _g++) {
                            d = del_3[_g];
                            delete json["ibn-administration:intent-type"][d];
                        }
                        this.intents[uri.toString() + "/meta-info.json"] = new FileStat("meta-info.json", Date.parse(json["ibn-administration:intent-type"].date), Date.parse(json["ibn-administration:intent-type"].date), 0, false, json["ibn-administration:intent-type"].version, JSON.stringify(json["ibn-administration:intent-type"], null, "\t"));
                        return [3 /*break*/, 16];
                    case 15:
                        if (uri.toString().startsWith("im:/intent-types/")) {
                            console.log(this.intents[uri.toString()]);
                            files = JSON.parse(this.intents[uri.toString()].content);
                            console.log(files);
                            for (_h = 0, files_1 = files; _h < files_1.length; _h++) {
                                f = files_1[_h];
                                result.push([f, vscode.FileType.File]);
                            }
                        }
                        else if ((uri.toString().startsWith("im:/intents/")) && (uri.toString().split("/").length === 3)) {
                            console.log("loading intents");
                            console.log(json);
                            if (Object.keys(json["ibn:output"]["intents"]).includes("intent")) {
                                console.log("hay intents");
                                for (_j = 0, _k = json["ibn:output"]["intents"]["intent"]; _j < _k.length; _j++) {
                                    intent = _k[_j];
                                    this.intents[uri.toString() + "/" + encodeURIComponent(intent.target)] = new FileStat(intent.target, Date.now(), Date.now(), 0, false, +((_o = uri.toString().split("/").pop()) === null || _o === void 0 ? void 0 : _o.split("_v")[1]), "");
                                    this.intents[uri.toString() + "/" + encodeURIComponent(intent.target)].aligned = intent.aligned === "true";
                                    this.intents[uri.toString() + "/" + encodeURIComponent(intent.target)].state = intent["required-network-state"];
                                    if (intent["required-network-state"] === "custom")
                                        this.intents[uri.toString() + "/" + encodeURIComponent(intent.target)].cstate = intent["custom-required-network-state"];
                                    else
                                        this.intents[uri.toString() + "/" + encodeURIComponent(intent.target)].cstate = "";
                                }
                                result = ((_p = json["ibn:output"]["intents"]["intent"]) !== null && _p !== void 0 ? _p : []).map(function (entry) { return [entry.target, vscode.FileType.File]; });
                            }
                        }
                        _q.label = 16;
                    case 16:
                        console.log(result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /*
        Method:
            stat

        Description:
            vsCode internal method called any time a file or folder is open to get the details.
            Here we include decorations and file permissions (i.e. read-only), depending of the file type.
    */
    IntentManagerProvider.prototype.stat = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var key, readpath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("executing stat(" + uri + ")");
                        console.log("executing stat(" + uri.toString() + ")");
                        if (!((uri.toString() === 'im:/') || (uri.toString() === 'im:/intent-types') || (uri.toString() === 'im:/intents') || ((uri.toString().startsWith("im:/intents/")) && (uri.toString().split("/").length === 3)) || ((uri.toString().startsWith("im:/intent-types/")) && (["intent-type-resources", "yang-modules", "views"].includes(uri.toString().split("/").pop()))))) return [3 /*break*/, 3];
                        // Check if NSP is connected
                        return [4 /*yield*/, this._getAuthToken()];
                    case 1:
                        // Check if NSP is connected
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 2:
                        if (!(_a.sent())) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        return [2 /*return*/, {
                                type: vscode.FileType.Directory,
                                ctime: 0,
                                mtime: Date.now(),
                                size: 0,
                                permissions: vscode.FilePermission.Readonly
                            }];
                    case 3:
                        if (!((uri.toString().startsWith("im:/intent-types/")) && (uri.toString().split("/").length === 3))) return [3 /*break*/, 4];
                        return [2 /*return*/, {
                                type: vscode.FileType.Directory,
                                ctime: 0,
                                mtime: Date.now(),
                                size: 0
                            }];
                    case 4:
                        if (!((uri.toString().startsWith('im:/intent-types/')) || (uri.toString().startsWith('im:/intents/')))) return [3 /*break*/, 7];
                        key = uri.toString();
                        if (!!(key in this.intents)) return [3 /*break*/, 6];
                        readpath = uri.toString().split("/").slice(0, 3).join("/");
                        return [4 /*yield*/, this.readDirectory(vscode.Uri.parse(readpath))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (key in this.intents) {
                            if (key.includes("schemaForm") || key.includes("settings"))
                                this.intents[key].permissions = vscode.FilePermission.Readonly;
                            console.log("this is where we return: " + key);
                            return [2 /*return*/, this.intents[key]];
                        }
                        else if (key + ".viewConfig" in this.intents) {
                            console.log("this is where we return 2: " + key + ".viewConfig");
                            return [2 /*return*/, this.intents[key + ".viewConfig"]];
                        }
                        console.warn('unknown intent/intent-type');
                        throw vscode.FileSystemError.FileNotFound('Unknown intent/intent-type!');
                    case 7:
                        console.warn('unknown resource');
                        throw vscode.FileSystemError.FileNotFound('Unknown resouce!');
                }
            });
        });
    };
    /*
        Method:
            readFile

        Description:
            vsCode internal method called any time a file is open to visualize the content.
            The method returns the content of the file that gets visualized in the editor.
    */
    IntentManagerProvider.prototype.readFile = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var intentid, intenttype, token, headers, url, response, json, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("executing readFile(" + uri + ")");
                        if (!uri.toString().startsWith("im:/intent-types/")) return [3 /*break*/, 6];
                        if (!!Object.keys(this.intents).includes(uri.toString())) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.readDirectory(vscode.Uri.parse(uri.toString().split("/").slice(0, 3).join("/")))];
                    case 1:
                        _a.sent();
                        if (!!Object.keys(this.intents).includes(uri.toString())) return [3 /*break*/, 5];
                        if (!uri.toString().includes("views")) return [3 /*break*/, 4];
                        return [4 /*yield*/, vscode.commands.executeCommand('workbench.action.closeActiveEditor')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, vscode.commands.executeCommand("workbench.files.action.refreshFilesExplorer")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: throw vscode.FileSystemError.FileNotADirectory('Unknown resouces!');
                    case 5: return [2 /*return*/, Buffer.from(this.intents[uri.toString()].content)];
                    case 6:
                        if (!uri.toString().startsWith("im:/intents/")) return [3 /*break*/, 13];
                        if (!!Object.keys(this.intents).includes(uri.toString())) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.readDirectory(vscode.Uri.parse(uri.toString().split("/").slice(0, 3).join("/")))];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        intentid = uri.toString().split("/").pop();
                        intenttype = uri.toString().split("/")[2].split("_v")[0];
                        console.log(intentid);
                        console.log(intenttype);
                        // get auth-token
                        return [4 /*yield*/, this._getAuthToken()];
                    case 9:
                        // get auth-token
                        _a.sent();
                        return [4 /*yield*/, this.authToken];
                    case 10:
                        token = _a.sent();
                        if (!token) {
                            throw vscode.FileSystemError.Unavailable('NSP is not reachable');
                        }
                        headers = {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Authorization': 'Bearer ' + token
                        };
                        url = "https://" + this.nspAddr + ":" + this.port + "/restconf/data/ibn:ibn/intent=" + intentid + "," + intenttype + "?content=config";
                        return [4 /*yield*/, this._callNSP(url, {
                                method: 'GET',
                                headers: headers
                            })];
                    case 11:
                        response = _a.sent();
                        if (!response) {
                            throw vscode.FileSystemError.Unavailable("Lost connection to NSP");
                        }
                        console.log(response);
                        console.log('GET', url, response.status);
                        if (!response.ok) {
                            vscode.window.showErrorMessage('Cannot get intent content');
                            throw vscode.FileSystemError.Unavailable('Cannot get intent content');
                        }
                        return [4 /*yield*/, response.json()];
                    case 12:
                        json = _a.sent();
                        path = uri.toString();
                        this.intents[path].content = JSON.stringify(json['ibn:intent']['intent-specific-data'], null, '\t');
                        return [2 /*return*/, Buffer.from(JSON.stringify(json['ibn:intent']['intent-specific-data'], null, '\t'))];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            writeFile

        Description:
            vsCode internal method called any time a file get updated or created. The function contains the file path plus the content.
            Here we redirect to the appropriate depending on the file type (inten-type resources, intent instances).
    */
    IntentManagerProvider.prototype.writeFile = function (uri, content, options) {
        return __awaiter(this, void 0, void 0, function () {
            var key, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("executing writeFile(" + uri + ")");
                        if (!uri.toString().startsWith('im:/intent-types/')) return [3 /*break*/, 2];
                        key = uri.toString();
                        return [4 /*yield*/, this.writeIntentType(key, content.toString())];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!uri.toString().startsWith('im:/intents/')) return [3 /*break*/, 4];
                        key = uri.toString();
                        return [4 /*yield*/, this.writeIntent(key, content.toString())];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw vscode.FileSystemError.FileNotFound('Unknown resource-type!');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /*
        Method:
            rename

        Description:
            We are blocking renaming files in the extension.
    */
    IntentManagerProvider.prototype.rename = function (oldUri, newUri, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw vscode.FileSystemError.NoPermissions('Unsupported operation!');
            });
        });
    };
    /*
        Method:
            delete

        Description:
            vsCode internal method called any time a file or folder gets deleted in the file system.
            Here we redirect to the appropriate functions, depending on the selected file or folder
            (intent-type, intent-type resources, intent instances).
    */
    IntentManagerProvider.prototype.delete = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("executing delete(" + uri + ")");
                if (uri.toString().includes("intent-type-resources/") || uri.toString().includes("yang-modules/") || uri.toString().includes("views/")) {
                    this.deleteIntentFile(uri.toString());
                }
                else if ((uri.toString().split("/").length === 3) && (uri.toString().startsWith("im:/intent-types/"))) {
                    this.deleteIntentVersion(uri.toString());
                }
                else if ((uri.toString().split("/").length === 4) && (uri.toString().startsWith("im:/intents/"))) {
                    this.deleteIntent(uri.toString());
                }
                else {
                    throw vscode.FileSystemError.NoPermissions('Permission denied!');
                }
                return [2 /*return*/];
            });
        });
    };
    /*
        Method:
            createDirectory

        Description:
            Not supported in this file system extension. New folders are created when creating new intent-types.
    */
    IntentManagerProvider.prototype.createDirectory = function (uri) {
        console.log("executing createDirectory(" + uri + ")");
        throw vscode.FileSystemError.NoPermissions('Unknown resource!');
    };
    IntentManagerProvider.prototype.watch = function (_resource) {
        // ignore, fires for all changes...
        return new vscode.Disposable(function () { });
    };
    IntentManagerProvider.scheme = 'im';
    return IntentManagerProvider;
}());
exports.IntentManagerProvider = IntentManagerProvider;
