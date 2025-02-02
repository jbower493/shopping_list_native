import { MenuAction, MenuView } from '@react-native-menu/menu'
import { StyleProp, ViewStyle } from 'react-native'

type MenuProps = {
    title?: string
    actions: MenuAction[]
    onSelect: (optionId: string) => void
    children: React.ReactNode
    style?: StyleProp<ViewStyle>
}

// Action system image lists
// Android: https://developer.android.com/reference/android/R.drawable
// IOS: https://developer.apple.com/sf-symbols/

export function Menu({ title, actions, onSelect, children, style }: MenuProps) {
    return (
        <MenuView
            style={style}
            title={title}
            onPressAction={({ nativeEvent }) => {
                onSelect(nativeEvent.event)
            }}
            actions={actions}
            shouldOpenOnLongPress={false}
        >
            {children}
        </MenuView>
    )
}
