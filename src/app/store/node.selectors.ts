import { createSelector } from '@ngrx/store';
import { AppState } from './node.state';

export const selectNodes = (state: { appState: AppState }) => state.appState.nodes;
export const selectSelectedNodeContent = (state: { appState: AppState }) => state.appState.selectedNodeContent;
export const selectSelectedNodeId = (state: { appState: AppState }) => state.appState.selectedNodeId;
export const selectConnections = (state: { appState: AppState }) => state.appState.connections;

export const selectSelectedNode = createSelector(
  selectNodes,
  selectSelectedNodeId,
  (nodes, selectedNodeId) => nodes.find(node => node.id === selectedNodeId)
);
