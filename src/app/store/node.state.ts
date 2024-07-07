import { Connection } from "../models/connection.model";
import { Node } from "../models/node.model";

export interface AppState {
    nodes: Node[];
    selectedNodeId: string | null;
    connections: Connection[];
}