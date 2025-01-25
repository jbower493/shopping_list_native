import { GestureResponderEvent, Pressable, StyleProp, ViewStyle } from 'react-native'

type LinkProps = {
    onPress?: (event: GestureResponderEvent) => void
    children: React.JSX.Element
    style?: StyleProp<ViewStyle>
}

export function Link({ children, onPress, style }: LinkProps) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, style]}>
            {children}
        </Pressable>
    )
}
