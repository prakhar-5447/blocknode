import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/node.state';
import * as NodeSelectors from '../../store/node.selectors';
import * as NodeActions from '../../store/node.actions';
import { NodeType, Node } from 'src/app/models/node.model';
import { Connection } from 'src/app/models/connection.model';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent {
  @Input() nodes: Node[] | null = [];
  NodeType = NodeType;
  @Input() connections: Connection[] | null = [];
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  constructor(private store: Store<{ appState: AppState }>, private _snackBar: MatSnackBar) {
  }

  focusedNode: any = null;
  contextMenuVisible: boolean = false;
  contextMenuPosition: { x: number, y: number } = { x: 0, y: 0 };

  drawingConnection: any = null;
  cursorPosition: { x: number, y: number } = { x: 0, y: 0 };
  isEditorOpen: boolean = false;
  position: any = null;

  // Zoom and pan properties
  panX = 0;
  panY = 0;
  isNodeDragging = false;
  isPanning = false;
  startX = 0;
  startY = 0;
  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  sidebarOffset = 250;

  // Zoom properties
  scale = 1;
  minScale = 0.5;
  maxScale = 2;

  onWheel(event: WheelEvent) {
    event.preventDefault();
  
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    const cursorX = event.clientX - canvasRect.left;
    const cursorY = event.clientY - canvasRect.top;
  
    // Calculate the zoom factor
    const delta = Math.sign(event.deltaY) * -0.1;
    const newScale = Math.min(Math.max(this.minScale, this.scale + delta), this.maxScale);
  
    // Calculate the new pan values to zoom around the cursor position
    const scaleRatio = newScale / this.scale;
    this.panX = cursorX - scaleRatio * (cursorX - this.panX);
    this.panY = cursorY - scaleRatio * (cursorY - this.panY);
  
    // Update the scale
    this.scale = newScale;
  }
  
  onNodeDoubleClicked(node: any) {
    this.store.dispatch(NodeActions.deselectConnection());
    this.focusedNode = node;
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: node.position.x + node.width + 10, y: node.position.y };
  }
  closeContextMenu() {
    this.contextMenuVisible = false;
    this.focusedNode = null;
  }

  @Input() set centerNodePosition(position: { x: number, y: number }) {
    if (position) {
      this.panToCenter(position);
    }
  }

  panToCenter(position: { x: number, y: number }) {
    const canvas = document.querySelector('.virtual-space');
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const canvasCenterX = 0;
      const canvasCenterY = 0;

      this.panX = canvasCenterX - position.x;
      this.panY = canvasCenterY - position.y;
    }
  }

  openSnackBar(data: { message: string, action: string }) {
    this._snackBar.open(data.message, data.action, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


  openEditor(): void {
    this.isEditorOpen = true;
  }

  closeEditor(): void {
    this.isEditorOpen = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingConnection) {
      if (this.position) {
        this.cursorPosition = { x: this.position.x, y: this.position.y };
      } else {
        this.cursorPosition = { x: (event.clientX - this.panX) - this.sidebarOffset, y: (event.clientY - this.panY) };
      }
    }
    if (this.isPanning && !this.isNodeDragging) {
      this.store.dispatch(NodeActions.deselectConnection());
      this.panX = event.clientX - this.startX - this.sidebarOffset;
      this.panY = event.clientY - this.startY;
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 1 && !this.contextMenuVisible) {  // Check for middle mouse button
      this.isPanning = true;
      this.startX = event.clientX - this.panX - this.sidebarOffset;
      this.startY = event.clientY - this.panY;
      this.canvas?.nativeElement.classList.add("grab")
      event.preventDefault(); // Prevent the default middle mouse button action
    }
    this.isNodeDragging = false;
  }

  onMouseUp(): void {
    this.isPanning = false;
    this.canvas?.nativeElement.classList.remove("grab")
  }

  onDragStarted(): void {
    this.isEditorOpen = false;
    this.isNodeDragging = true;
  }

  onDragEnded(event: { id: string, position: { x: number, y: number } }): void {
    this.isNodeDragging = false;

    const updatedPosition = {
      x: event.position.x,
      y: event.position.y
    };
    this.store.dispatch(NodeActions.updateNodePosition({ id: event.id, position: updatedPosition }));
  }

  onNodeMoved(event: { id: string, position: { x: number, y: number }, width: number }): void {
    this.store.dispatch(NodeActions.deselectConnection());
    const updatedPosition = {
      x: event.position.x,
      y: event.position.y
    };
    this.store.dispatch(NodeActions.updateConnectionPosition({ id: event.id, position: updatedPosition, width: 0 }));
  }

  startConnection(startPosition: { position: { x: number, y: number }, type: NodeType }, node: { n: Node }): void {
    this.drawingConnection = { fromNode: node.n, toNode: null, type: startPosition.type };
    this.cursorPosition = { x: startPosition.position.x, y: startPosition.position.y };
    this.isNodeDragging = true;
  }

  endConnection(endPosition: { node: Node }): void {
    if (this.drawingConnection) {
      if (endPosition.node.type == this.drawingConnection.type) {
        const connectionToAdd: Connection = {
          id: this.generateUniqueId(),
          fromNode: this.drawingConnection.fromNode,
          toNode: endPosition.node,
          color: this.getConnectionColor(this.drawingConnection.type)

        };
        this.store.dispatch(NodeActions.addConnection({ connection: connectionToAdd }));
      }
      this.drawingConnection = null;
      this.isNodeDragging = false;
      this.cursorPosition = { x: 0, y: 0 };
    }
  }

  generateUniqueId(): string {
    const now = new Date();
    const uniqueId = `${now.getFullYear()}${this.pad(now.getMonth() + 1, 2)}${this.pad(now.getDate(), 2)}${this.pad(now.getHours(), 2)}${this.pad(now.getMinutes(), 2)}${this.pad(now.getSeconds(), 2)}${this.pad(now.getMilliseconds(), 3)}`;
    return uniqueId;
  }

  pad(num: number, size: number): string {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
  }


  connect(node: { node: Node }): void {
    if (this.drawingConnection) {
      this.position = { x: node.node.position.x, y: node.node.position.y };
    }
  }

  disconnect(): void {
    if (this.drawingConnection || this.position) {
      this.position = null;
    }
  }

  getConnectionColor(nodeType: NodeType): string {
    switch (nodeType) {
      case NodeType.Server:
        return 'cyan';
      case NodeType.Route:
        return '#2196f3';
      case NodeType.Middleware:
        return '#4caf50';
      case NodeType.Code:
        return '#2e2e2e';
      default:
        return 'white';
    }
  }

  generatePath(fromNode: any, toNode: any): string {
    const start = { x: fromNode.position.x + this.panX + fromNode.width, y: fromNode.position.y + this.panY };
    const end = { x: toNode.position.x + this.panX, y: toNode.position.y + this.panY };

    let path = `M${start.x},${start.y} `;

    if (start.x < end.x) {
      path += `H${start.x - 50} `;
      if (Math.abs(start.y - end.y) < 100) {

        if (start.y < end.y) {
          path += `V${end.y + 100} `;
        } else {
          path += `V${end.y - 100} `;
        }
        path += `H${end.x - 50} `;
        path += `V${end.y} `;
        path += `H${end.x + 50} `;
      } else {
        path += `V${end.y} `;
        path += `H${end.x} `;
      }
      path += `H${end.x} `;
    } else {
      if (Math.abs(start.y - end.y) < 100) {
        path += `H${start.x - 50} `;


        if (start.y < end.y) {
          path += `V${end.y - 100} `;
        } else {
          path += `V${end.y + 100} `;
        }
        path += `H${end.x - 50} `;
        path += `V${end.y} `;
        path += `H${end.x + 50} `;

      } else {
        path += `H${end.x - 50} `;
        path += `V${end.y} `;
      }
      path += `H${end.x} `;
    }

    return path;
  }

  selectConnection(connection: Connection) {
    this.store.dispatch(NodeActions.selectConnection({ connectionId: connection.id }));
  }

}
