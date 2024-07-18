import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppState } from 'src/app/store/node.state';
import * as NodeActions from '../../store/node.actions';
import { NodeType, Node } from 'src/app/models/node.model';
import { Store } from '@ngrx/store';
import { EnvVariable } from '@/app/models/env.model';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  activeTab: string = 'canvas';
  newEnvKey: string = '';
  newEnvValue: string = '';
  envVariables: EnvVariable[] = [];
  NodeType = NodeType
  isEditing: boolean = false
  newVal: string = '';
  editingKey: string | null = null;
  @ViewChild('editInput') editInput: ElementRef | undefined;

  constructor(private store: Store<{ appState: AppState }>) {
    this.store.select(state => state.appState.envVariables).subscribe(envVariables => {
      this.envVariables = envVariables;
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  addEnvVariable(nextInput: HTMLElement) {
    nextInput.blur();
    const envVariable: EnvVariable = { key: this.newEnvKey, value: this.newEnvValue };
    this.store.dispatch(NodeActions.addEnvVariable({ envVariable }));
    this.newEnvKey = '';
    this.newEnvValue = '';
  }

  capitalize() {
    this.newEnvKey = this.newEnvKey.toUpperCase();
  }

  edit(env: EnvVariable) {
    this.isEditing = true;
    this.newVal = env.value;
    this.editingKey = env.key;
    setTimeout(() => this.editInput!.nativeElement.focus(), 0);
  }

  save(key: string) {
    this.store.dispatch(NodeActions.updateEnvVariable({ key: key, value: this.newVal }));
    this.isEditing = false;
    this.newVal = '';
  }

  deleteEnvVariable(key: string) {
    this.store.dispatch(NodeActions.deleteEnvVariable({ key }));
  }

  moveToNextInput(nextInput: HTMLInputElement) {
    nextInput.focus();
  }

  addNode(nodeType: NodeType): void {
    const newNode: Node = {
      id: "5",
      name: `${nodeType} Node`,
      position: { x: 1000, y: 200 },
      width: 250,
      type: nodeType,
      content: "const middleware = (req, res, next) => {\n  console.log(\'Request received\');\n  next();\n};"
    };
    this.store.dispatch(NodeActions.addNode({ node: newNode }));
  }
}