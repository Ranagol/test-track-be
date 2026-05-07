
export const emailRules = [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
    { min: 8, max: 254, message: 'Email should be min. 8 characters.', trigger: 'blur' }
];

export const passwordRules = [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, max: 255, message: 'Password should be min. 8 characters.', trigger: 'blur' }
];
