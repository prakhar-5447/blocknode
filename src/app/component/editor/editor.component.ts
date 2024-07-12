import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MonacoEditorService } from './editor-service';
import { first } from 'rxjs/operators';
import * as NodeActions from '../../store/node.actions';
import { AppState } from '@/app/store/node.state';
import { Store, select } from '@ngrx/store';
import * as NodeSelectors from '../../store/node.selectors';
import { Subscription } from 'rxjs';
import { Node } from '@/app/models/node.model';

declare var monaco: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  private editor: any;
  private selectedNodeId: Node | null = null;
  private selectedNodeSubscription$: Subscription;
  private detectedLibraries: Set<string> = new Set();
  private nodes: Node[] = [];
  private monacoInitialized: boolean = false;

  constructor(private monacoEditorService: MonacoEditorService, private store: Store<{ appState: AppState }>) {
    this.selectedNodeSubscription$ = this.store.pipe(select(NodeSelectors.selectSelectedNodeContent))
      .subscribe(node => {
        this.selectedNodeId = node;
        this.updateEditorContent(this.selectedNodeId?.content!)
      });
    this.store.pipe(select(NodeSelectors.selectNodes)).subscribe(nodes => {
      this.nodes = nodes;
      if (this.monacoInitialized) {
        this.updateMonacoFiles();
      }
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
        const content = this.editor.getValue();
        if (this.selectedNodeId) {
          this.store.dispatch(NodeActions.updateNodeContent({ id: this.selectedNodeId.id, content }));
          this.updateMonacoFile(this.selectedNodeId.id, content);
        }
      });
    }
  }

  private initMonaco(): void {
    const myDiv: HTMLDivElement = this.editorContainer.nativeElement;

    this.editor = monaco.editor.create(myDiv, {
      value: '',
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
      paths: {
        "*": ["./*"],
        "node_*": ["file:///node_*.ts"]
      }
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);

    this.registerAutoImportCommand();
    this.enableAutoImports();

    this.monacoInitialized = true;
    this.updateMonacoFiles();
  }

  private updateMonacoFiles(): void {
    if (!this.monacoInitialized) return;

    for (const node of this.nodes) {
      if (node.content) {
        this.createMonacoFile(node.id, node.content);
      }
    }
  }

  private createMonacoFile(id: string, content: string): void {
    if (!monaco) return;

    const filePath = `file:///node_${id}.ts`;
    monaco.languages.typescript.typescriptDefaults.addExtraLib(content, filePath);
    console.log(filePath)
    const uri = monaco.Uri.parse(filePath);
    let model = monaco.editor.getModel(uri);
    if (!model) {
      model = monaco.editor.createModel(content, 'typescript', uri);
    } else {
      model.setValue(content);
    }
    console.log(model)
  }

  private updateMonacoFile(id: string, content: string): void {
    const filePath = `file:///node_${id}.ts`;
    const uri = monaco.Uri.parse(filePath);
    const model = monaco.editor.getModel(uri);
    if (model) {
      model.setValue(content);
    } else {
      this.createMonacoFile(id, content);
    }
  }

  private loadLibraryTypes(library: string): void {
    const typings = `declare module '${library}';`;
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

        return {
          suggestions: []
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
}
