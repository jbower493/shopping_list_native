import React, { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Recipe } from '../../../queries/recipes/types'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { semantic } from '../../../designTokens'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

// https://github.com/react-native-image-picker/react-native-image-picker
// https://github.com/choru-k/React-Native-Tips/blob/master/How_to_upload_photo%2Cfile_in%20react-native/README.md

type UploadImageFormProps = {
    recipeName: Recipe['name']
    recipeId: Recipe['id']
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    hasExistingImage: boolean
}

export function UploadImageForm({ recipeId, recipeName, isOpen, setIsOpen, hasExistingImage }: UploadImageFormProps) {
    const [chosenFile, setChosenFile] = useState<Asset | null>(null)

    const { mutate: uploadRecipeImage, isPending: isUploadRecipeImagePending } = query.recipes.single.uploadImage.useMutation()

    function handleUpload() {
        if (!chosenFile) {
            return
        }

        const formData = new FormData()

        formData.append('recipe_image', {
            uri: chosenFile.uri,
            type: chosenFile.type,
            name: 'recipe_image'
        })

        uploadRecipeImage(
            { id: recipeId.toString(), formData: formData },
            {
                onSuccess: () => {
                    setIsOpen(false)
                }
            }
        )
    }

    function handleResultFormCameraOrLibrary(result: void | ImagePickerResponse) {
        const file = result?.assets?.[0]

        if (!file) {
            return
        }

        setChosenFile(file)
    }

    async function handleFromLibrary() {
        const result = await launchImageLibrary({ mediaType: 'photo' }).catch((e) => {
            console.error(e)
        })

        handleResultFormCameraOrLibrary(result)
    }

    async function handleFromCamera() {
        const result = await launchCamera({ mediaType: 'photo', saveToPhotos: false }).catch((e) => {
            console.error(e)
        })

        handleResultFormCameraOrLibrary(result)
    }

    return (
        <Modal isOpen={isOpen} close={() => setIsOpen(false)} title='Upload Recipe Image' description={recipeName}>
            <View>
                <Modal.Body>
                    {hasExistingImage ? (
                        <Text style={styles.warningOuter}>
                            <Text style={styles.warning}>Warning: </Text>Uploading a new image for this recipe will permanently remove the current
                            recipe image.
                        </Text>
                    ) : null}
                    <Text>Upload Image</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={handleFromLibrary} style={styles.button}>
                            <MaterialCommunityIcon
                                style={{ position: 'absolute' }}
                                name='image-multiple'
                                size={20}
                                color={semantic.colorTextInverse}
                            />
                        </Pressable>
                        <Text>Or</Text>
                        <Pressable onPress={handleFromCamera} style={styles.button}>
                            <MaterialCommunityIcon style={{ position: 'absolute' }} name='camera' size={20} color={semantic.colorTextInverse} />
                        </Pressable>
                    </View>
                    {chosenFile ? (
                        <Image
                            style={styles.preview}
                            source={{
                                uri: chosenFile.uri
                            }}
                        />
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <View style={styles.modalFooter}>
                        <Button color='secondary' onPress={() => setIsOpen(false)}>
                            Back
                        </Button>
                        <Button onPress={handleUpload} isLoading={isUploadRecipeImagePending} isDisabled={!chosenFile}>
                            Upload Image
                        </Button>
                    </View>
                </Modal.Footer>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalFooter: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    },
    warningOuter: {
        marginBottom: 15
    },
    warning: {
        fontWeight: 600
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 6
    },
    button: {
        height: 34,
        width: 34,
        backgroundColor: semantic.colorBackgroundPrimary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    preview: {
        marginTop: 10,
        height: 160,
        width: 280,
        borderRadius: semantic.borderRadiusDefault
    }
})
