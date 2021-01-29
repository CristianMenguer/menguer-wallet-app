import React, { useCallback, useRef } from 'react'
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidationErrors from '../../utils/getValidationErros'
import useAuth from '../../hooks/auth'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import { Container, Title, ForgotPasswordButton, ForgotPasswordText, CreateAccountButton, CreateAccountText } from './styles'
import { showToast } from '../../utils/ShowToast'
import { AxiosError } from 'axios'
import { dropTablesDB, createTablesDB } from '../../database'
import { colors } from '../../constants/colors'

interface SignInFormData {
    email: string
    password: string
}

const SignIn: React.FC = () => {

    const formRef = useRef<FormHandles>(null)
    const passwordRef = useRef<TextInput>(null)

    const { signIn } = useAuth()

    const navigation = useNavigation()

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {

            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                email: Yup.string().required('Email is required').email('Email not valid'),
                password: Yup.string().required('Password is required')

            })

            await schema.validate(data, {
                abortEarly: false
            })

            const { email, password } = data

            await signIn({
                email,
                password
            })

            await dropTablesDB()
            await createTablesDB()

            // history.push('/dashboard')

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors)
                //
                if (errors.email)
                    showToast(errors.email)
                else if (errors.password)
                    showToast(errors.password)
                //
                return
            }

            if (!!err.response?.data?.message) {
                showToast(err.response.data.message)
                return
            }


            Alert.alert('Authentication error', 'Please, try again!')

        }
    }, [signIn])

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                enabled
            >
                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps='handled'
                >
                    <Container >
                        <Image source={logoImg} />

                        <View >
                            <Title >Please, sign in to continue.</Title>
                        </View>

                        <Form onSubmit={handleSignIn} ref={formRef} style={{ width: '100%' }} >

                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                keyboardType='email-address'
                                name={'email'}
                                icon={'mail'}
                                placeholder='E-mail'
                                returnKeyType='next'
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />
                            <Input
                                ref={passwordRef}
                                name={'password'}
                                icon={'lock'}
                                placeholder='Password'
                                secureTextEntry
                                returnKeyType='send'
                                onSubmitEditing={() => formRef.current?.submitForm()}
                            />

                            <Button onPress={() => formRef.current?.submitForm()} >Log In</Button>
                        </Form>



                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>

            <CreateAccountButton onPress={() => navigation.navigate('SignUp')} >
                <Icon name='log-in' size={20} color={colors.orange} />
                <CreateAccountText >Create Account</CreateAccountText>
            </CreateAccountButton>
        </>
    )
}

export default SignIn
