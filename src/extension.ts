import * as vscode from 'vscode';

import {TreeViewDemo, Node} from './tree-view-demo'

export function activate(context: vscode.ExtensionContext) {
	const demo = new TreeViewDemo(context);
	context.subscriptions.push(vscode.window.registerTreeDataProvider('tree-view-demo-tree', demo));
	demo.refresh();
}

export function deactivate() {}
