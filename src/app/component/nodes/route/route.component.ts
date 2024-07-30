import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Node, NodeType } from '../../../models/node.model';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.sass']
})
export class RouteComponent implements OnInit {
  @Input() nodeId: string = '0';
  @Input() nodeName: string = 'Route Node';
  @Input() scale: number = 1;
  width: number = 250;
  @Input() focused: boolean = false;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() routeChanged = new EventEmitter<string>();
  @Output() nodeMoved = new EventEmitter<{ id: string, position: { x: number, y: number }, width: number }>();
  @Output() startConnection = new EventEmitter<{ position: { x: number, y: number }, type: NodeType }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() removeConnection = new EventEmitter<void>();
  @Output() connectionAttach = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string, type: NodeType }>();
  @Output() dragEnded = new EventEmitter<{ id: string, position: { x: number, y: number } }>();
  @ViewChild('routeInput') routeInput: ElementRef | undefined;

  routeName: string = "";
  pos: { x: number, y: number } = { x: 0, y: 0 };
  isEditing = false;
  calcX: number = 0;
  calcY: number = 0;
  ngOnInit() {
    this.calcX = this.position.x;
    this.calcY = this.position.y;
  }
  enableEditing(): void {
    if (this.focused) {
      this.isEditing = true;
      setTimeout(() => this.routeInput!.nativeElement.focus(), 0);
    }
  }

  disableEditing(): void {
    this.isEditing = false;
  }

  constructor() {
    this.routeName = `/${this.nodeName}`
  }


  onDragMoved(event: CdkDragMove): void {
    this.pos.x = event.distance.x / this.scale;
    this.pos.y = event.distance.y / this.scale;
    this.calcX = this.position.x + this.pos.x;
    this.calcY = this.position.y + this.pos.y;
    this.nodeMoved.emit({
      id: this.nodeId, position: {
        x: this.calcX + 250, y: this.calcY
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
    this.startConnection.emit({ position: { x, y }, type: NodeType.Code });
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
}
