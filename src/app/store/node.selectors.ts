import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './node.state';

const selectAppState = createFeatureSelector<AppState>('appState');


export const selectNodes = createSelector(
  selectAppState,
  (state) => state?.nodes ?? []
);

export const selectConnections = createSelector(
  selectAppState,
  (state) => state?.connections ?? []
);

export const selectSelectedNodeId = createSelector(
  selectAppState,
  (state) => state?.selectedNodeId ?? null
);

export const selectSelectedNodeContent = createSelector(
  selectAppState,
  (state) => state?.selectedNodeContent ?? null
);

export const selectSelectedConnection = createSelector(
  selectAppState,
  (state) => state?.selectConnection ?? null
);

// ✅ safe composite selector
export const selectSelectedNode = createSelector(
  selectNodes,
  selectSelectedNodeId,
  (nodes, selectedNodeId) => nodes.find(node => node.id === selectedNodeId) ?? null
);

export const selectEnv = createSelector(
  selectAppState,
  (state) => state.envVariables
);