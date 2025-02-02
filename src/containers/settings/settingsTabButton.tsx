import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'
import { Menu } from '../../components/Menu'
import { semantic } from '../../designTokens'
import { useNavigation } from '@react-navigation/native'

export const SettingsTabButton = ({ onPress, children }: BottomTabBarButtonProps) => {
    const navigation = useNavigation()

    return (
        <Menu
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            title='More Recipe Options'
            onSelect={(selectedAction) => {
                switch (selectedAction) {
                    case 'account':
                        navigation.navigate('Settings', { screen: 'Account' })
                        break
                    case 'manageItems':
                        navigation.navigate('Settings', { screen: 'Items' })
                        break
                    case 'manageItemCategories':
                        navigation.navigate('Settings', { screen: 'Categories' })
                        break
                    case 'manageRecipeCategories':
                        navigation.navigate('Settings', { screen: 'RecipeCategories' })
                        break
                    default:
                        break
                }
            }}
            actions={[
                {
                    id: 'account',
                    title: 'My Account',
                    titleColor: semantic.colorTextDefault,
                    image: Platform.select({
                        ios: 'person.fill',
                        android: 'ic_menu_preferences'
                    }),
                    imageColor: semantic.colorTextPrimary
                },
                {
                    id: 'manageItems',
                    title: 'Manage Items',
                    titleColor: semantic.colorTextDefault
                },
                {
                    id: 'manageItemCategories',
                    title: 'Manage Item Categories',
                    titleColor: semantic.colorTextDefault
                },
                {
                    id: 'manageRecipeCategories',
                    title: 'Manage Recipe Categories',
                    titleColor: semantic.colorTextDefault
                }
            ]}
        >
            {children}
        </Menu>
    )
}
