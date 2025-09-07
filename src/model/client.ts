import {Role} from "./role";

export interface Client {
    id: string,
    name: string,
    role: Role,
    location: string,
    socketId?: string
}

