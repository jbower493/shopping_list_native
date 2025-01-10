import { GestureResponderEvent, Button as RNButton } from 'react-native'

type ButtonProps = {
    color: string
    title: string
    onPress?: ((event: GestureResponderEvent) => void) | undefined
}

export function Button({ color, title, onPress }: ButtonProps) {
    return <RNButton color={color} title={title} onPress={onPress} />
}
