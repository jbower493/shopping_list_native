import { GestureResponderEvent, Pressable, StyleProp, Text, ViewStyle } from 'react-native'
import { semantic } from '../designTokens'

type LinkProps = {
    onPress?: (event: GestureResponderEvent) => void
    children: React.JSX.Element | string
    style?: StyleProp<ViewStyle>
}

export function Link({ children, onPress, style }: LinkProps) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, style]}>
            {typeof children === 'string' ? <Text style={{ color: semantic.colorTextInfo }}> {children}</Text> : children}
        </Pressable>
    )
}
