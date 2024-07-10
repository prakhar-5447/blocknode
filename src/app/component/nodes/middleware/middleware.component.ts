import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/node.state';
import * as NodeActions from '../../../store/node.actions';

@Component({
  selector: 'app-middleware',
  templateUrl: './middleware.component.html',
  styleUrls: ['./middleware.component.sass']
})
export class MiddlewareComponent {
  @Input() nodeId: string = '0';
  @Input() nodeName: string = 'Middleware Node';
   width: number = 250;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  middlewareCode: string = '';
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number }, width: number }>();
  @Output() nodeSelected = new EventEmitter<void>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @Input() code: string = '';

  pos: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private store: Store<{ appState: AppState }>) { }

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

  nodeSelect(): void {
    this.nodeSelected.emit(); 
    this.store.dispatch(NodeActions.selectNode({ id: this.nodeId }));

  }
}
