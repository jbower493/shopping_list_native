import { StyleSheet, Text, View } from 'react-native'
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
                queryClient.invalidateQueries({ queryKey: query.auth.user.queryKey })

                if (response.data) {
                    await storeToken(response.data?.token)
                }
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
                        <Button
                            isLoading={isSubmitting}
                            isDisabled={!isValid}
                            color={semantic.colorBackgroundPrimary}
                            title='Login'
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
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
    }
})
