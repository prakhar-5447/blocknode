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