import { Node } from "./node.model";

export interface Connection {
    id: string;
    fromNode: Node;
    toNode: Node;
    color: string;
}