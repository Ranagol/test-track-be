
export const nameRules = [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { min: 3, max: 255, message: 'Name should be min. 3 characters.', trigger: 'blur' }
];

export const emailRules = [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
    { min: 8, max: 254, message: 'Email should be min. 8 characters.', trigger: 'blur' }
];

export const passwordRules = [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, max: 255, message: 'Password should be min. 8 characters.', trigger: 'blur' }
];

/**
 * Create a password confirmation validator that compares against the password field
 * This is a factory function because it needs access to the form data.
 *
 */
export const createPasswordConfirmationRules = (formData: { password: string }) => [
    { required: true, message: 'Password confirmation is required', trigger: 'blur' },
    { min: 8, max: 255, message: 'Password should be min. 8 characters.', trigger: 'blur' },

    /**
     * This is a custom validatior, that compares password and password_confirmation
     */
    {
        validator: (
            _rule: unknown,
            value: string,
            callback: (error?: Error) => void
        ) => {
                if (!value) {
                    callback(new Error('Password confirmation is required'));
                } else if (value !== formData.password) {
                    callback(new Error('Passwords do not match'));
                } else {
                    callback();
                }
        },
        trigger: 'blur'
    }
];
