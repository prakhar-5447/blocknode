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
        this.cursorPosition = { x: event.clientX - this.panX, y: (event.clientY - this.panY) };
      }
    }
    if (this.isPanning && !this.isNodeDragging) {
      this.store.dispatch(NodeActions.deselectConnection());
      this.panX = event.clientX - this.startX;
      this.panY = event.clientY - this.startY;
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 1) {  // Check for middle mouse button
      this.isPanning = true;
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
      this.canvas?.nativeElement.classList.add("grab")
      event.preventDefault(); // Prevent the default middle mouse button action
    }
    this.isNodeDragging = false;
  }

  onMouseUp(): void {
    this.isPanning = false;
    this.canvas?.nativeElement.classList.remove("grab")
    if (this.drawingConnection) {
      this.endConnection({ node: this.addNode(this.drawingConnection.type, this.cursorPosition) })
    }
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


  addNode(nodeType: NodeType, position: { x: number, y: number }): Node {
    let id = this.generateUniqueId();
    const newNode: Node = {
      id: id,
      name: `${nodeType}-${this.nodes?.length ?? id}`,
      position: position,
      width: 150,
      type: nodeType,
    };
    this.store.dispatch(NodeActions.addNode({ node: newNode }));
    return newNode;
  }

  getEndNodeType(nodeType: NodeType): NodeType {
    switch (nodeType) {
      case NodeType.Server: return NodeType.Route;
    }
    return NodeType.Code;
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
      if (this.validConnection(endPosition.node.type, this.drawingConnection.fromNode.type)) {
        const connectionToAdd: Connection = {
          id: this.generateUniqueId(),
          fromNode: this.drawingConnection.fromNode,
          toNode: endPosition.node,
          color: this.getConnectionColor(endPosition.node.type)
        };
        this.store.dispatch(NodeActions.addConnection({ connection: connectionToAdd }));
      }
      this.drawingConnection = null;
      this.isNodeDragging = false;
      this.cursorPosition = { x: 0, y: 0 };
    }
    console.log(this.connections?.length)
  }

  validConnection(endType: NodeType, startType: NodeType): boolean {
    switch (endType) {
      case NodeType.Route:
        return startType == NodeType.Server;
      case NodeType.Middleware:
        return startType == NodeType.Route;
      case NodeType.Code:
        return startType == NodeType.Route || startType == NodeType.Code || startType == NodeType.Middleware;
    }
    return false;
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
    if (this.drawingConnection && this.drawingConnection.fromNode.id != node.node.id) {
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
        return 'rgba(0, 123, 255)';
      case NodeType.Route:
        return 'rgb(139, 53, 192)';
      case NodeType.Middleware:
        return 'rgb(76, 175, 80)';
      case NodeType.Code:
        return 'rgb(192, 0, 38)';
      default:
        return 'black';
    }
  }

  generatePath(fromNode: any, toNode: any): string {
    const start = { x: fromNode.position.x + this.panX + fromNode.width - 5, y: fromNode.position.y + this.panY + 5 };
    const end = { x: toNode.position.x + this.panX + 5, y: toNode.position.y + this.panY + 5 };


    const fromX = start.x + (this.panX * this.scale);
    const fromY = start.y + (this.panY * this.scale);
    const toX = end.x + (this.panX * this.scale);
    const toY = end.y + (this.panY * this.scale);

    // Create a smooth cubic Bezier path between nodes
    return `M ${fromX} ${fromY} C ${(fromX + toX) / 2} ${fromY}, ${(fromX + toX) / 2} ${toY}, ${toX} ${toY}`;

  }

  selectConnection(connection: Connection) {
    this.store.dispatch(NodeActions.selectConnection({ connectionId: connection.id }));
  }

}
