

export const testRules = {
    title: [
        { required: true, message: 'Test title is required', trigger: 'blur' },
        { min: 3, max: 100, message: 'Test title must be between 3 and 100 characters', trigger: 'blur' }
    ],
    description: [
        { required: true, message: 'Test description is required', trigger: 'blur' },
        { min: 10, max: 500, message: 'Test description must be between 10 and 500 characters', trigger: 'blur' }
    ],

};

// export const questionRules = [
//     { required: true, message: 'Question text is required', trigger: 'blur' },
//     { min: 5, max: 200, message: 'Question text must be between 5 and 200 characters', trigger: 'blur' }
// ];



// export const questionRules = {
//     text: [
//         { required: true, message: 'Question text is required', trigger: 'blur' },
//         { min: 5, max: 200, message: 'Question text must be between 5 and 200 characters', trigger: 'blur' }
//     ]
// };

export const questionRules = [
    { required: true, message: 'Question text is required', trigger: 'blur' },

    // {
    //     validator: (_rule, question, callback) => {

    //         const options = question.answer_options;

    //         if (!Array.isArray(options) || options.length < 2) {
    //             callback(new Error('At least 2 answer options are required'));
    //             return;
    //         }

    //         if (options.some(o => !o.text?.trim())) {
    //             callback(new Error('All answer options must have text'));
    //             return;
    //         }

    //         const hasCorrectAnswer = options.some(o => o.is_correct === true);

    //         if (!hasCorrectAnswer) {
    //             callback(new Error('Please select a correct answer'));
    //             return;
    //         }

    //         callback();
    //     },
    //     trigger: 'change',
    // }
];
