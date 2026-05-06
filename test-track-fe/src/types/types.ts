/**
 * All interfaces and types used in the project should be defined here. This file serves as a
 * central place for all type definitions.
 */

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}
