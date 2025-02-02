import { Platform, View } from 'react-native'
import { Menu } from '../../../components/Menu'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'
import { DuplicateRecipeForm } from './duplicateRecipeForm'
import { useState } from 'react'
import { Recipe } from '../../../queries/recipes/types'
import { ShareRecipeForm } from './shareRecipeForm'

type MoreOptionsProps = {
    recipeId: Recipe['id']
    recipeName: Recipe['name']
}

export function MoreOptions({ recipeId, recipeName }: MoreOptionsProps) {
    const [isDuplicateRecipeOpen, setIsDuplicateRecipeOpen] = useState(false)
    const [isShareRecipeOpen, setIsShareRecipeOpen] = useState(false)

    return (
        <Menu
            title='More Recipe Options'
            onSelect={(selectedAction) => {
                switch (selectedAction) {
                    case 'duplicate':
                        setIsDuplicateRecipeOpen(true)
                        break
                    case 'share':
                        setIsShareRecipeOpen(true)
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
                <DuplicateRecipeForm
                    isOpen={isDuplicateRecipeOpen}
                    setIsOpen={setIsDuplicateRecipeOpen}
                    recipeId={recipeId}
                    recipeName={recipeName}
                />
                <ShareRecipeForm isOpen={isShareRecipeOpen} setIsOpen={setIsShareRecipeOpen} recipeId={recipeId} recipeName={recipeName} />
            </View>
        </Menu>
    )
}
