import { View, StyleSheet, Text } from 'react-native'
import { modalPadding } from './consts'
import { ReactNode } from 'react'

type ModalBodyProps = {
    children: ReactNode
    isLoading?: boolean
    isError?: boolean
}

export function _ModalBody({ children, isLoading, isError }: ModalBodyProps) {
    return (
        <View style={styles.mainContent}>
            {(function () {
                if (isError) {
                    return <Text>Error...</Text>
                }

                if (isLoading) {
                    return <Text>Loading...</Text>
                }

                return children
            })()}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContent: {
        padding: modalPadding
    }
})
