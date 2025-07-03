import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/node.state';
import * as NodeSelectors from '../../store/node.selectors';
import { Node, NodeType } from '../../models/node.model';
import { Connection } from '../../models/connection.model';
import * as NodeActions from '../../store/node.actions';
import { SideBarComponent } from '../../component/side-bar/side-bar.component';
import { CanvasComponent } from '../../component/canvas/canvas.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [SideBarComponent, CanvasComponent, AsyncPipe],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent {
  nodes$: Observable<Node[]>;
  connections$: Observable<Connection[]>;
  selectedConnection$: Connection | null = null;
  fromNodeId: string | null = null;
  toNodeId: string | null = null;
  fromNodeType: NodeType | null = null;
  toNodeType: NodeType | null = null;
  centerNodePosition: { x: number, y: number } = { x: 0, y: 0 };
  connId: string | null = null;

  constructor(private store: Store<{ appState: AppState }>) {
    this.nodes$ = this.store.pipe(select(NodeSelectors.selectNodes));
    this.connections$ = this.store.pipe(select(NodeSelectors.selectConnections));

    this.store.pipe(select(NodeSelectors.selectSelectedConnection)).subscribe(conn => {
      this.selectedConnection$ = conn;
      if (this.selectedConnection$) {
        this.fromNodeId = this.selectedConnection$.fromNode.id;
        this.fromNodeType = this.selectedConnection$.fromNode.type;
        this.toNodeId = this.selectedConnection$.toNode.id;
        this.toNodeType = this.selectedConnection$.toNode.type;
        this.connId = this.selectedConnection$.id;
      } else {
        this.fromNodeId = null;
        this.fromNodeType = null;
        this.toNodeId = null;
        this.toNodeType = null;
        this.connId = null;
      }
    });
  }

  onCenterNode(position: { x: number, y: number }) {
    this.centerNodePosition = position;
  }
}
