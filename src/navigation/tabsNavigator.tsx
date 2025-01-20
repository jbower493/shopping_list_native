import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { semantic } from '../designTokens'
import { ListsStackNavigator } from '../containers/lists/stackNavigator'
import { RecipesStackNavigator } from '../containers/recipes/stackNavigator'
import { MenusStackNavigator } from '../containers/menus/stackNavigator'
import { ItemsStackNavigator } from '../containers/items/stackNavigator'

export const TabsNavigator = createBottomTabNavigator({
    screenOptions: {
        tabBarActiveTintColor: semantic.colorTextPrimary
    },
    screens: {
        Lists: {
            screen: ListsStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcon name='format-list-bulleted' size={size} color={color} />
            }
        },
        Recipes: {
            screen: RecipesStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcon name='food-variant' size={size} color={color} />
            }
        },
        Menus: {
            screen: MenusStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialIcon name='restaurant-menu' size={size} color={color} />
            }
        },
        Items: {
            screen: ItemsStackNavigator,
            options: {
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcon name='food-apple' size={size} color={color} />
            }
        }
    }
})
