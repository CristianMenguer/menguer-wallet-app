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

// returns the first error message from a list of errors
export const getFirstErrorMessage = (errors: Errors): string => {
    if (!errors)
        return ''
    //
    const values = Object.values(errors)
    if (!values || values.length < 1)
        return ''
    //
    return values[0]
}
