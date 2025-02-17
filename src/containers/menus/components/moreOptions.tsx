import { Platform, View } from 'react-native'
import { Menu } from '../../../components/Menu'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'

import { useState } from 'react'
import { Menu as TMenu } from '../../../queries/menus/types'

type MoreOptionsProps = {
    menuId: TMenu['id']
    menuName: TMenu['name']
}

export function MoreOptions({ menuId, menuName }: MoreOptionsProps) {
    const [isRandomRecipesOpen, setIsRandomRecipesOpen] = useState(false)

    return (
        <Menu
            title='More Menu Options'
            onSelect={(selectedAction) => {
                switch (selectedAction) {
                    case 'randomRecipes':
                        setIsRandomRecipesOpen(true)
                        break
                    default:
                        break
                }
            }}
            actions={[
                {
                    id: 'randomRecipes',
                    title: 'Random Recipes',
                    titleColor: semantic.colorTextDefault,
                    image: Platform.select({
                        ios: 'shuffle',
                        android: 'ic_menu_agenda'
                    }),
                    imageColor: semantic.colorTextPrimary
                }
            ]}
        >
            <View>
                <MaterialCommunityIcon name='dots-horizontal-circle-outline' size={22} color={semantic.colorTextPrimary} />
                {/* <RandomRecipesForm
                    isOpen={isRandomRecipesOpen}
                    setIsOpen={setIsRandomRecipesOpen}
                /> */}
            </View>
        </Menu>
    )
}
