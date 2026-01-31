const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = ({
                                     name,
                                     email,
                                     password,

                                 }: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
        errors.name = "Імʼя має містити мінімум 2 символи";
    }

    if (!emailRegex.test(email)) {
        errors.email = "Некоректний email";
    }

    if (password.length < 6) {
        errors.password = "Пароль має містити мінімум 6 символів";
    }

    return errors;
};
