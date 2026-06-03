
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
 * Create a password confirmation validator that compares against the password field.
 * Needed for registration.
 */
export const createPasswordConfirmationRules = (formData: { password: string }) => [
    { required: true, message: 'Password confirmation is required', trigger: 'blur' },
    { min: 8, max: 255, message: 'Password should be min. 8 characters.', trigger: 'blur' },

    /**
     * This is a custom validatior, that compares password and password_confirmation
     * validator: this tells E+ to use custom validation logic, instead of built-in rules
     * (_rule: unknown, value: string) => { -- this is the validation function, it is called
     * automatically when validation runs.
     * _rule: unknown -- we do not use this here at all
     */
    {
        validator: (_rule: unknown, password_confirmation: string) => {

            // If password confirmation does not match...
            if (password_confirmation !== formData.password) {
                return Promise.reject(new Error('Passwords do not match'))
            }

            return Promise.resolve()
        },
        trigger: 'blur',
    }
];
