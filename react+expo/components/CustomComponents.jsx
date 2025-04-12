import { Text, View, Pressable, Image, StyleSheet,ScrollView } from "react-native"
import { TextInput, HelperText } from "react-native-paper"
import { useState } from "react"
import {GestureHandlerRootView} from 'react-native-gesture-handler'

export const MainLayout = (props) => {
    return (
        <>
            {
                props.scrollable ?
                //scrollable view here
                <GestureHandlerRootView>
                    <ScrollView
                        style={{flex: 1}}
                        contentContainerStyle={{
                            backgroundColor: props.bgColor,
                            justifyContent: props.justifyContent,
                            alignItems: props.align,
                            position: props.position,
                            flexGrow: 1
                        }}
                    >
                        {props.children}
                    </ScrollView>
                </GestureHandlerRootView>
                :
                //non-scrollable view here
                <View style={[styles.body,
                    {
                        backgroundColor: props.bgColor,
                        justifyContent: props.justifyContent,
                        alignItems: props.align,
                        position: props.position
                    }
                ]}>
                    {props.children}
                </View>
            }
        </>
    )
} 

const styles = StyleSheet.create({
    body:{
        flex: 1
    }
})
