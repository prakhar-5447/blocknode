import { Component, Directive, ElementRef, HostListener, Input } from '@angular/core';
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

  deleteEnvVariable(key: string) {
    this.store.dispatch(NodeActions.deleteEnvVariable({ key }));
  }

  editEnvVariable(key: string) {
    const envVariable = this.envVariables.find(env => env.key === key);
    if (envVariable) {
      this.newEnvKey = envVariable.key;
      this.newEnvValue = envVariable.value;
      this.deleteEnvVariable(key);
    }
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