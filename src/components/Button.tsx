import { GestureResponderEvent, Button as RNButton } from 'react-native'
import { semantic } from '../designTokens'

type ButtonProps = {
    title: string
    color?: string
    onPress?: ((event: GestureResponderEvent) => void) | undefined
    isDisabled?: boolean
    isLoading?: boolean
}

export function Button({ color = semantic.colorBackgroundPrimary, title, onPress, isDisabled, isLoading }: ButtonProps) {
    return <RNButton disabled={isDisabled || isLoading} color={color} title={isLoading ? 'Loading...' : title} onPress={onPress} />
}
