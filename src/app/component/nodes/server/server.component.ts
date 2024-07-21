import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Node, NodeType } from '../../../models/node.model';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.sass']
})
export class ServerComponent {
  @Input() nodeId: string = '0';
  @Input() nodeName: string = 'Server';
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() nodeMoved = new EventEmitter<{ id: string, position: { x: number, y: number }, width: number }>();
  @Output() startConnection = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string, type: NodeType }>();

  @Output() settingsChanged = new EventEmitter<{ port: string, dbUrl: string }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ id: string, position: { x: number, y: number } }>();

  width: number = 250;
  pos: { x: number, y: number } = { x: 0, y: 0 };

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

  startConnecting(event: MouseEvent): void {
    event.stopPropagation();
    this.dragStarted.emit();
    const x = this.position.x + this.width;
    const y = this.position.y;
    const node: Node = { id: this.nodeId, position: { x: this.position.x + this.width, y: this.position.y }, width: this.width, name: this.nodeName, type: NodeType.Server };
    this.startConnection.emit({ node: node, position: { x, y }, name: this.nodeName, type: NodeType.Route });
  }
}
