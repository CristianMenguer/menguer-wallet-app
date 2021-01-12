import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react'
import { TextInputProps } from 'react-native'
import { useField } from '@unform/core'

import { Container, TextInput, Icon } from './styles'

interface InputProps extends TextInputProps {
    name: string
    icon: string
}

interface InputValueReference {
    value: string
}

interface InputRef {
    focus(): void
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = ({ name, icon, ...rest }, ref) => {

    const inputElementRef = useRef<any>(null)
    const { registerField, defaultValue = '', fieldName, error } = useField(name)
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue })

    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)

    const handleInputFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleInputBlur = useCallback(() => {
        setIsFocused(false)
        setIsFilled(!!inputValueRef.current.value)
    }, [])

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus()
        }
    }))

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value: string) {
                inputValueRef.current.value = value
                inputElementRef.current.setNativeProps({ text: value })
            },
            clearValue() {
                inputValueRef.current.value = ''
                inputElementRef.current.clear()
            }
        })
    }, [fieldName, registerField])

    return (
        <Container isFocused={isFocused} isErrored={!!error} >
            <Icon
                name={icon}
                size={20}
                color={isFocused ? '#ff9000' : (
                    !!error ? '#c53030' : (
                        isFilled ? '#ff9000' : '#8B8B89'))}
            />

            <TextInput
                ref={inputElementRef}
                placeholderTextColor='#8B8B89'
                defaultValue={defaultValue}
                onChangeText={value => inputValueRef.current.value = value}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                {...rest}
            />
        </Container>
    )
}

export default forwardRef(Input)
