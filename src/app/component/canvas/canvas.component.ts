import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  nodes$: Observable<Node[]>;
  NodeType = NodeType;
  connections$: Observable<Connection[]>;

  constructor(private store: Store<{ appState: AppState }>, private _snackBar: MatSnackBar) {
    this.nodes$ = this.store.pipe(select(NodeSelectors.selectNodes));
    this.connections$ = this.store.pipe(select(NodeSelectors.selectConnections));
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

        this.cursorPosition = { x: (event.clientX - this.panX), y: (event.clientY - this.panY) };
      }
    }
    if (this.isPanning && !this.isNodeDragging) {
      this.panX = event.clientX - this.startX;
      this.panY = event.clientY - this.startY;
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 1) {  // Check for middle mouse button
      this.isPanning = true;
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
      event.preventDefault(); // Prevent the default middle mouse button action
    }
    this.isNodeDragging = false;
  }

  onMouseUp(): void {
    this.isPanning = false;
  }

  onDragStarted(): void {
    this.isEditorOpen = false;
    this.isNodeDragging = true;
  }

  onDragEnded(event: { id: string, position: { x: number, y: number } }): void {
    this.isNodeDragging = false;

    const updatedPosition = {
      x: event.position.x - this.panX,
      y: event.position.y - this.panY
    };
    this.store.dispatch(NodeActions.updateNodePosition({ id: event.id, position: updatedPosition }));
  }


  onNodeMoved(event: { id: string, position: { x: number, y: number }, width: number }): void {
    const updatedPosition = {
      x: event.position.x - this.panX,
      y: event.position.y - this.panY
    };
    this.store.dispatch(NodeActions.updateConnectionPosition({ id: event.id, position: updatedPosition, width: event.width }));
  }

  startConnection(startPosition: { node: Node, position: { x: number, y: number }, name: string, type: NodeType }): void {
    this.drawingConnection = { fromNode: startPosition.node, toNode: null, type: startPosition.type };
    this.cursorPosition = { x: startPosition.position.x, y: startPosition.position.y };
    this.isNodeDragging = true;
  }

  endConnection(endPosition: { node: Node }): void {
    if (this.drawingConnection) {
      if (endPosition.node.type == this.drawingConnection.type) {
        const connectionToAdd: Connection = {
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
    const start = { x: fromNode.position.x + this.panX - 300, y: fromNode.position.y + this.panY };
    const end = { x: toNode.position.x + this.panX - 300, y: toNode.position.y + this.panY };

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

}
