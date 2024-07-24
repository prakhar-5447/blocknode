import { Connection } from '@/app/models/connection.model';
import { Node } from '@/app/models/node.model';
import { Component, Input, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

export interface NodeWithConnections {
  node: Node;
  connections: {
    connectionId: string;
    connectedTo: Node;
    type: string;
  }[];
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.sass']
})
export class TreeComponent implements OnInit {
  @Input() nodes: Node[] | null = [];
  @Input() connections: Connection[] | null = [];
  treeControl = new NestedTreeControl<any>(node => node.connections);
  dataSource = new MatTreeNestedDataSource<any>();

  ngOnInit() {
    if (this.nodes && this.connections) {
      const nodeMap = this.generateNodeMap();
      this.dataSource.data = nodeMap;
    }
  }

  generateNodeMap(): NodeWithConnections[] {
    var nodeMap: NodeWithConnections[] = [];
    this.nodes!.forEach(node => {
      var n: NodeWithConnections = {
        node: node,
        connections: []
      };
      this.connections!.forEach(connection => {
        if (connection.fromNode.id == node.id) {
          n.connections.push({ connectionId: connection.id, connectedTo: connection.toNode, type: "from" })
        }
        if (connection.toNode.id == node.id) {
          n.connections.push({ connectionId: connection.id, connectedTo: connection.fromNode, type: "to" })
        }
      });
      nodeMap.push(n);
    })
    return nodeMap;
  }

  hasChild = (_: number, node: any) => !!node.connections && node.connections.length >= 0;
}
