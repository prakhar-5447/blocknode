import { Connection } from '@/app/models/connection.model';
import { Node } from '@/app/models/node.model';
import { Component, Input, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AppState } from '@/app/store/node.state';
import { Store } from '@ngrx/store';
import * as NodeSelectors from '../../store/node.selectors';
import * as NodeActions from '../../store/node.actions';

export interface NodeWithConnections {
  node: Node;
  connections: {
    connectionId: string;
    connectedFrom: Node | null;
    connectedTo: Node | null;
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
  
  constructor(private store: Store<{ appState: AppState }>) {}

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
          n.connections.push({ connectionId: connection.id, connectedTo: connection.toNode, connectedFrom: null })
        } else if (connection.toNode.id == node.id) {
          n.connections.push({ connectionId: connection.id, connectedFrom: connection.fromNode, connectedTo: null })
        }
      });
      nodeMap.push(n);
    })
    return nodeMap;
  }

  hasChild = (_: number, node: any) => !!node.connections && node.connections.length >= 0;

  selectConnection(connectionId: string) {
    this.store.dispatch(NodeActions.selectConnection({ connectionId: connectionId }));
  }
}
