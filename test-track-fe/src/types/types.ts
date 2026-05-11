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

export interface Test {
    id: number;
    user_id: number;
    title: string;
    questions?: QuestionType[];
    description?: string;
    test_code: string;
    created_at: string;
    updated_at: string;
}

export interface QuestionType {
    id: number;
    test_id: number;
    text: string;
    image_path?: string;
    allows_multiple_correct: boolean;
    answer_options?: AnswerOption[];
    question_order?: number;
    created_at: string;
    updated_at: string;
}

export interface AnswerOption {
    id: number;
    question_id: number;
    text: string;
    is_correct: boolean;
    answer_order?: number;
    created_at: string;
    updated_at: string;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    path: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface TestQueryParams {
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface TableSortData {
    // This is the sortBy field name, e.g. 'title', 'created_at', etc.
    prop: string | null;
    order: 'ascending' | 'descending' | null;
    column?: any;
}



