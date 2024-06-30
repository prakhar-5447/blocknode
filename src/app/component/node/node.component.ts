import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass']
})
export class NodeComponent {
  @Input() nodeName: string = 'Node';
  @Input() position = { x: 0, y: 0 };
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @Output() startConnection = new EventEmitter<{ node: any, position: { x: number, y: number } }>();

  onDragMoved(event: CdkDragMove): void {
    const { x, y } = event.source.element.nativeElement.getBoundingClientRect();
    this.position = { x, y };
    this.nodeMoved.emit({ name: this.nodeName, position: this.position });
  }


  startConnecting(event: MouseEvent): void {
    event.stopPropagation();
    const x = this.position.x;
    const y = this.position.y;
    this.startConnection.emit({ node: this, position: { x, y } });
  }
}
