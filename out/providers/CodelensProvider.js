"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodelensProvider = void 0;
const vscode = require("vscode");
class CodelensProvider {
    constructor(ip) {
        this.ip = ip;
    }
    async provideCodeLenses(document) {
        let topOfDocument = new vscode.Range(0, 0, 0, 0);
        let header = {
            title: 'Intent Manager at ' + this.ip + ' by NOKIA',
            command: 'nokia-intent-manager.openInBrowser'
        };
        let codeLens = new vscode.CodeLens(topOfDocument, header);
        return [codeLens];
    }
}
exports.CodelensProvider = CodelensProvider;
//# sourceMappingURL=CodelensProvider.js.map