import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/node.state';
import * as NodeActions from '../../../store/node.actions';
import { Node, NodeType } from '../../../models/node.model';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.sass']
})
export class CodeComponent {
  @Input() nodeId: string = '0';
  @Input() nodeName: string = 'Code Node';
  width: number = 400;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  middlewareCode: string = '';
  @Output() nodeMoved = new EventEmitter<{ id: string, position: { x: number, y: number }, width: number }>();
  @Output() nodeSelected = new EventEmitter<void>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() removeConnection = new EventEmitter<void>();
  @Output() connectionAttach = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string, type: NodeType }>();
  @Output() dragEnded = new EventEmitter<{ id: string, position: { x: number, y: number } }>();
  @Input() code: string = '';

  pos: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private store: Store<{ appState: AppState }>) { }

  onDragMoved(event: CdkDragMove): void {
    const { x, y, width } = event.source.element.nativeElement.getBoundingClientRect();
    this.pos = { x: x + this.width, y: y };
    this.width = width;
    this.nodeMoved.emit({
      id: this.nodeId, position: this.pos, width: this.width
    });
  }

  onDragStart(event: CdkDragStart): void {
    this.dragStarted.emit();
  }

  onDragEnd(event: CdkDragEnd): void {
    const updatedPosition = {
      x: this.pos.x - this.width,
      y: this.pos.y
    };
    this.dragEnded.emit({ id: this.nodeId, position: updatedPosition });
  }

  nodeSelect(): void {
    this.nodeSelected.emit();
    this.store.dispatch(NodeActions.selectNode({ id: this.nodeId }));
  }

  mouseEnter(event: MouseEvent) {
    const x = this.position.x + this.width;
    const y = this.position.y;
    const node: Node = { id: this.nodeId, position: { x: this.position.x, y: this.position.y }, width: this.width, name: this.nodeName, type: NodeType.Route };
    this.connectionAttach.emit({ node: node, position: { x, y }, name: this.nodeName, type: NodeType.Code });
  }

  mouseOut(event: MouseEvent) {
    this.removeConnection.emit();
  }
}
