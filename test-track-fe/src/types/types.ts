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

/**
 * For every model, the optional relationships are listed after the updated_at.
 */
export interface Test {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    test_code: string;
    created_at: string;
    updated_at: string;

    questions?: QuestionType[];
    attempts?: TestAttempt[];
}

export interface QuestionType {
    id: number;
    test_id: number;
    text: string;
    image_path?: string;
    allows_multiple_correct: boolean;
    question_order?: number;
    created_at: string;
    updated_at: string;

    answer_options?: AnswerOption[];
}

export interface AnswerOption {
    id: number;
    question_id: number;
    text: string;
    is_correct?: boolean;
    answer_order?: number;
    created_at: string;
    updated_at: string;
}

export interface TestAttempt {
    id: number;
    user_id: number;
    test_id: number;
    score_percentage?: number;
    comment?: string;
    started_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    user_answers?: UserAnswer[];
}

export interface UserAnswer {
    id: number;
    test_attempt_id: number;
    question_id: number;
    answer_option_id: number;
    is_correct?: boolean;
    comment?: string;
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

/**
 * These are the query parameters that can be sent to the backend when fetching tests, for the
 * Tests.vue.
 * They are needed for the search, sort, paginate features.
 */
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





