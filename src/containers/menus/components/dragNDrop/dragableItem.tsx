import { ReactNode } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

type OnDrop = (finalX: number, finalY: number) => boolean
type DragableItemProps = { children: ReactNode; onDrop: OnDrop; setIsBeingDragged: (newIsPressed: boolean) => void }

export function DragableItem({ children, onDrop, setIsBeingDragged }: DragableItemProps) {
    const offset = useSharedValue({ x: 0, y: 0 })
    const isPressed = useSharedValue(false)

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }, { scale: withSpring(isPressed.value ? 1.2 : 1) }]
        }
    })

    const start = useSharedValue({ x: 0, y: 0 })
    const gesture = Gesture.Pan()
        .onBegin(() => {
            isPressed.value = true
            setIsBeingDragged(true)
        })
        .onUpdate((e) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y
            }
        })
        .onFinalize((e) => {
            const isDropTargetHit = onDrop(e.absoluteX, e.absoluteY)

            if (!isDropTargetHit) {
                offset.value = {
                    x: 0,
                    y: 0
                }
            }

            isPressed.value = false
            setIsBeingDragged(false)
        })
        .runOnJS(true)

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[animatedStyles, { zIndex: 1 }]}>{children}</Animated.View>
        </GestureDetector>
    )
}
