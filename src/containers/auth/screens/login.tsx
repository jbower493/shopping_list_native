import { Pressable, StyleSheet, Text, View } from 'react-native'
import { semantic } from '../../../designTokens'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { Input } from '../../../components/Form/Input'
import * as z from 'zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormRow } from '../../../components/Form/FormRow'
import { useQueryClient } from '@tanstack/react-query'
import { storeToken } from '../../../queries/utils/tokenStorage'
import { useNavigation } from '@react-navigation/native'
import { Link } from '../../../components/Link'

type Inputs = {
    email: string
    password: string
}

const schema = z.object({
    email: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required')
})

export function LoginScreen() {
    const queryClient = useQueryClient()
    const navigation = useNavigation()

    const { mutateAsync: login } = query.auth.login.useMutation()

    const methods = useForm<Inputs>({
        mode: 'all',
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const {
        handleSubmit,
        formState: { isSubmitting, isValid }
    } = methods

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await login(data, {
            onSuccess: async (response) => {
                if (response.data) {
                    await storeToken(response.data?.token)
                }

                queryClient.invalidateQueries({ queryKey: query.auth.user.queryKey })
            }
        })
    }

    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <FormProvider {...methods}>
                    <Text style={styles.heading}>Login</Text>
                    <FormRow>
                        <Input.HookForm label='Email' name='email' inputMode='email' />
                    </FormRow>
                    <FormRow>
                        <Input.HookForm label='Password' name='password' secureTextEntry />
                    </FormRow>
                    <View style={styles.buttonView}>
                        <Button isLoading={isSubmitting} isDisabled={!isValid} color='primary' onPress={handleSubmit(onSubmit)}>
                            Login
                        </Button>
                    </View>
                    <Link style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                        Register
                    </Link>
                </FormProvider>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: 300,
        borderWidth: 1,
        borderColor: semantic.colorBorderPrimary,
        borderRadius: semantic.borderRadiusDefault,
        padding: 20
    },
    heading: {
        fontSize: 22,
        fontWeight: 600,
        textAlign: 'center'
    },
    buttonView: {
        marginTop: 10
    },
    registerLink: {
        marginTop: 20
    }
})
