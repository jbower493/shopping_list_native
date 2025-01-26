import { MenuAction, MenuView } from '@react-native-menu/menu'

type MenuProps = {
    title?: string
    actions: MenuAction[]
    onSelect: (optionId: string) => void
    children: React.JSX.Element
}

export function Menu({ title, actions, onSelect, children }: MenuProps) {
    return (
        <MenuView
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
