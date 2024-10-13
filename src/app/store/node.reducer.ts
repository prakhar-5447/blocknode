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
    {
      id: "20241013161858575",
      name: "Api-2",
      position: {
        "x": 668,
        "y": 334
      },
      width: 150,
      type: NodeType.Route
    },
    {
      id: "20241013161858675",
      name: "Middleware-2",
      position: {
        "x": 897,
        "y": 672
      },
      width: 150,
      type: NodeType.Middleware
    },
    {
      id: "20241013161858775",
      name: "Code-3",
      position: {
        "x": 1147,
        "y": 632
      },
      width: 150,
      type: NodeType.Code
    },
    {
      id: "20241013161858875",
      name: "Api-1",
      position: {
        "x": 658,
        "y": 112
      },
      width: 150,
      type: NodeType.Route
    },
    {
      id: "20241013161902523",
      name: "Api-3",
      position: {
        "x": 662,
        "y": 522
      },
      width: 150,
      type: NodeType.Route
    },
    {
      id: "20241013162018070",
      name: "Middleware-1",
      position: {
        "x": 938,
        "y": 275
      },
      width: 150,
      type: NodeType.Middleware
    },
    {
      id: "20241013162049278",
      name: "Code-2",
      position: {
        "x": 1099,
        "y": 465
      },
      width: 150,
      type: NodeType.Code
    },
    {
      id: "20241013162052710",
      name: "Code-1",
      position: {
        "x": 1164,
        "y": 201
      },
      width: 150,
      type: NodeType.Code
    },
    {
      id: "20241013163320988",
      name: "Code-5",
      position: {
        "x": 1397,
        "y": 392
      },
      width: 150,
      type: NodeType.Code
    },
    {
      id: "20241013163325692",
      name: "Route-4",
      position: {
        "x": 679,
        "y": 756
      },
      width: 150,
      type: NodeType.Route
    },
    {
      id: "20241013163328316",
      name: "Code-4",
      position: {
        "x": 1090,
        "y": 866
      },
      width: 150,
      type: NodeType.Code
    },
    {
      id: "20241013163329676",
      name: "Code-6",
      position: {
        "x": 1409,
        "y": 732
      },
      width: 150,
      type: NodeType.Code
    }
  ],
  selectedNodeId: null,
  selectedNodeContent: null,
  connections: [
    {
      id: "20241013161858875",
      "fromNode": {
        id: "0",
        name: "Server",
        position: {
          "x": 355,
          "y": 427
        },
        width: 150,
        type: NodeType.Server
      },
      "toNode": {
        id: "20241013161858875",
        name: "Api-1",
        position: {
          "x": 658,
          "y": 112
        },
        width: 150,
        type: NodeType.Route
      },
      "color": "rgb(139, 53, 192)"
    },
    {
      id: "20241013161900291",
      "fromNode": {
        id: "0",
        name: "Server",
        position: {
          "x": 355,
          "y": 427
        },
        width: 150,
        type: NodeType.Server
      },
      "toNode": {
        id: "1",
        name: "Api-2",
        position: {
          "x": 668,
          "y": 334
        },
        width: 150,
        type: NodeType.Route
      },
      "color": "rgb(139, 53, 192)"
    },
    {
      id: "20241013161902523",
      "fromNode": {
        id: "0",
        name: "Server",
        position: {
          "x": 355,
          "y": 427
        },
        width: 150,
        type: NodeType.Server
      },
      "toNode": {
        id: "20241013161902523",
        name: "Api-3",
        position: {
          "x": 662,
          "y": 522
        },
        width: 150,
        type: NodeType.Route
      },
      "color": "rgb(139, 53, 192)"
    },
    {
      id: "20241013162018070",
      "fromNode": {
        id: "20241013161858875",
        name: "Api-1",
        position: {
          "x": 658,
          "y": 112
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "20241013162018070",
        name: "Middleware-1",
        position: {
          "x": 938,
          "y": 275
        },
        width: 150,
        type: NodeType.Middleware
      },
      "color": "rgb(76, 175, 80)"
    },
    {
      id: "20241013162021486",
      "fromNode": {
        id: "1",
        name: "Api-2",
        position: {
          "x": 668,
          "y": 334
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "20241013162018070",
        name: "Middleware-1",
        position: {
          "x": 938,
          "y": 275
        },
        width: 150,
        type: NodeType.Middleware
      },
      "color": "rgb(76, 175, 80)"
    },
    {
      id: "20241013162028926",
      "fromNode": {
        id: "20241013161902523",
        name: "Api-3",
        position: {
          "x": 662,
          "y": 522
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "2",
        name: "Middleware-2",
        position: {
          "x": 897,
          "y": 672
        },
        width: 150,
        type: NodeType.Middleware
      },
      "color": "rgb(76, 175, 80)"
    },
    {
      id: "20241013162039710",
      "fromNode": {
        id: "20241013161902523",
        name: "Api-3",
        position: {
          "x": 662,
          "y": 522
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "3",
        name: "Code-3",
        position: {
          "x": 1147,
          "y": 632
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    },
    {
      id: "20241013162049279",
      "fromNode": {
        id: "1",
        name: "Api-2",
        position: {
          "x": 668,
          "y": 334
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "20241013162049278",
        name: "Code-2",
        position: {
          "x": 1099,
          "y": 465
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    },
    {
      id: "20241013162052711",
      "fromNode": {
        id: "20241013161858875",
        name: "Api-1",
        position: {
          "x": 658,
          "y": 112
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "20241013162052710",
        name: "Code-1",
        position: {
          "x": 1164,
          "y": 201
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    },
    {
      id: "20241013163320989",
      "fromNode": {
        id: "20241013162049278",
        name: "Code-2",
        position: {
          "x": 1099,
          "y": 465
        },
        width: 150,
        type: NodeType.Code
      },
      "toNode": {
        id: "20241013163320988",
        name: "Code-5",
        position: {
          "x": 1397,
          "y": 392
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    },
    {
      id: "20241013163322700",
      "fromNode": {
        id: "20241013162052710",
        name: "Code-1",
        position: {
          "x": 1164,
          "y": 201
        },
        width: 150,
        type: NodeType.Code
      },
      "toNode": {
        id: "20241013163320988",
        name: "Code-5",
        position: {
          "x": 1397,
          "y": 392
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    },
    {
      id: "20241013163325692",
      "fromNode": {
        id: "0",
        name: "Server",
        position: {
          "x": 355,
          "y": 427
        },
        width: 150,
        type: NodeType.Server
      },
      "toNode": {
        id: "20241013163325692",
        name: "Route-4",
        position: {
          "x": 679,
          "y": 756
        },
        width: 150,
        type: NodeType.Route
      },
      "color": "rgb(139, 53, 192)"
    },
    {
      id: "20241013163328316",
      "fromNode": {
        id: "20241013163325692",
        name: "Route-4",
        position: {
          "x": 679,
          "y": 756
        },
        width: 150,
        type: NodeType.Route
      },
      "toNode": {
        id: "20241013163328316",
        name: "Code-4",
        position: {
          "x": 1090,
          "y": 866
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    },
    {
      id: "20241013163329676",
      "fromNode": {
        id: "20241013163328316",
        name: "Code-4",
        position: {
          "x": 1090,
          "y": 866
        },
        width: 150,
        type: NodeType.Code
      },
      "toNode": {
        id: "20241013163329676",
        name: "Code-6",
        position: {
          "x": 1409,
          "y": 732
        },
        width: 150,
        type: NodeType.Code
      },
      "color": "rgb(192, 0, 38)"
    }
  ],
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
