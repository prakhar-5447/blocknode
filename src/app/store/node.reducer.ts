import { createReducer, on } from '@ngrx/store';
import { AppState } from './node.state';
import * as NodeActions from './node.actions';
import { NodeType } from '../models/node.model';
import { map } from 'rxjs/operators';

const initialState: AppState = {
  nodes: [{
    id: '0',
    name: 'Server',
    position: { x: 0, y: 0 },
    width: 300,
    type: NodeType.Server,
    port: 3000,
    dbUrl: 'mongodb://localhost:27017/mydb'
  }],
  selectedNodeId: null,
  connections: []
};

export const nodeReducer = createReducer(
  initialState,
  on(NodeActions.addNode, (state, { node }) => ({
    ...state,
    nodes: [...state.nodes, node],
  })),
  on(NodeActions.updateNodeContent, (state, { id, content }) => ({
    ...state,
    nodes: state.nodes.map(node => (node.id === id ? { ...node, content } : node)),
  })),
  on(NodeActions.selectNode, (state, { id }) => ({
    ...state,
    selectedNodeId: id,
  })),
  on(NodeActions.deselectNode, state => ({
    ...state,
    selectedNodeId: null,
  })),
  on(NodeActions.updateNodePosition, (state, { name, position }) => {
    // Update node position
    const updatedNodes = state.nodes.map(node =>
      node.name === name ? { ...node, position } : node
    );

    // // Update connections based on new node positions
    // const updatedConnections = state.connections.map(connection =>
    // ({
    //   ...connection,
    //   fromNode: connection.fromNode.name === name ? { ...connection.fromNode, position } : connection.fromNode,
    //   toNode: connection.toNode.name === name ? { ...connection.toNode, position } : connection.toNode
    // })
    // );

    return {
      ...state,
      nodes: updatedNodes,
      // connections: updatedConnections,
    };
  }),
  on(NodeActions.updateConnectionPosition, (state, { name, position }) => {
    // Update connections based on new node positions
    const updatedConnections = state.connections.map(connection =>
    ({
      ...connection,
      fromNode: connection.fromNode.name === name ? { ...connection.fromNode, position } : connection.fromNode,
      toNode: connection.toNode.name === name ? { ...connection.toNode, position } : connection.toNode
    })
    );

    return {
      ...state,
      connections: updatedConnections,
    };
  }),
  on(NodeActions.getNodePosition, (state, { name }) => ({
    ...state,
    selectedNodePosition: state.nodes.find(node => node.name === name)?.position || null
  })),
  on(NodeActions.addConnection, (state, { connection }) => ({
    ...state,
    connections: [...state.connections, connection],
  })),
);
