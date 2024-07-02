import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass']
})
export class NodeComponent {
  @Input() nodeName: string = 'Node';
  @Input() position = { x: 0, y: 0 };
  width: number = 200;

  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @Output() startConnection = new EventEmitter<{ node: any, position: { x: number, y: number } }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();

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
    this.startConnection.emit({ node: this, position: { x, y } });
  }
}
