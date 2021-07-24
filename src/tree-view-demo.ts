import * as vscode from 'vscode';

export type Node = {key: string};

export class TreeViewDemo implements vscode.TreeDataProvider<Node> {
    _onDidChangeTreeData: vscode.EventEmitter<Node|undefined|void> = new vscode.EventEmitter<Node|undefined|void>();
    onDidChangeTreeData: vscode.Event<Node|undefined|void> = this._onDidChangeTreeData.event;

    public tree = {
        'a': {
            'a1': {},
            'a2': {
                'first': {},
                'second': {},
                'thrid': {},
            },
            'a3': {},
        },
        'b': {},
    }

    constructor(context: vscode.ExtensionContext) {
        const view = vscode.window.createTreeView('tree-view-demo-tree', {treeDataProvider: this, showCollapseAll: true, canSelectMany: true,});
        context.subscriptions.push(view);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getChildren(node?: Node): vscode.ProviderResult<Node[]> {
        return this._getChildren(node ? node.key : undefined).map(key => ({key}));
    }

    getTreeItem(node: Node): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const treeItem = this._getTreeItem(node.key);
        treeItem.id = node.key;
        if (node.key === 'second') {
            return new Promise(res => setTimeout(() => res(treeItem), 1000));
        } else {
            return treeItem;
        }
    }

    _getChildren(key?: string): string[] {
        if (!key) {
            return Object.keys(this.tree);
        }
        const node = this._getNode(key);
        if (node) {
            return Object.keys(node);
        }
        return [];
    }

    _getTreeItem(key: string): vscode.TreeItem {
        const node = this._getNode(key);
        return {
            label: key,
            collapsibleState: node && Object.keys(node).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        };
    }

    _getNode(key: string, tree?: any): Node|undefined {
        const root = tree ?? this.tree;
        for (const n in root) {
            if (n === key) {
                return root[n]
            } else {
                const node = this._getNode(key, root[n]);
                if (node) {
                    return node;
                }
            }
        }
    }
}
