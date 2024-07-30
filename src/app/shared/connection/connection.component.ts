import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.sass']
})
export class ConnectionComponent {
  @Input() fromNode: any;
  @Input() toNode: any;
  @Input() scale: number = 1;
  lines: any[] = [];

  ngOnInit() {
    this.lines = this.calculateOrthogonalLineStyles(this.fromNode, this.toNode);
  }

  calculateOrthogonalLineStyles(fromNode: any, toNode: any): any[] {
    const fromX = fromNode.position.x;
    const fromY = fromNode.position.y;
    const toX = toNode.position.x;
    const toY = toNode.position.y;

    const midX = (fromX + toX) / 2;

    const lines = [];

    // Horizontal line from fromNode to midpoint X
    lines.push({
      transform: `translate3d(${Math.min(fromX, midX)}px, ${fromY}px, 0)`,
      width: `${Math.abs(midX - fromX)}px`,
      height: '2px'
    });

    // Vertical line from fromNode to toNode
    lines.push({
      transform: `translate3d(${midX}px, ${Math.min(fromY, toY)}px, 0)`,
      width: '2px',
      height: `${Math.abs(toY - fromY)}px`
    });

    // Horizontal line from midpoint X to toNode
    lines.push({
      transform: `translate3d(${Math.min(midX, toX)}px, ${toY}px, 0)`,
      width: `${Math.abs(midX - toX)}px`,
      height: '2px'
    });

    return lines;
  }

}
