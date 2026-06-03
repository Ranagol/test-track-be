const testRules = {
    title: [
        { required: true, message: 'Test title is required', trigger: 'blur' },
        { min: 3, max: 100, message: 'Test title must be between 3 and 100 characters', trigger: 'blur' }
    ],
    description: [
        { required: true, message: 'Test description is required', trigger: 'blur' },
        { min: 10, max: 500, message: 'Test description must be between 10 and 500 characters', trigger: 'blur' }
    ]
};

export default testRules;
