import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { semantic } from '../../../designTokens'
import { ChangeEmail } from '../components/changeEmail'
import { ChangePassword } from '../components/changePassword'
import { AdditionalUsers } from '../components/additionalUsers'
import { AccountAccess } from '../components/accountAccess'
import { DeleteAccount } from '../components/deleteAccount'

export function AccountScreen() {
    return (
        <ScrollView style={styles.main}>
            <ChangeEmail />
            <ChangePassword />
            <AdditionalUsers />
            <AccountAccess />
            <DeleteAccount />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: semantic.paddingDefault,
        flex: 1
    }
})
