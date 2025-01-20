import React from 'react'
import { FieldError } from 'react-hook-form'
import { StyleSheet, Text } from 'react-native'
import { semantic } from '../../designTokens'

export function ErrorMessage({ error }: { error: FieldError | undefined | false }) {
    return error ? <Text style={styles.error}>{error.message}</Text> : <></>
}

const styles = StyleSheet.create({
    error: {
        marginTop: 3,
        color: semantic.colorTextError
    }
})
