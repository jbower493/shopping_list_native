import React, { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/Button'
import { query } from '../../../queries'
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { semantic } from '../../../designTokens'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { List, ListItem } from '../../../queries/lists/types'
import { useQueryClient } from '@tanstack/react-query'

// https://github.com/react-native-image-picker/react-native-image-picker
// https://github.com/choru-k/React-Native-Tips/blob/master/How_to_upload_photo%2Cfile_in%20react-native/README.md

type UploadImageFormProps = {
    listItem: ListItem | undefined
    listId: List['id']
}

export function UploadImage({ listItem, listId }: UploadImageFormProps) {
    const queryClient = useQueryClient()

    const [chosenFile, setChosenFile] = useState<Asset | null>(null)

    const { mutate: uploadItemImage, isPending: isUploadItemImagePending } = query.items.single.uploadImage.useMutation()

    function handleUpload() {
        if (!chosenFile) {
            return
        }

        const formData = new FormData()

        formData.append('item_image', {
            uri: chosenFile.uri,
            type: chosenFile.type,
            name: 'item_image'
        })

        uploadItemImage(
            { id: listItem?.id.toString() || '', formData: formData },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: query.lists.single.queryKey(listId.toString()) })
                    setChosenFile(null)
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

    if (!listItem) {
        return null
    }

    return (
        <View style={styles.main}>
            <Text>Image</Text>
            {listItem.image_url ? (
                <Image
                    style={styles.existingImage}
                    source={{
                        uri: listItem.image_url
                    }}
                />
            ) : null}
            <Text style={styles.uploadNew}>Upload New Image</Text>
            <View style={styles.buttonContainer}>
                <Pressable onPress={handleFromLibrary} style={styles.button}>
                    <MaterialCommunityIcon style={{ position: 'absolute' }} name='image-multiple' size={20} color={semantic.colorTextInverse} />
                </Pressable>
                <Text>Or</Text>
                <Pressable onPress={handleFromCamera} style={styles.button}>
                    <MaterialCommunityIcon style={{ position: 'absolute' }} name='camera' size={20} color={semantic.colorTextInverse} />
                </Pressable>
            </View>
            {chosenFile ? (
                <View style={styles.newImage}>
                    <Image
                        style={styles.preview}
                        source={{
                            uri: chosenFile.uri
                        }}
                    />
                    <Button onPress={handleUpload} isLoading={isUploadItemImagePending} isDisabled={!chosenFile}>
                        Upload
                    </Button>
                </View>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        marginBottom: 10
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
    existingImage: {
        marginTop: 6,
        height: 120,
        width: 200,
        borderRadius: semantic.borderRadiusDefault
    },
    preview: {
        marginTop: 10,
        height: 120,
        width: 200,
        borderRadius: semantic.borderRadiusDefault
    },
    uploadNew: {
        marginTop: 8
    },
    newImage: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-end'
    }
})
