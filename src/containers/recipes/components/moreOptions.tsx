import { Platform, View } from 'react-native'
import { Menu } from '../../../components/Menu'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'

export function MoreOptions() {
    return (
        <Menu
            title='Uncle Bob'
            onSelect={(selectedAction) => {
                switch (selectedAction) {
                    case 'duplicate':
                        // TODO: do something
                        break
                    case 'share':
                        // TODO: do something
                        break
                    default:
                        break
                }
            }}
            actions={[
                {
                    id: 'duplicate',
                    title: 'Duplicate',
                    titleColor: semantic.colorTextDefault,
                    image: Platform.select({
                        ios: 'doc.on.doc',
                        android: 'ic_menu_set_as'
                    }),
                    imageColor: semantic.colorTextPrimary
                },
                {
                    id: 'share',
                    title: 'Share',
                    titleColor: semantic.colorTextDefault,
                    image: Platform.select({
                        ios: 'square.and.arrow.up',
                        android: 'ic_menu_share'
                    }),
                    imageColor: semantic.colorTextPrimary
                }
            ]}
        >
            <View>
                <MaterialCommunityIcon name='dots-horizontal-circle-outline' size={22} color={semantic.colorTextPrimary} />
            </View>
        </Menu>
    )
}
