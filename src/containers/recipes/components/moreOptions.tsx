import { Platform, View } from 'react-native'
import { Menu } from '../../../components/Menu'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'

// TODO: need to find the lists of all available icon names on ios and android. This post has some stuff about it: https://stackoverflow.com/questions/47181993/list-of-available-icons

export function MoreOptions() {
    return (
        <Menu
            title='Uncle Bob'
            onSelect={() => {}}
            actions={[
                {
                    id: 'duplicate',
                    title: 'Duplicate',
                    titleColor: '#2367A2',
                    // image: Platform.select({
                    //     ios: 'doc.on.doc',
                    //     android: 'content_copy'
                    // }),
                    image: 'ic_menu_share',
                    imageColor: '#2367A2'
                },
                {
                    id: 'share',
                    title: 'Share Action',
                    titleColor: '#46F289',
                    subtitle: 'Share action on SNS',
                    image: Platform.select({
                        ios: 'square.and.arrow.up',
                        android: 'ic_menu_share'
                    }),
                    imageColor: '#46F289'
                }
            ]}
        >
            <View>
                <MaterialCommunityIcon name='dots-horizontal-circle-outline' size={22} color={semantic.colorTextPrimary} />
            </View>
        </Menu>
    )
}
