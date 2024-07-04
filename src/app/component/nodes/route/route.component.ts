import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.sass']
})
export class RouteComponent {
  @Input() nodeName: string = ''; width: number = 200;
  routeName: string = "";
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() routeChanged = new EventEmitter<string>();
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @Output() startConnection = new EventEmitter<any>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();
  @ViewChild('routeInput') routeInput: ElementRef | undefined;

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
    this.position = { x, y };
    this.width = width;
    this.nodeMoved.emit({ name: this.nodeName, position: this.position });
  }

  onDragStart(event: CdkDragStart): void {
    this.dragStarted.emit();
  }

  onDragEnd(event: CdkDragEnd): void {
    this.dragEnded.emit();
  }
  startConnecting(event: MouseEvent): void {
    event.stopPropagation();
    this.dragStarted.emit();
    const x = this.position.x + this.width;
    const y = this.position.y;
    this.startConnection.emit({ node: this, position: { x, y }, name: this.nodeName });
  }
}
