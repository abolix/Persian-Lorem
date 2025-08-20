import * as vscode from "vscode";
import {
  Command,
  CommandNumberRegExp,
  LoremText,
  TriggerCharacters,
} from "./const";

const insertText = (words: number) => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit((editBuilder) => {
      editor.selections.forEach((selection) => {
        editBuilder.delete(selection);
        editBuilder.insert(selection.start, generateLorem(words));
      });
    });
  }
};

const generateLorem = (words: number): string => {
  if (words <= 0) {
    return LoremText;
  }
  const loremWords = LoremText.split(" ");
  let result = "";
  for (let i = 0; i < words; i++) {
    result += loremWords[i % loremWords.length] + " ";
  }
  return result.trim();
};

const extractNumber = (
  document: vscode.TextDocument,
  position: vscode.Position
): number => {
  const line = document.lineAt(position).text;
  const matchGroup = line.match(CommandNumberRegExp);

  if (matchGroup) {
    const lastGroup = matchGroup[matchGroup.length - 1];
    return lastGroup === Command ? 0 : parseInt(lastGroup.replace(Command, ""), 10);
  }
  return 0;
};

const isValidContext = (document: vscode.TextDocument, position: vscode.Position): boolean => {
  // For Vue files, check if we're in a template, script, or style section
  if (document.languageId === 'vue') {
    const text = document.getText();
    const offset = document.offsetAt(position);

    // Simple check - if we're in template or script tags, allow completion
    const beforeText = text.substring(0, offset);
    const templateMatch = beforeText.lastIndexOf('<template>');
    const templateCloseMatch = beforeText.lastIndexOf('</template>');
    const scriptMatch = beforeText.lastIndexOf('<script>');
    const scriptCloseMatch = beforeText.lastIndexOf('</script>');

    // Allow if we're in template section or script section
    return (templateMatch > templateCloseMatch) || (scriptMatch > scriptCloseMatch);
  }

  // For React files (JSX/TSX), check if we're in JSX context
  if (document.languageId === 'javascriptreact' || document.languageId === 'typescriptreact' ||
      document.languageId === 'jsx' || document.languageId === 'tsx') {
    const line = document.lineAt(position).text;
    const beforeCursor = line.substring(0, position.character);

    // Allow completion in JSX text content, string literals, and comments
    // Avoid completion inside HTML tag attributes unless in string
    const insideJSXTag = /<[^>]*$/.test(beforeCursor) && !/"[^"]*$/.test(beforeCursor) && !/'[^']*$/.test(beforeCursor);
    return !insideJSXTag;
  }

  return true; // Allow for all other file types
};

export function activate(context: vscode.ExtensionContext) {
  // Register completion provider for multiple language IDs including Vue and React
  const supportedLanguages = [
    "*",
    "html",
    "vue",
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "jsx",
    "tsx",
    "css",
    "scss",
    "less",
    "json",
    "markdown",
    "plaintext"
  ];

  const autoCompletion = vscode.languages.registerCompletionItemProvider(
    supportedLanguages,
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        // Check if we're in a valid context for completion
        if (!isValidContext(document, position)) {
          return [];
        }

        const wordCount = extractNumber(document, position);
        const completionItem = new vscode.CompletionItem(Command);
        completionItem.insertText = new vscode.SnippetString(generateLorem(wordCount));
        completionItem.label = `${Command}${wordCount || ""}`;
        completionItem.documentation = new vscode.MarkdownString(
          wordCount === 0
          ? "Generate a paragraph of Persian Lorem Ipsum"
          : `Generate ${wordCount} words of Persian Lorem Ipsum`
        );
        return [completionItem];
      },
    },
    ...TriggerCharacters
  );
  context.subscriptions.push(autoCompletion);

  let disposable = vscode.commands.registerCommand(
    "extension.GenerateLorem",
    async () => {
      const words = await vscode.window.showInputBox({
        placeHolder: "Enter number of words (leave empty for 1 paragraph)",
        prompt: "Enter the number of words to insert (leave empty for 1 paragraph)",
      });
      insertText(words ? parseInt(words, 10) : 0);
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
