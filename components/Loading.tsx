import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner, Layout } from '@ui-kitten/components';



const Loading = () => {
    

    return (
        <Layout style={styles.container}>
            <Spinner size='giant' />
        </Layout>
    );
};

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
