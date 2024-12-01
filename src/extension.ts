import * as vscode from "vscode";
import {
  Command,
  TriggerCharacters,
  CommandNumberRegExp,
  LoremText,
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

export function activate(context: vscode.ExtensionContext) {
  const autoCompletion = vscode.languages.registerCompletionItemProvider(
    "*",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
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