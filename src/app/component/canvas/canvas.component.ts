import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/node.state';
import * as NodeSelectors from '../../store/node.selectors';
import * as NodeActions from '../../store/node.actions';
import { NodeType, Node } from 'src/app/models/node.model';
import { Connection } from 'src/app/models/connection.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent {
  nodes$: Observable<Node[]>;
  NodeType = NodeType;
  connections$: Observable<Connection[]>;

  constructor(private store: Store<{ appState: AppState }>) {
    this.nodes$ = this.store.pipe(select(NodeSelectors.selectNodes));
    this.connections$ = this.store.pipe(select(NodeSelectors.selectConnections));
  }

  drawingConnection: any = null;
  cursorPosition: { x: number, y: number } = { x: 0, y: 0 };
  isEditorOpen: boolean = false;

  // Zoom and pan properties
  panX = 0;
  panY = 0;
  isNodeDragging = false;
  isPanning = false;
  startX = 0;
  startY = 0;

  openEditor(): void {
    this.isEditorOpen = true;
  }
  
  closeEditor(): void {
    this.isEditorOpen = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingConnection) {
      this.cursorPosition = { x: (event.clientX - this.panX), y: (event.clientY - this.panY) };
    }
    if (this.isPanning && !this.isNodeDragging) {
      this.isEditorOpen = false;
      this.panX += (event.clientX - this.startX);
      this.panY += (event.clientY - this.startY);
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.isNodeDragging) {
      this.isPanning = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
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

  getConnectionColor(nodeType: NodeType): string {
    switch (nodeType) {
      case NodeType.Server:
        return 'cyan';
      case NodeType.Route:
        return 'magenta';
      case NodeType.Middleware:
        return 'yellow';
      default:
        return 'white';
    }
  }

  generatePath(fromNode: any, toNode: any): string {
    const start = { x: fromNode.position.x + this.panX - 250, y: fromNode.position.y + this.panY };
    const end = { x: toNode.position.x + this.panX - 250, y: toNode.position.y + this.panY };

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
