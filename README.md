



erDiagram

    USER ||--o{ TEST : creates
    USER ||--o{ TEST_ATTEMPT : performs

    TEST ||--o{ QUESTION : contains
    TEST ||--o{ TEST_ATTEMPT : has

    QUESTION ||--o{ ANSWER_OPTION : has
    QUESTION ||--o{ USER_ANSWER : receives

    ANSWER_OPTION ||--o{ USER_ANSWER : selected_as

    TEST_ATTEMPT ||--o{ USER_ANSWER : contains


    USER {
        bigint id
        string name
        string email
        string password
    }

    TEST {
        bigint id
        bigint user_id
        string title
        string test_code
    }

    QUESTION {
        bigint id
        bigint test_id
        text text
    }

    ANSWER_OPTION {
        bigint id
        bigint question_id
        string text
        boolean is_correct
    }

    TEST_ATTEMPT {
        bigint id
        bigint user_id
        bigint test_id
        integer score
        timestamp completed_at
    }

    USER_ANSWER {
        bigint id
        bigint test_attempt_id
        bigint question_id
        bigint answer_option_id
    }

