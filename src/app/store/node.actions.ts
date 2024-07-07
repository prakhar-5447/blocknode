import { createAction, props } from '@ngrx/store';
import { Node } from '../models/node.model';
import { Connection } from '../models/connection.model';

export const addNode = createAction('[Node] Add Node', props<{ node: Node }>());
export const updateNodeContent = createAction('[Node] Update Content', props<{ id: string; content: string }>());
export const updateNodePosition = createAction('[Node] Update Node Position', props<{ name: string, position: { x: number, y: number } }>());
export const updateConnectionPosition = createAction('[Node] Update Connection Position', props<{ name: string, position: { x: number, y: number } }>());
export const getNodePosition = createAction('[Node] GET Node Position', props<{ name: string }>());
export const selectNode = createAction('[Node] Select', props<{ id: string }>());
export const deselectNode = createAction('[Node] Deselect');
export const addConnection = createAction('[Connection] Add Connection', props<{ connection: Connection }>());