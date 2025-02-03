import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { semantic } from '../designTokens'
import { ListsStackNavigator } from '../containers/lists/stackNavigator'
import { RecipesStackNavigator } from '../containers/recipes/stackNavigator'
import { MenusStackNavigator } from '../containers/menus/stackNavigator'
import { SettingsTabNavigator } from '../containers/settings/stackNavigator'
import { Pressable } from 'react-native'
import { SettingsTabButton } from '../containers/settings/settingsTabButton'

export const TabsNavigator = createBottomTabNavigator({
    screenOptions: {
        tabBarActiveTintColor: semantic.colorTextPrimary
    },
    screens: {
        Lists: {
            screen: ListsStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcon name='format-list-bulleted' size={size} color={color} />,
                tabBarButton: ({ onPress, children }) => {
                    return (
                        <Pressable onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {children}
                        </Pressable>
                    )
                }
            }
        },
        Recipes: {
            screen: RecipesStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcon name='food-variant' size={size} color={color} />,
                tabBarButton: ({ onPress, children }) => {
                    return (
                        <Pressable onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {children}
                        </Pressable>
                    )
                }
            }
        },
        Menus: {
            screen: MenusStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialIcon name='restaurant-menu' size={size} color={color} />,
                tabBarButton: ({ onPress, children }) => {
                    return (
                        <Pressable onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {children}
                        </Pressable>
                    )
                }
            }
        },
        Settings: {
            screen: SettingsTabNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcon name='cog' size={size} color={color} />,
                tabBarButton: SettingsTabButton
            }
        }
    }
})
