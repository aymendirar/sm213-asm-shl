# SM213 Assembly Syntax Highlighter Extension for VS Code

This is a VS Code extension that provides syntax highlighting for the SM213 assembly lanuguage used in UBC's CPSC 213 course. The language was developed for the Simple Machine 213 Simulator by course staff and is based on x86 assembly.

## Project

The project boilerplate was created using CLI tools `Yeoman` and `VS Code Extension Generator`. You can learn about how to start building an extension [here](https://code.visualstudio.com/api/get-started/your-first-extension) and read about how VS Code syntax highlighting extensions work [here](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide).

The main file we care about is `./syntaxes/asm.tmLanguage.json`. The `.json` file has a bunch of fields describing the type of text to syntax highlight and uses Regex to describe what to highlight.

## Contributing

I don't claim that this is good or efficient Regex. Feel free to add or correct anything :)

## Known Issues

-   Referencing a label that has the same name as instruction (ex. having a label for a function named 'add' and calling `j add`) will highlight the label as if it were an instruction
