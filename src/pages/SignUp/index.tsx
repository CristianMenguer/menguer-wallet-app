//This is the Sign Up page.
import React, { useCallback, useRef } from 'react'
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import { useNavigation } from '@react-navigation/native'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import api from '../../services/api'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import { Container, Title, BackToSignInButton, BackToSignInText } from './styles'
import getValidationErrors, { getFirstErrorMessage } from '../../utils/getValidationErros'
import { showToast } from '../../utils/ShowToast'
import { colors } from '../../constants/colors'
import { sleep } from '../../utils/Utils'

// interface used to receive the data from the form when submitted
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

            // schema that validates the data
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

            await api.post('/users', data)

            // if user created, shows the message and redirect to sign in page
            showToast('User created. Please, sign in to continue!')

            sleep(100)
            navigation.goBack()

        } catch (err) {
            // Errors are handled here and shown to the user
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors)
                //
                const errorMessage = getFirstErrorMessage(errors)
                if (!!errorMessage)
                    showToast(errorMessage)
                //
                return
            } else {
                console.log(err)
            }

            if (!!err.response?.data?.message) {
                showToast(err.response.data.message)
                return
            }

            showToast('Sign up error. Please, try again!')

        }
    }, [navigation])

    /**
     * The page itself.
     * Logo + Form + 'Back to Sign In' Button
     */
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
                                autoCapitalize='none'
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
                <Icon name='arrow-left' size={20} color={colors.orange} />
                <BackToSignInText >Back to Sign In</BackToSignInText>
            </BackToSignInButton>
        </>
    )
}

export default SignUp
