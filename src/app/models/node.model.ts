export enum NodeType {
    Server = 'Server',
    Route = 'Route',
    Middleware = 'Middleware'
}

export interface Node {
    id: string;
    name: string;
    position: { x: number, y: number };
    width: number;
    type: NodeType;
    content?: string;
    port?: number;
    dbUrl?: string;
}