import { ImageBackground, Platform, StyleSheet, View } from 'react-native'
import { Link } from '../../../components/Link'
import { Recipe } from '../../../queries/recipes/types'
import { query } from '../../../queries'
import { useState } from 'react'
import { RemoveImageForm } from './removeImageForm'
import { UploadImageForm } from './uploadImageForm'
import { semantic } from '../../../designTokens'
import { Menu } from '../../../components/Menu'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

type RecipeImageProps = {
    recipeId: Recipe['id']
}

export function RecipeImage({ recipeId }: RecipeImageProps) {
    const [isUploadImageFormOpen, setIsUploadImageFormOpen] = useState(false)
    const [isRemoveImageFormOpen, setIsRemoveImageFormOpen] = useState(false)

    const { data: singleRecipeData } = query.recipes.single.useQuery(recipeId.toString() || '')

    if (!singleRecipeData) {
        return null
    }

    const { name, image_url } = singleRecipeData

    return (
        <View>
            {image_url ? (
                <ImageBackground
                    source={{
                        uri: image_url
                    }}
                    resizeMode='cover'
                    style={styles.imageBackground}
                    imageStyle={styles.image}
                >
                    <View style={{ position: 'absolute', top: 6, left: 250 }}>
                        <Menu
                            title='More Recipe Options'
                            onSelect={(selectedAction) => {
                                switch (selectedAction) {
                                    case 'replace':
                                        setIsUploadImageFormOpen(true)
                                        break
                                    case 'remove':
                                        setIsRemoveImageFormOpen(true)
                                        break
                                    default:
                                        break
                                }
                            }}
                            actions={[
                                {
                                    id: 'replace',
                                    title: 'Upload New',
                                    titleColor: semantic.colorTextDefault,
                                    image: Platform.select({
                                        ios: 'square.and.arrow.up',
                                        android: 'ic_menu_upload'
                                    }),
                                    imageColor: semantic.colorTextPrimary
                                },
                                {
                                    id: 'remove',
                                    title: 'Remove',
                                    titleColor: semantic.colorTextDefault,
                                    image: Platform.select({
                                        ios: 'trash',
                                        android: 'ic_delete'
                                    }),
                                    imageColor: semantic.colorTextError
                                }
                            ]}
                        >
                            <View>
                                <View style={{ position: 'absolute' }}>
                                    <MaterialCommunityIcon name='circle' size={22} color={semantic.colorBackgroundDefault} />
                                </View>
                                <View>
                                    <MaterialCommunityIcon name='dots-horizontal-circle-outline' size={22} color={semantic.colorTextPrimary} />
                                </View>
                            </View>
                        </Menu>
                    </View>
                </ImageBackground>
            ) : (
                <Link style={styles.uploadImageLink} onPress={() => setIsUploadImageFormOpen(true)}>
                    Upload Image
                </Link>
            )}
            <UploadImageForm
                isOpen={isUploadImageFormOpen}
                setIsOpen={setIsUploadImageFormOpen}
                recipeId={recipeId}
                recipeName={name}
                hasExistingImage={!!image_url}
            />
            <RemoveImageForm isOpen={isRemoveImageFormOpen} setIsOpen={setIsRemoveImageFormOpen} recipeId={recipeId} recipeName={name} />
        </View>
    )
}

const styles = StyleSheet.create({
    uploadImageLink: {
        marginTop: 10
    },
    imageBackground: {
        height: 160,
        width: 280,
        marginTop: 10,
        position: 'relative'
    },
    image: {
        borderRadius: semantic.borderRadiusDefault
    }
})
