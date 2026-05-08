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

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

/**
 * BackendError object will have string keys (field names) and array of string values
 * (error messages for that field).
 */
export type BackendError = {
    [field: string]: string[]
}
