export enum NodeType {
    Server = 'Server',
    Route = 'Route',
    Middleware = 'Middleware'
}

export interface Node {
    name: string;
    position: { x: number, y: number };
    width: number;
    type: NodeType;

}

export interface CodeNode {
    id: string;
    name: string;
    type: NodeType;
    content: string,
}


export interface AppState {
    nodes: CodeNode[];
    selectedNodeId: string | null;
}