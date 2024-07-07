import { Component, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/node.state';
import * as NodeSelectors from '../../store/node.selectors';
import * as NodeActions from '../../store/node.actions';
import { Node } from 'src/app/models/node.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  nodes$: Observable<Node[]>;
  @Output() tabSelected = new EventEmitter<string>();

  constructor(private store: Store<{ appState: AppState }>) {
    this.nodes$ = this.store.pipe(select(NodeSelectors.selectNodes));
  }

  selectTab(tabName: string): void {
    this.tabSelected.emit(tabName);
    if (tabName === 'canvas') {
      this.store.dispatch(NodeActions.deselectNode());
    }
  }

  selectNode(nodeId: string): void {
    this.tabSelected.emit('editor');
    this.store.dispatch(NodeActions.selectNode({ id: nodeId }));
  }
}
