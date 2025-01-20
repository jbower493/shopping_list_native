import { GestureResponderEvent, Button as RNButton } from 'react-native'

type ButtonProps = {
    color: string
    title: string
    onPress?: ((event: GestureResponderEvent) => void) | undefined
    isDisabled?: boolean
    isLoading?: boolean
}

export function Button({ color, title, onPress, isDisabled, isLoading }: ButtonProps) {
    return <RNButton disabled={isDisabled || isLoading} color={color} title={isLoading ? 'Loading...' : title} onPress={onPress} />
}
