export enum NodeType {
    Server = 'Server',
    Route = 'Route',
    Middleware = 'Middleware',
    Code = 'Code'
}

export enum Enviroment {
    Production = 'Production',
    Development = 'Development'
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
    enviroment?: Enviroment;
}