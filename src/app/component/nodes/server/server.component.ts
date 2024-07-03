import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.sass']
})
export class ServerComponent {
  @Input() nodeName: string = 'server';
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  width: number = 200;

  @Output() serverMoved = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @Output() startConnection = new EventEmitter<{ node: any, position: { x: number, y: number }, name: string }>();

  @Output() settingsChanged = new EventEmitter<{ port: string, dbUrl: string }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();

  serverForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

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
    this.position = { x, y };
    this.width = width;
    this.serverMoved.emit({ name: this.nodeName, position: this.position });
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
    console.log("sakdl;akd;a")
  }
}
