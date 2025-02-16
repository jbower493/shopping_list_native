import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { query } from '../../../queries'
import { AddAdditionalUserForm } from './addAdditionalUserForm'
import { RemoveAdditionalUserForm } from './removeAdditionalUserForm'

export function AdditionalUsers() {
    const { data: additionalUsersData, isFetching: isAdditionalUsersFetching } = query.account.additionalUsers.all.useQuery()

    function renderAdditionalUsers() {
        if (isAdditionalUsersFetching) {
            return <Text style={styles.loadingOrNoRecords}>Loading additional users...</Text>
        }

        if (!Array.isArray(additionalUsersData) || additionalUsersData.length <= 0) {
            return <Text style={styles.loadingOrNoRecords}>You currently have no additional users with access to your account</Text>
        }

        return (
            <View style={styles.list}>
                {(additionalUsersData || []).map((item) => (
                    <View style={styles.listItem} key={item.email}>
                        <Text style={styles.listItemText}>{item.email}</Text>
                        <RemoveAdditionalUserForm email={item.email} />
                    </View>
                ))}
            </View>
        )
    }

    return (
        <View style={styles.module}>
            <Text style={styles.title}>Additional Users</Text>
            <View style={styles.buttonContainer}>
                <AddAdditionalUserForm />
            </View>
            {renderAdditionalUsers()}
        </View>
    )
}

const styles = StyleSheet.create({
    module: {
        marginBottom: 30
    },
    title: {
        fontSize: 22,
        fontWeight: 600
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15
    },
    loadingOrNoRecords: {
        marginTop: 15
    },
    list: {
        marginTop: 15
    },
    listItem: {
        marginTop: 7,
        flexDirection: 'row'
    },
    listItemText: {
        flex: 1
    }
})
