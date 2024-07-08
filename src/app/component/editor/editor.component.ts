import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MonacoEditorService } from './editor-service';
import { first } from 'rxjs/operators';

declare var monaco: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  private editor: any;

  constructor(private monacoEditorService: MonacoEditorService) { }

  ngAfterViewInit(): void {
    this.monacoEditorService.loadMonaco().pipe(first()).subscribe(() => {
      this.initMonaco();
    });
  }

  private initMonaco(): void {
    const myDiv: HTMLDivElement = this.editorContainer.nativeElement;

    this.editor = monaco.editor.create(myDiv, {
      value: [
        'import express from "express";',
        'const app = express();',
        'app.get("/", (req, res) => {',
        '  res.send("Hello World!");',
        '});',
        'app.listen(3000, () => {',
        '  console.log("Server is running on port 3000");',
        '});'
      ].join('\n'),
      language: 'typescript',
      theme: 'vs-dark'
    });

    const compilerOptions = {
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      lib: ['ES2022', 'dom'],
      allowNonTsExtensions: true,
      typeRoots: ['node_modules/@types'],
    };
    // Set compiler options for the TypeScript model
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);


    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'express';`,
      'node_modules/@types/express/index.d.ts'
    );


    // Register and enable auto imports
    this.registerAutoImportCommand();
    this.enableAutoImports();
  }



  private registerAutoImportCommand(): void {
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F1, (args: any) => {
      const model = this.editor.getModel();
      if (model) {
        const value = model.getValue();
        if (!value.includes(`import ${args} from '${args}';`)) {
          const newValue = `import ${args} from '${args}';\n` + value;
          model.setValue(newValue);
        }
      }
    }, 'add-import');
  }

  private enableAutoImports(): void {
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return {
          suggestions: [
            {
              label: 'express',
              kind: monaco.languages.CompletionItemKind.Function,
              documentation: 'Express library',
              insertText: 'express',
              range: range,
              command: {
                id: 'add-import',
                title: 'Add Import',
                arguments: ['express']
              }
            }
          ]
        };
      }
    });
  }
}
