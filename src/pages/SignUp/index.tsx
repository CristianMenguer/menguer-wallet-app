import React, { useCallback, useRef } from 'react'
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import { useNavigation } from '@react-navigation/native'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import { Container, Title, BackToSignInButton, BackToSignInText } from './styles'
import getValidationErrors from '../../utils/getValidationErros'
import { showToast } from '../../utils/ShowToast'

interface SignUpFormData {
    fullname: string
    username: string
    email: string
    password: string
    confirm_password: string
}

const SignUp: React.FC = () => {

    const formRef = useRef<FormHandles>(null)
    const usernameRef = useRef<TextInput>(null)
    const emailRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)
    const confirmPasswordRef = useRef<TextInput>(null)

    const navigation = useNavigation()

    const handleSignUp = useCallback(async (data: SignUpFormData) => {
        try {

            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                fullname: Yup.string().required('Name is required'),
                username: Yup.string().required('Username is required'),
                email: Yup.string().required('Email is required').email('Email not valid'),
                password: Yup.string().min(6, 'Password must be at least six characters'),
                confirm_password: Yup.string().min(6, 'At least six characters').oneOf([Yup.ref('password'), null], 'Passwords must match')

            })

            await schema.validate(data, {
                abortEarly: false
            })

            // await api.post('/user', data)

            // addToast({
            //     type: 'success',
            //     title: 'User created!',
            //     description: 'Please, logon to continue!'
            // })

            // history.push('/')

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors)
                //
                if (errors.fullname)
                    showToast(errors.fullname)
                else if (errors.username)
                    showToast(errors.username)
                else if (errors.email)
                    showToast(errors.email)
                else if (errors.password)
                    showToast(errors.password)
                else if (errors.confirm_password)
                    showToast(errors.confirm_password)
                //
                return
            }

            // addToast({
            //     type: 'error',
            //     title: 'Sign up error',
            //     description: 'Please, try again!'
            // })
        }
    }, [])

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                enabled
            >
                <ScrollView
                    //contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps='handled'
                >
                    <Container >
                        <Image source={logoImg} />

                        <View >
                            <Title >Let's get started!</Title>
                        </View>

                        <Form onSubmit={handleSignUp} ref={formRef} style={{ width: '100%' }} >
                            <Input
                                name={'fullname'}
                                icon={'smile'}
                                placeholder='Full Name'
                                autoCapitalize='words'
                                returnKeyType='next'
                                onSubmitEditing={() => usernameRef.current?.focus()}
                            />

                            <Input
                                name={'username'}
                                icon={'user'}
                                placeholder='Username'
                                returnKeyType='next'
                                ref={usernameRef}
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />

                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType='email-address'
                                name={'email'}
                                icon={'mail'}
                                placeholder='E-mail'
                                returnKeyType='next'
                                ref={emailRef}
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />

                            <Input
                                name={'password'}
                                icon={'lock'}
                                placeholder='Password'
                                secureTextEntry
                                textContentType='newPassword'
                                returnKeyType='next'
                                ref={passwordRef}
                                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                            />

                            <Input
                                name={'confirm_password'}
                                icon={'lock'}
                                placeholder='Confirm Password'
                                textContentType='newPassword'
                                secureTextEntry
                                returnKeyType='send'
                                ref={confirmPasswordRef}
                                onSubmitEditing={() => formRef.current?.submitForm()}
                            />

                            <Button onPress={() => formRef.current?.submitForm()} >Create Account</Button>
                        </Form>

                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>

            <BackToSignInButton onPress={() => navigation.goBack()} >
                <Icon name='arrow-left' size={20} color='#ff9000' />
                <BackToSignInText >Back to Sign In</BackToSignInText>
            </BackToSignInButton>
        </>
    )
}

export default SignUp
