import { AppState } from '@/app/store/node.state';
import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Node, NodeType } from '@/app/models/node.model';
import * as NodeActions from '../../store/node.actions';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
    ])
  ]
})
export class ToolbarComponent {
  @Input() nodes: Node[] | null = [];
  @Input() fromNodeId: string | null = null;
  @Input() toNodeId: string | null = null;
  @Input() fromNodeType: NodeType | null = null;
  @Input() toNodeType: NodeType | null = null;
  @Input() selectedConnection: boolean = false;
  @Input() connId: string | null = null;

  constructor(private store: Store<{ appState: AppState }>) {
  }

  isAllowedConnection(fromType: NodeType, toType: NodeType): boolean {
    switch (fromType) {
      case NodeType.Server:
        return toType === NodeType.Route;
      case NodeType.Route:
        return toType === NodeType.Middleware || toType === NodeType.Code;
      default:
        return false;
    }
  }

  checkToNode() {
    const f = this.nodes?.find(n => n.id == this.fromNodeId);
    this.fromNodeType = f?.type ?? null;
    if (this.fromNodeType == null) { this.fromNodeId = null; }
    if (!this.isAllowedConnection(this.fromNodeType!, this.toNodeType!)) {
      this.toNodeId = null;
      this.toNodeType = null;
    }
  }

  changeType() {
    const t = this.nodes?.find(n => n.id == this.fromNodeId);
    this.toNodeType = t?.type ?? null;
    if (this.toNodeType == null) { this.toNodeId = null; }
  }

  saveConnection() {
    if (this.selectedConnection && this.nodes && this.fromNodeId && this.toNodeId && this.connId) {
      const f = this.nodes?.find(n => n.id == this.fromNodeId);
      const t = this.nodes?.find(n => n.id == this.toNodeId);
      if (f && t) {
        this.store.dispatch(NodeActions.updateConnection({
          id: this.connId,
          fromNode: f,
          toNode: t
        }));
      }
    }
  }

}
