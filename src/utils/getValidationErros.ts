import { ValidationError } from 'yup'

interface Errors {
    [key: string]: string;
}

// The errors are validated here

export default function getValidationErrors(err: ValidationError): Errors {
    const validationErrors: Errors = {}

    err.inner.forEach((error) => {
        // @ts-ignore
        validationErrors[error.path] = error.message
    })

    return validationErrors
}
