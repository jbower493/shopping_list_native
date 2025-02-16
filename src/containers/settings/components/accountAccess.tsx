import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { query } from '../../../queries'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { semantic } from '../../../designTokens'

export function AccountAccess() {
    const { data: accountAccessData, isFetching: isAccountAccessFetching } = query.account.accountAccess.all.useQuery()

    const { mutate: loginAsAnotherUser } = query.account.accountAccess.loginAsAnotherUser.useMutation()

    function renderAccountAccess() {
        if (isAccountAccessFetching) {
            return <Text style={styles.loadingOrNoRecords}>Loading account access...</Text>
        }

        if (!Array.isArray(accountAccessData) || accountAccessData.length <= 0) {
            return <Text style={styles.loadingOrNoRecords}>You currently don&apos;t have access to any other accounts</Text>
        }

        return (
            <View style={styles.list}>
                {(accountAccessData || []).map((item) => (
                    <View style={styles.listItem} key={item.email}>
                        <Text style={styles.listItemText}>{item.email}</Text>
                        <Pressable
                            onPress={() => {
                                loginAsAnotherUser({ user_email_to_login_as: item.email })
                            }}
                        >
                            <MaterialCommunityIcon name='login' size={22} color={semantic.colorTextPrimary} />
                        </Pressable>
                    </View>
                ))}
            </View>
        )
    }

    return (
        <View style={styles.module}>
            <Text style={styles.title}>Account Access</Text>
            {renderAccountAccess()}
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
