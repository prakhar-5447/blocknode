export enum NodeType {
    Server = 'Server',
    Route = 'Route',
    Middleware = 'Middleware',
    Code = 'Code'
}

export interface Node {
    id: string;
    name: string;
    position: { x: number, y: number };
    width: number;
    type: NodeType;
}