import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MonacoEditorService } from './editor-service';
import { first } from 'rxjs/operators';
import * as NodeActions from '../../store/node.actions';
import { AppState } from '@/app/store/node.state';
import { Store, select } from '@ngrx/store';
import * as NodeSelectors from '../../store/node.selectors';
import { Observable, Subscription } from 'rxjs';
import { Node } from '@/app/models/node.model';

declare var monaco: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  private editor: any;
  private selectedNodeId: Node | null = null;
  private selectedNodeSubscription$: Subscription;
  private detectedLibraries: Set<string> = new Set();

  constructor(private monacoEditorService: MonacoEditorService, private store: Store<{ appState: AppState }>) {
    this.selectedNodeSubscription$ = this.store.pipe(select(NodeSelectors.selectSelectedNodeContent))
      .subscribe(node => {
        this.selectedNodeId = node;
        this.updateEditorContent(this.selectedNodeId?.content!)
      });
  }

  ngAfterViewInit(): void {
    this.monacoEditorService.loadMonaco().pipe(first()).subscribe(() => {
      this.initMonaco();
    });
  }

  ngOnDestroy(): void {
    if (this.selectedNodeSubscription$) {
      this.selectedNodeSubscription$.unsubscribe();
    }
  }


  private updateEditorContent(content: string): void {
    if (this.editor) {
      this.editor.setValue(content);
      this.editor.getModel().onDidChangeContent(() => {
        console.log("kuiikyu")
        const content = this.editor.getValue();
        if (this.selectedNodeId) {
          this.store.dispatch(NodeActions.updateNodeContent({ id: this.selectedNodeId.id, content }));
        }
      });

    }
  }

  private initMonaco(): void {
    const myDiv: HTMLDivElement = this.editorContainer.nativeElement;

    this.editor = monaco.editor.create(myDiv, {
      value: [].join('\n'),
      language: 'typescript',
      theme: 'vs-dark',
      wordWrap: 'on',
      wrappingIndent: 'indent'
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

    // Register and enable auto imports
    this.registerAutoImportCommand();
    this.enableAutoImports();
  }


  private loadLibraryTypes(library: string): void {
    // Example: Dynamically fetch and load TypeScript types for the library
    const typings = `declare module '${library}';`; // Example declaration for 'express'

    // Add the typings to Monaco Editor's TypeScript defaults
    monaco.languages.typescript.typescriptDefaults.addExtraLib(typings, 'node_modules/@types/' + library + '/index.d.ts');
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

        // Example suggestion for 'express'
        return {
          suggestions: [

          ]
        };
      }
    });
  }

  detectAndLoadLibraries(): void {
    const model = this.editor.getModel();
    if (model) {
      const content = model.getValue();
      const importRegex = /import\s+[\w{}*]+\s+from\s+['"]([^'"]+)['"]/g;
      let match: RegExpExecArray | null;

      while ((match = importRegex.exec(content)) !== null) {
        const libraryName = match[1];
        console.log(libraryName)
        if (!this.detectedLibraries.has(libraryName)) {
          this.loadLibraryTypes(libraryName);
          this.detectedLibraries.add(libraryName);
        }
      }
    }
  }

  onButtonClick(): void {
    this.detectAndLoadLibraries();
  }

  // onKeyDown(event: KeyboardEvent): void {
  //   // Handle tab key for indentation (optional)
  //   if (event.key === 'Tab') {
  //     event.preventDefault();
  //     const textarea = event.target as HTMLTextAreaElement;
  //     const start = textarea.selectionStart;
  //     const end = textarea.selectionEnd;
  //     // Insert tab at cursor position
  //     this.middlewareCode = this.middlewareCode.substring(0, start) + '\t' + this.middlewareCode.substring(end);
  //     // Move cursor forward
  //     textarea.selectionStart = textarea.selectionEnd = start + 1;
  //   }
  // }
}
