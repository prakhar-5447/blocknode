import { CdkDragEnd, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-middleware',
  templateUrl: './middleware.component.html',
  styleUrls: ['./middleware.component.sass']
})
export class MiddlewareComponent {
  @Input() nodeName: string = ''; width: number = 200;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  middlewareCode: string = '';
  @Output() nodeMoved = new EventEmitter<{ name: string, position: { x: number, y: number } }>();
  @Output() startConnection = new EventEmitter<any>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();
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
