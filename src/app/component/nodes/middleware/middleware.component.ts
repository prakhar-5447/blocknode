import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/node.state';
import { Node } from "../../../models/node.model";
import * as NodeActions from '../../../store/node.actions';
import { NodeType } from 'src/app/models/node.model';

@Component({
  selector: 'app-middleware',
  templateUrl: './middleware.component.html',
  styleUrls: ['./middleware.component.sass']
})
export class MiddlewareComponent {
  @Input() nodeName: string = 'Middleware Node'; width: number = 250;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  middlewareCode: string = '';
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number }, width: number }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ name: string, position: { x: number, y: number } }>();


  pos: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private store: Store<{ appState: AppState }>) { }

  onKeyDown(event: KeyboardEvent): void {
    // Handle tab key for indentation (optional)
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // Insert tab at cursor position
      this.middlewareCode = this.middlewareCode.substring(0, start) + '\t' + this.middlewareCode.substring(end);
      // Move cursor forward
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  }

  onDragMoved(event: CdkDragMove): void {
    const { x, y, width } = event.source.element.nativeElement.getBoundingClientRect();
    this.pos = { x: x, y: y };
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
      x: this.pos.x,
      y: this.pos.y
    };
    this.dragEnded.emit({ name: this.nodeName, position: updatedPosition });
  }

  addNode(): void {
    const newNode: Node = {
      id: Date.now().toString(),
      name: this.nodeName,
      type: NodeType.Middleware,
      content: this.middlewareCode,
      width: 250,
      position: { x: 0, y: 0 }
    };
    this.store.dispatch(NodeActions.addNode({ node: newNode }));
  }
}
