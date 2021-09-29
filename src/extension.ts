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
	
	ld : opcodeDesc('ld', 'load from memory'),
	st: opcodeDesc('st','store into memory'),
	mov: opcodeDesc('mov','move between registers'),
	add: opcodeDesc('add', 'add integers'),
	and: opcodeDesc('and','bitwise logical and of two 32-bit values'),
	inc: opcodeDesc('inc', 'increment an integer'),
	inca: opcodeDesc('inca','add four to an integer (increment word address)'),
	dec: opcodeDesc('dec','decrement an integer'),
	deca: opcodeDesc('deca','subtract four from integer (decrement word address)'),
	not: opcodeDesc('not','bitwise compliment (i.e., not) of 32-bit value'),
	gpc: opcodeDesc('gpc','get value of program counter'),
	shr: opcodeDesc('shr', 'shift right'),
	shl: opcodeDesc('shl','shift left'),
	br: opcodeDesc('br','unconditional branch'),
	beq: opcodeDesc('beq', 'branch when equal to zero'),
	bgt: opcodeDesc('bgt','branch when greater than zero'),
	j: opcodeDesc('j','unconditional jump'),
	halt : opcodeDesc('halt', 'stop processor'),
	nop : opcodeDesc('nop', 'do nothing'),
};

function opcodeDesc(opcode: string, desc: string) {
	// desc is a short (<10 word) description
	// taken from page 19 of companion
	return new vscode.MarkdownString()
		.appendCodeblock(opcode, 'asm')
		.appendText(`\n`)
		.appendMarkdown(desc);
};

export function deactivate() {}