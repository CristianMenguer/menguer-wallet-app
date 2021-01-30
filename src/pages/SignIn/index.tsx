//This is the Sign In page.
import React, { useCallback, useRef } from 'react'
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidationErrors, { getFirstErrorMessage } from '../../utils/getValidationErros'
import useAuth from '../../hooks/auth'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import { Container, Title, CreateAccountButton, CreateAccountText } from './styles'
import { showToast } from '../../utils/ShowToast'
import { colors } from '../../constants/colors'
import { createTablesDB, dropTablesDB } from '../../database'

// interface used to receive the data from the form when submitted
interface SignInFormData {
    email: string
    password: string
}

const SignIn: React.FC = () => {

    const formRef = useRef<FormHandles>(null)
    const passwordRef = useRef<TextInput>(null)

    const { signIn } = useAuth()

    const navigation = useNavigation()

    // function called when the form is submitted
    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {

            formRef.current?.setErrors({})

            // schema that validates the data
            const schema = Yup.object().shape({
                email: Yup.string().required('Email is required').email('Email not valid'),
                password: Yup.string().required('Password is required')

            })

            await schema.validate(data, {
                abortEarly: false
            })

            const { email, password } = data

            // sign in function from context
            await signIn({
                email,
                password
            })

            // if signed in, create all tables ang navigate to dashboard
            await dropTablesDB()
            await createTablesDB()

            navigation.navigate('/dashboard')

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
            }

            if (!!err.response?.data?.message) {
                showToast(err.response.data.message)
                return
            }


            Alert.alert('Authentication error', 'Please, try again!')

        }
    }, [signIn])


    /**
     * The page itself.
     * Logo + Form + 'Create Account' Button
     */
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
