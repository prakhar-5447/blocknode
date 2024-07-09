import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/node.state';
import { Node, NodeType } from '../../../models/node.model';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.sass']
})
export class ServerComponent {
  @Input() nodeName: string = 'Server';
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number }, width: number }>();
  @Output() startConnection = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string, type: NodeType }>();

  @Output() settingsChanged = new EventEmitter<{ port: string, dbUrl: string }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ name: string, position: { x: number, y: number } }>();

  width: number = 300;
  pos: { x: number, y: number } = { x: 0, y: 0 };
  serverForm!: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<{ appState: AppState }>) {

  }

  ngOnInit() {
    this.serverForm = this.fb.group({
      port: [''],
      dbUrl: [''],
      environment: [false], // false for development, true for production
    });
  }


  serverSettings = {
    port: '3000',
    dbUrl: 'mongodb://localhost:27017/mydb'
  };

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
    const node: Node = { id: "10", position: { x: this.position.x + this.width, y: this.position.y }, width: this.width, name: this.nodeName, type: NodeType.Server };
    this.startConnection.emit({ node: node, position: { x, y }, name: this.nodeName, type: NodeType.Route });
  }
}
