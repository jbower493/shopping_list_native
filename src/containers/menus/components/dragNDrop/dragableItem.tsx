import { ReactNode } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

type OnDrop = (finalX: number, finalY: number) => void

export function DragableItem({ children, onDrop }: { children: ReactNode; onDrop: OnDrop }) {
    const isPressed = useSharedValue(false)
    const offset = useSharedValue({ x: 0, y: 0 })

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }, { scale: withSpring(isPressed.value ? 1.3 : 1) }]
        }
    })

    const start = useSharedValue({ x: 0, y: 0 })
    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = true
        })
        .onUpdate((e) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y
            }
        })
        .onEnd((e) => {
            offset.value = {
                x: 0,
                y: 0
            }

            onDrop(e.absoluteX, e.absoluteY)
        })
        .onFinalize(() => {
            isPressed.value = false
        })
        .runOnJS(true)

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={animatedStyles}>{children}</Animated.View>
        </GestureDetector>
    )
}
