import * as vscode from "vscode";
import {
  Command,
  TriggerCharacters,
  CommandNumberRegExp,
  LoremText,
} from "./const";

const insertText = (Words: number) => {
  var editor: any = vscode.window.activeTextEditor;
  editor.edit((edit: any) =>
    editor.selections.forEach((selection: any) => {
      edit.delete(selection);
      edit.insert(selection.start, PersianLorem(Words));
    })
  );
};

const PersianLorem = (Words: any) => {
  var LoremReturn: string = "";
  if (Words.length === 0 || Words === 0) {
    return LoremText;
  }
  var LoremSplited: string[] = LoremText.split(" ");
  var SentenceReset = 0;
  for (var i = 0; i < Words; i++) {
    if (SentenceReset === LoremSplited.length) {
      SentenceReset = 0;
    }
    LoremReturn += LoremSplited[SentenceReset] + " ";
    SentenceReset++;
  }
  return LoremReturn;
};

const extractNumber = (
  document: vscode.TextDocument,
  position: vscode.Position,
): number => {
  const replaceCommandFromLastGroup = (
    matchGroup: RegExpMatchArray,
  ): number => {
    const lastGroup = matchGroup[matchGroup.length - 1];

    if (lastGroup === Command) {
      return 0;
    }
    return parseInt(lastGroup.replace(Command, ""));
  };

  const line: string = document.lineAt(position).text;
  const matchGroup: RegExpMatchArray | null = line.match(CommandNumberRegExp);

  return matchGroup !== null ? replaceCommandFromLastGroup(matchGroup) : 0;
};

export function activate(context: vscode.ExtensionContext) {
  const AutoCompletion = vscode.languages.registerCompletionItemProvider(
    "*",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
      ) {
        const WordCount = extractNumber(document, position);
        const VsCommand = new vscode.CompletionItem(Command);
        VsCommand.insertText = new vscode.SnippetString(
          PersianLorem(WordCount),
        );
        VsCommand.label = `${Command}${WordCount || ""}`;

        var Documentation = "";
        WordCount === 0
          ? (Documentation = "Generate 1 Paragraph of Persian Lorem")
          : (Documentation = `Generate ${WordCount} Words of Persian Lorem`);
        VsCommand.documentation = new vscode.MarkdownString(Documentation);
        return [VsCommand];
      },
    },
    ...TriggerCharacters,
  );
  context.subscriptions.push(AutoCompletion);

  ////////////////////
  // Command
  ////////////////////

  let disposable = vscode.commands.registerCommand(
    "extension.GenerateLorem",
    () => {
      vscode.window
        .showInputBox({
          placeHolder: "How many words ? ( empty for 1 paragraph )",
          prompt:
            "Type how many words you want to insert ( empty for 1 paragraph ) ",
        })
        .then((words: any) => {
          insertText(words);
        });
    },
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
