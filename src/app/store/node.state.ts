import { Connection } from "../models/connection.model";
import { EnvVariable } from "../models/env.model";
import { Node } from "../models/node.model";

export interface AppState {
    nodes: Node[];
    selectedNodeId: string | null;
    selectedNodeContent: Node | null,
    connections: Connection[];
    envVariables: EnvVariable[];
}