import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "SM213" is now active!');

  context.subscriptions.push(EASTER_EGG);
  context.subscriptions.push(HOVER_DEFN);
}

/** a secret */
const EASTER_EGG = vscode.commands.registerCommand("sm213-assembly-syntax-highlighting.credit", () => {
  // Display a message box to the user
  // Command has to be declared in package.json first
  vscode.window.showInformationMessage("0000 - 2021 Humanity!");
});

// Below Part of the code is for implementation of Hovering

/** hover provider for SM213 Opcode definitions */
const HOVER_DEFN = vscode.languages.registerHoverProvider(
  { scheme: "file", language: "asm" },
  {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      // const hoverMsg: vscode.MarkdownString = new vscode.MarkdownString().appendText('GTFO!');
      // hoverMsg.isTrusted = true;
      console.log(word);
      if (isOpcodeName(word) && OPCODES.has(word)) {
        return new vscode.Hover(OPCODES.get(word)!.markdownDesc);
      }
      // return new vscode.Hover(hoverMsg);
    },
  },
);

// Added to leverage strict type checking by typescript (prevent typo)
type AddressingMode = "immediate" | "register" | "base+offset" | "indexed";

const opcodeNames = [
  "ld",
  "st",
  "mov",
  "add",
  "and",
  "inc",
  "inca",
  "dec",
  "deca",
  "not",
  "gpc",
  "shr",
  "shl",
  "br",
  "beq",
  "bgt",
  "j",
  "halt",
  "nop",
] as const;

type OpcodeName = typeof opcodeNames[number];
function isOpcodeName(x: string): x is OpcodeName {
  // widen formats to string[] so indexOf(x) works
  return (opcodeNames as readonly string[]).indexOf(x) >= 0;
}

/**
 * Signature of an instruction
 *
 * containing information of input argument(s)
 */
type Signature = {
  arg1?: Argument;
  arg2?: Argument;
};

/**
 * Class representing an input argument of an SM213 instruction
 */
class Argument {
  /** name of the argument */
  argName: string;
  addressingModes: AddressingMode[];
  /** description of the argument
   *
   * Format: <argName: addressingMode1/addressingMode2...>
   */
  desc: string;
  constructor(argName: string, modes: AddressingMode[]) {
    this.argName = argName;
    this.addressingModes = modes;
    // Generate desc
    // in the format of <argName: mode1/mode2...>
    this.desc = `<${this.argName}: `;
    for (const mode of modes) {
      this.desc += `${mode}/`;
    }
    this.desc = this.desc.replace(/.$/, ">");
  }
}

/**
 * Class representing an Opcode
 */
class Opcode {
  name: OpcodeName;
  signature?: Signature;
  /**
   * Description of the Opcode
   *
   * It will be displayed as the second part of the hover preview
   */
  description: string;
  markdownDesc: vscode.MarkdownString;

  /**
   *
   * @param description description of the Opcode, for which $1, $2 are used as placeholder for argument names
   */
  constructor(name: OpcodeName, description: string, signature?: Signature) {
    this.name = name;
    this.signature = signature;
    this.description = description;
    // Format description from signature
    if (this.signature?.arg1) {
      this.description = this.description.replace("$1", String.raw`\<${this.signature.arg1.argName}\>`);
    }
    if (this.signature?.arg2) {
      this.description = this.description.replace("$2", String.raw`\<${this.signature.arg2.argName}\>`);
    }

    // Generate markdownDesc
    let heading = this.name;
    if (this.signature?.arg1) {
      heading += ` ${this.signature?.arg1.desc}`;
    }
    if (this.signature?.arg2) {
      heading += ` ${this.signature?.arg2.desc}`;
    }
    this.markdownDesc = new vscode.MarkdownString()
      .appendCodeblock(heading, "asm")
      .appendMarkdown("\n --- \n") // insert horizontal rule
      .appendMarkdown(this.description);
  }
}

const OPCODES = new Map<OpcodeName, Opcode>([
  [
    "ld",
    new Opcode("ld", "loads value from $1 to $2", {
      arg1: new Argument("val", ["immediate", "base+offset", "indexed"]),
      arg2: new Argument("dest", ["register"]),
    }),
  ],
  [
    "st",
    new Opcode("st", "stores value from register $1 to memory address $2", {
      arg1: new Argument("source", ["register"]),
      arg2: new Argument("dest", ["base+offset", "indexed"]),
    }),
  ],
  ["halt", new Opcode("halt", "stops execution")],
  [
    "mov",
    new Opcode("mov", "moves value from register $1 to register $2", {
      arg1: new Argument("source", ["register"]),
      arg2: new Argument("dest", ["register"]),
    }),
  ],
  ["nop", new Opcode("nop", "no operation")],
  [
    "add",
    new Opcode("add", "add integer stored in $1 and $2", {
      arg1: new Argument("source", ["register"]),
      arg2: new Argument("dest", ["register"]),
    }),
  ],
  [
    "and",
    new Opcode("and", "performs bitwise logical and between $1 and $2", {
      arg1: new Argument("val1", ["register"]),
      arg2: new Argument("val2", ["register"]),
    }),
  ],
  [
    "not",
    new Opcode("not", "performs bitwise logical not on value stored in $1", {
      arg1: new Argument("val", ["register"]),
    }),
  ],
  [
    "shl",
    new Opcode("shl", "logical left shift value stored in $2 by $1", {
      arg1: new Argument("val", ["immediate"]),
      arg2: new Argument("dest", ["register"]),
    }),
  ],
  [
    "shr",
    new Opcode("shr", "logical right shift value stored in $2 by $1", {
      arg1: new Argument("val", ["immediate"]),
      arg2: new Argument("dest", ["register"]),
    }),
  ],
  [
    "inc",
    new Opcode("inc", "increments value stored in $1 by 1", {
      arg1: new Argument("val", ["register"]),
    }),
  ],
  [
    "inca",
    new Opcode("inca", "increments value stored in $1 by 4", {
      arg1: new Argument("val", ["register"]),
    }),
  ],
  [
    "dec",
    new Opcode("dec", "decrements value stored in $1 by 1", {
      arg1: new Argument("val", ["register"]),
    }),
  ],
  [
    "deca",
    new Opcode("deca", "decrements value stored in $1 by 4", {
      arg1: new Argument("val", ["register"]),
    }),
  ],
]);

export function deactivate() {}
