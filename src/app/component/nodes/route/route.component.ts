import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Node, NodeType } from '../../../models/node.model';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.sass']
})
export class RouteComponent {
  @Input() nodeName: string = 'Route Node'; width: number = 250;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() routeChanged = new EventEmitter<string>();
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number }, width: number }>();
  @Output() startConnection = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @ViewChild('routeInput') routeInput: ElementRef | undefined;

  routeName: string = "";
  pos: { x: number, y: number } = { x: 0, y: 0 };
  isEditing = false;

  enableEditing(): void {
    this.isEditing = true;
    setTimeout(() => this.routeInput!.nativeElement.focus(), 0);
  }

  disableEditing(): void {
    this.isEditing = false;
  }

  constructor() {
    this.routeName = `/${this.nodeName}`
  }


  onDragMoved(event: CdkDragMove): void {
    const { x, y, width } = event.source.element.nativeElement.getBoundingClientRect();
    this.pos = { x: x + this.width, y: y };
    this.width = width;
    this.nodeMoved.emit({
      name: this.nodeName, position: this.pos, width: this.width
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
    this.dragEnded.emit({ name: this.nodeName, position: updatedPosition });
  }

  startConnecting(event: MouseEvent): void {
    event.stopPropagation();
    this.dragStarted.emit();
    const x = this.position.x + this.width;
    const y = this.position.y;
    const node: Node = { id: "10", position: { x: this.position.x + this.width, y: this.position.y }, width: this.width, name: this.nodeName, type: NodeType.Route };
    this.startConnection.emit({ node: node, position: { x, y }, name: this.nodeName });
  }
}
