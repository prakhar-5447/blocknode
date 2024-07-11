import { Component } from '@angular/core';
import { AppState } from 'src/app/store/node.state';
import * as NodeActions from '../../store/node.actions';
import { NodeType, Node } from 'src/app/models/node.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  NodeType = NodeType
  constructor(private store: Store<{ appState: AppState }>) { }
  addNode(nodeType: NodeType): void {
    const newNode: Node = {
      id: "2",
      name: `${nodeType} Node`,
      position: { x: 1000, y: 200 },
      width: 250,
      type: nodeType,
      content: "const middleware = (req, res, next) => {\n  console.log(\'Request received\');\n  next();\n};"
    };
    this.store.dispatch(NodeActions.addNode({ node: newNode }));
  }
}
