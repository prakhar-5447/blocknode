import { Component } from '@angular/core';
import { Node, NodeType } from 'src/app/models/node';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent {
  NodeType = NodeType;
  nodes: Node[] = [
    { name: 'Server', position: { x: 0, y: 0 }, width: 300, type: NodeType.Server }
  ];

  connections: { fromNode: any, toNode: any }[] = [];
  drawingConnection: any = null;
  cursorPosition: { x: number, y: number } = { x: 0, y: 0 };

  // Zoom and pan properties
  panX = 0;
  panY = 0;
  isNodeDragging = false;
  isPanning = false;
  startX = 0;
  startY = 0;

  onMouseMove(event: MouseEvent): void {
    if (this.drawingConnection) {
      this.cursorPosition = { x: (event.clientX - this.panX), y: (event.clientY - this.panY) };
    }
    if (this.isPanning && !this.isNodeDragging) {
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
    this.isNodeDragging = true;
  }

  onDragEnded(): void {
    this.isNodeDragging = false;
  }

  addNode(nodeType: NodeType): void {
    var nodeName = `${nodeType} Node ${this.nodes.length + 1}`;
    this.nodes.push({ name: nodeName, position: { x: 0, y: 0 }, width: 250, type: nodeType });
    nodeName = `${nodeType} Node ${this.nodes.length + 1}`;
    this.nodes.push({ name: nodeName, position: { x: 0, y: 0 }, width: 250, type: NodeType.Middleware });
  }

  onNodeMoved(event: { name: string, position: { x: number, y: number } }): void {
    const node = this.nodes.find(n => n.name === event.name);
    if (node) {
      node.position = {
        x: event.position.x - this.panX,
        y: event.position.y - this.panY
      };
    }
  }

  startConnection(startPosition: { node: any, position: { x: number, y: number }, name: string }): void {
    this.drawingConnection = { fromNode: startPosition.node, toNode: null };
    this.cursorPosition = { x: startPosition.position.x, y: startPosition.position.y };
    this.isNodeDragging = true;
  }

  endConnection(endPosition: { node: any }): void {
    if (this.drawingConnection) {
      const targetNode = this.nodes.find(node => node === endPosition.node);
      if (targetNode) {
        this.drawingConnection.toNode = targetNode;
        this.connections.push(this.drawingConnection);
      }
      this.drawingConnection = null;
      this.isNodeDragging = false;

      this.cursorPosition = { x: 0, y: 0 };
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
