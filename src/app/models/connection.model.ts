import { Node } from "./node.model";

export interface Connection {
    fromNode: Node;
    toNode: Node;
    color: string;
}