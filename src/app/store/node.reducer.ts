import { createReducer, on } from '@ngrx/store';
import { AppState } from './node.state';
import * as NodeActions from './node.actions';
import { NodeType } from '../models/node.model';

const initialState: AppState = {
  nodes: [
    {
      id: "20241013161858475",
      name: "Server",
      position: {
        "x": 355,
        "y": 427
      },
      width: 150,
      type: NodeType.Server
    },
  ],
  selectedNodeId: null,
  selectedNodeContent: null,
  connections: [],
  selectConnection: null,
  envVariables: [],
};

// export const onSaveClick = (state: any) => {
//   const data = JSON.stringify(state, null, 2);
//   const blob = new Blob([data], { type: 'application/json' });
//   const url = window.URL.createObjectURL(blob);

//   const a = document.createElement('a');
//   a.href = url;
//   a.download = 'state.json';
//   a.click();
//   console.log("downloaded")
//   window.URL.revokeObjectURL(url);
// };


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
    position = { x: position.x, y: position.y };
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
  on(NodeActions.addEnvVariable, (state, { envVariable }) => ({
    ...state,
    envVariables: [...state.envVariables, envVariable],
  })),
  on(NodeActions.deleteEnvVariable, (state, { key }) => ({
    ...state,
    envVariables: state.envVariables.filter(env => env.key !== key),
  })),
  on(NodeActions.updateEnvVariable, (state, { key, value }) => ({
    ...state,
    envVariables: state.envVariables.map(env =>
      env.key === key ? { ...env, key, value } : env
    ),
  })),
  on(NodeActions.selectConnection, (state, { connectionId }) => ({
    ...state,
    selectConnection: state.connections.find(c => c.id === connectionId) || null,
  })),
  on(NodeActions.deselectConnection, (state) => ({
    ...state,
    selectConnection: null,
  })),
  on(NodeActions.updateConnection, (state, { id, fromNode, toNode }) => ({
    ...state,
    connections: state.connections.map(conn =>
      conn.id === id ? { ...conn, fromNode, toNode } : conn
    ),
    selectConnection: null,
  }))
);
