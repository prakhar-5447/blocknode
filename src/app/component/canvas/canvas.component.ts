import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent {
  nodes: { name: string, position: { x: number, y: number } }[] = [];
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
    console.log(event.clientX)
    console.log(event.clientY)
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

  addNode(): void {
    const nodeName = `Node ${this.nodes.length + 1}`;
    this.nodes.push({ name: nodeName, position: { x: 0, y: 0 } });
    console.log(`added ${nodeName}`);
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

  startConnection(startPosition: { node: any, position: { x: number, y: number } }): void {
    this.drawingConnection = { fromNode: startPosition.node, toNode: null };
    console.log(this.drawingConnection);
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
    const start = { x: fromNode.position.x + this.panX, y: fromNode.position.y + this.panY };
    const end = { x: toNode.position.x + this.panX, y: toNode.position.y + this.panY };

    // Calculate path based on relative positions
    let path = `M${start.x},${start.y} `;

    // Determine the direction of the path
    if (start.x < end.x) {
      path += `H${start.x - 50} `; // Move horizontally left 
      if (Math.abs(start.y - end.y) < 100) {
        // Move vertically first if y difference is less than 50
        if (start.y < end.y) {
          path += `V${end.y + 100} `; // Move vertically up to align
        } else {
          path += `V${end.y - 100} `; // Move vertically down to align
        }
        path += `H${end.x - 50} `; // Move vertically down to align
        path += `V${end.y} `; // Move vertically down to align
        path += `H${end.x + 50} `; // Move vertically down to align
      } else {
        path += `V${end.y} `; // Move vertically down to align
        path += `H${end.x} `; // Move vertically down to align
      }
      path += `H${end.x} `; // Move horizontally to the endpoint
    } else {
      if (Math.abs(start.y - end.y) < 100) {
        path += `H${start.x - 50} `; // Move vertically down to align

        // Move vertically first if y difference is less than 50
        if (start.y < end.y) {
          path += `V${end.y - 100} `; // Move vertically up to align
        } else {
          path += `V${end.y + 100} `; // Move vertically down to align
        }
        path += `H${end.x - 50} `; // Move vertically down to align
        path += `V${end.y} `; // Move vertically down to align
        path += `H${end.x + 50} `; // Move vertically down to align

      } else {
        path += `H${end.x - 50} `; // Move horizontally left 
        path += `V${end.y} `; // Move vertically down to align
      }
      path += `H${end.x} `; // Move horizontally to the endpoint
    }

    return path;
  }
}
