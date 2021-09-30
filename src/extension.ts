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
		if (isOpcodeName(word) && OPCODES.has(word)) {
			return new vscode.Hover(OPCODES.get(word)!.markdownDesc);
		}
		// return new vscode.Hover(hoverMsg);
	}
});

type AddressingMode = 'immediate' | 'register' | 'base+offset' | 'indexed';

const opcodeNames = ['ld', 'st', 'mov', 'add', 'and', "inc", "inca"
	, 'dec', 'deca', 'not', 'gpc', 'shr', 'shl'
	, 'br', 'beq', 'bgt', 'j', 'halt', 'nop'] as const;

type OpcodeName = typeof opcodeNames[number];
function isOpcodeName(x: string): x is OpcodeName {
	// widen formats to string[] so indexOf(x) works
	return (opcodeNames as readonly string[]).indexOf(x) >= 0;
}

type Signature = {
	arg1?: Argument;
	arg2?: Argument;
};

class Argument {
	argName: string;
	addressingModes: AddressingMode[];
	desc: string;
	constructor(argName: string, modes: AddressingMode[]) {
		this.argName = argName;
		this.addressingModes = modes;
		// Update desc
		// in the format of <argName: mode1/mode2/mode3>
		this.desc = `<${this.argName}: `;
		for (const mode of modes) {
			this.desc += `${mode}/`;
		}
		this.desc = this.desc.replace(/.$/, ">");
	}
};

class Opcode {
	name: OpcodeName;
	signature?: Signature;
	// TODO: add TsDoc for description as it is not a too obvious one.
	description: string;
	markdownDesc: vscode.MarkdownString;
	constructor(name: OpcodeName, description: string, signature?: Signature) {
		this.name = name;
		this.signature = signature;
		this.description = description;
		// Update description from signature
		if (this.signature?.arg1) {
			this.description = this.description.replace('$1', String.raw`\<${this.signature.arg1.argName}\>`);
		}
		if (this.signature?.arg2) {
			this.description = this.description.replace('$2', String.raw`\<${this.signature.arg2.argName}\>`);
		}

		// Update markdownDesc
		let heading = this.name;
		if (this.signature?.arg1) {
			heading += ` ${this.signature?.arg1.desc}`;
		}
		if (this.signature?.arg2) {
			heading += ` ${this.signature?.arg2.desc}`;
		}
		this.markdownDesc = new vscode.MarkdownString()
			.appendCodeblock(heading, 'asm')
			// if it doesn't format properly, change above to appendText()
			.appendText(`\n`) // TODO: Try change it to appendMarkdown(<hr>)?
			.appendMarkdown(this.description);
	}
}

const OPCODES = new Map<OpcodeName, Opcode>([
	['ld', new Opcode('ld', 'loads value from $1 to $2',
		{
			arg1: new Argument('val', ['immediate', 'base+offset', 'indexed']),
			arg2: new Argument('dest', ['register'])
		})],
	['st', new Opcode('st', 'stores value from register $1 to memory address $2',
		{
			arg1: new Argument('source', ['register']),
			arg2: new Argument('dest', ['base+offset', 'indexed'])
		})],
	['halt', new Opcode('halt', 'stops execution')],
	['mov', new Opcode('mov', 'moves value from register $1 to $2',
		{
			arg1: new Argument('source', ['register']),
			arg2: new Argument('dest', ['register'])
		})],
	['nop', new Opcode('nop', 'no operation')],
	['add', new Opcode('add', 'add integer stored in $1 and $2, stores result in $2',
		{
			arg1: new Argument('val', ['register']),
			arg2: new Argument('val', ['register'])
		})],
	['and', new Opcode('and', 'performs bitwise logical and between $1 and $2, stores result in $2',
		{
			arg1: new Argument('val1', ['register']),
			arg2: new Argument('val2', ['register'])
		})]
]);

export function deactivate() { }
