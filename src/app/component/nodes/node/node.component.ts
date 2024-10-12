import { NodeType, Node } from '@/app/models/node.model';
import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass']
})
export class NodeComponent {
  @Input() nodeId: string = '0';
  @Input() nodeName: string = 'Server';
  @Input() nodeType: NodeType = NodeType.Server;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() nodeMoved = new EventEmitter<{ id: string, position: { x: number, y: number }, width: number }>();
  @Output() startConnection = new EventEmitter<{ position: { x: number, y: number }, type: NodeType }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ id: string, position: { x: number, y: number } }>();
  @Output() removeConnection = new EventEmitter<void>();
  @Output() connectionAttach = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string, type: NodeType }>();
  AllNodeType = NodeType
  width: number = 150;
  pos: { x: number, y: number } = { x: 0, y: 0 };
  calcX: number = 0;
  calcY: number = 0;
  ngOnInit() {
    this.calcX = this.position.x;
    this.calcY = this.position.y;
  }

  onDragMoved(event: CdkDragMove): void {
    this.calcX = this.position.x + event.distance.x;
    this.calcY = this.position.y + event.distance.y;
    this.nodeMoved.emit({
      id: this.nodeId, position: {
        x: this.calcX, y: this.calcY
      }, width: this.width
    });
  }

  onDragStart(event: CdkDragStart): void {
    this.dragStarted.emit();
  }

  onDragEnd(event: CdkDragEnd): void {
    const updatedPosition = {
      x: this.calcX,
      y: this.calcY
    };

    this.dragEnded.emit({ id: this.nodeId, position: updatedPosition });
  }

  startConnecting(event: MouseEvent): void {
    event.stopPropagation();
    this.dragStarted.emit();
    const x = this.position.x + this.width;
    const y = this.position.y;
    this.startConnection.emit({ position: { x, y }, type: this.getEndNodeType(this.nodeType) });
  }

  getEndNodeType(nodeType: NodeType): NodeType {
    switch (nodeType) {
      case NodeType.Server: return NodeType.Route;
    }
    return NodeType.Code;
  }

  startConnectingMiddleware(event: MouseEvent): void {
    event.stopPropagation();
    this.dragStarted.emit();
    const x = this.position.x + this.width;
    const y = this.position.y;
    this.startConnection.emit({ position: { x, y }, type: NodeType.Middleware });
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

  getBorderColor(nodeType: NodeType): string {
    switch (nodeType) {
      case NodeType.Server:
        return 'rgba(0, 123, 255)';
      case NodeType.Code:
        return 'rgb(192, 0, 38)';
      case NodeType.Middleware:
        return 'rgb(76, 175, 80)';
      case NodeType.Route:
        return 'rgb(139, 53, 192)';
      default:
        return 'transparent';
    }
  }

  getNodeTypeLabel(nodeType: NodeType): string {
    switch (nodeType) {
      case NodeType.Server:
        return 'Server';
      case NodeType.Code:
        return 'Code';
      case NodeType.Middleware:
        return 'Middleware';
      case NodeType.Route:
        return 'Route';
      default:
        return 'Unknown';
    }
  }
}
