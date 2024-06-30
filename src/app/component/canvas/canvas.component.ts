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

  addNode(): void {
    const nodeName = `Node ${this.nodes.length + 1}`;
    this.nodes.push({ name: nodeName, position: { x: 0, y: 0 } });
  }

  onNodeMoved(event: { name: string, position: { x: number, y: number } }): void {
    const node = this.nodes.find(n => n.name === event.name);
    if (node) {
      node.position = event.position;
    }
  }

  startConnection(startPosition: { node: any, position: { x: number, y: number } }): void {
    this.drawingConnection = { fromNode: startPosition.node, toNode: null };
    this.cursorPosition = { x: startPosition.position.x, y: startPosition.position.y };
  }

  endConnection(endPosition: { node: any }): void {
    if (this.drawingConnection) {
      const targetNode = this.nodes.find(node => node === endPosition.node);
      if (targetNode) {
        this.drawingConnection.toNode = targetNode;
        this.connections.push(this.drawingConnection);
      }
      this.drawingConnection = null;
      this.cursorPosition = { x: 0, y: 0 };
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingConnection) {
      this.cursorPosition = { x: event.clientX, y: event.clientY };
    }
  }

  generatePath(fromNode: any, toNode: any): string {
    const start = fromNode.position;
    const end = toNode.position;
    const midX = (start.x + end.x) / 2;
    return `M${start.x},${start.y} C${midX},${start.y} ${midX},${end.y} ${end.x},${end.y}`;
  }
}
