import { createReducer, on } from '@ngrx/store';
import { AppState } from './node.state';
import * as NodeActions from './node.actions';
import { Enviroment, NodeType } from '../models/node.model';
import { map } from 'rxjs/operators';

const initialState: AppState = {
  nodes: [{
    id: '0',
    name: 'Server',
    position: { x: 300, y: 300 },
    width: 300,
    type: NodeType.Server,
    port: 3000,
    dbUrl: 'mongodb://localhost:27017/mydb',
    enviroment: Enviroment.Development
  }, {
    id: '1',
    name: 'Route Node',
    position: { x: 700, y: 200 },
    width: 250,
    type: NodeType.Route,
  }, {
    id: "2",
    name: `Middleware Node`,
    position: { x: 700, y: 300 },
    width: 250,
    type: NodeType.Middleware,
    content: "const middleware = (req, res, next) => {\n  console.log(\'Request received\');\n  next();\n};"
  }],
  selectedNodeId: null,
  selectedNodeContent: null,
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
    selectedNodeContent: state.nodes.find(node => node.id === id) || null
  })),
  on(NodeActions.deselectNode, state => ({
    ...state,
    selectedNodeId: null,
  })),
  on(NodeActions.updateNodePosition, (state, { id, position }) => {
    // Update node position
    const updatedNodes = state.nodes.map(node =>
      node.id === id ? { ...node, position } : node
    );

    return {
      ...state,
      nodes: updatedNodes,
      // connections: updatedConnections,
    };
  }),
  on(NodeActions.updateConnectionPosition, (state, { id, position, width }) => {
    // Update connections based on new node positions
    const updatedConnections = state.connections.map(connection =>
    ({
      ...connection,
      fromNode: connection.fromNode.id === id ? { ...connection.fromNode, position } : connection.fromNode,
    })
    );
    position = { x: position.x - width, y: position.y };
    const updatedConnectionsto = updatedConnections.map(connection =>
    ({
      ...connection,
      toNode: connection.toNode.id === id ? { ...connection.toNode, position } : connection.toNode
    })
    );

    return {
      ...state,
      connections: updatedConnectionsto,
    };
  }),
  on(NodeActions.getNodePosition, (state, { id }) => ({
    ...state,
    selectedNodePosition: state.nodes.find(node => node.id === id)?.position || null
  })),
  on(NodeActions.addConnection, (state, { connection }) => {
    const connectionExists = state.connections.some(conn =>
      conn.fromNode.id === connection.fromNode.id && conn.toNode.id === connection.toNode.id
    );

    return connectionExists
      ? state
      : {
        ...state,
        connections: [...state.connections, connection],
      };
  }),
);
