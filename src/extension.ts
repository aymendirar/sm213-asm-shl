import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "SM213" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sm213-assembly-syntax-highlighting.credit', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('0000 - 2021 Humanity!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(HOVER_DEFN);
}

// Hovering

const HOVER_DEFN = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'asm' }, {
	provideHover(document, position, token) {
		const range = document.getWordRangeAtPosition(position);
        	const word = document.getText(range);
		// const hoverMsg: vscode.MarkdownString = new vscode.MarkdownString().appendText('GTFO!');
		// hoverMsg.isTrusted = true;
		if (word in DEFN) {return new vscode.Hover(DEFN[word]);}
		// return new vscode.Hover(hoverMsg);
	}
});

const DEFN: {[key: string]: vscode.MarkdownString} = {
	// Format:
	halt : new vscode.MarkdownString()
		.appendCodeblock('halt', 'asm')
		.appendText(`\n`)
		.appendMarkdown('(stop execution)'),
	nop : new vscode.MarkdownString()
		.appendCodeblock('nop', 'asm')
		.appendText(`\n`)
		.appendMarkdown('(stop execution)'),

};

export function deactivate() {}