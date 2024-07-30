import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NodeType } from '../../../models/node.model';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.sass']
})
export class ServerComponent implements OnInit {
  @Input() nodeId: string = '0';
  @Input() scale: number = 1;
  @Input() nodeName: string = 'Server';
  @Input() focused: boolean = false;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() nodeMoved = new EventEmitter<{ id: string, position: { x: number, y: number }, width: number }>();
  @Output() startConnection = new EventEmitter<{ position: { x: number, y: number }, type: NodeType }>();

  @Output() settingsChanged = new EventEmitter<{ port: string, dbUrl: string }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ id: string, position: { x: number, y: number } }>();
  width: number = 250;
  pos: { x: number, y: number } = { x: 0, y: 0 };
  calcX: number = 0;
  calcY: number = 0;
  ngOnInit() {
    this.calcX = this.position.x;
    this.calcY = this.position.y;
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
    this.startConnection.emit({ position: { x, y }, type: NodeType.Route });
  }
}
