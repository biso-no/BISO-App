import React, { useState, useEffect } from 'react';
import { View, } from 'react-native';
import { Spinner, Layout, StyleService } from '@ui-kitten/components';



const Loading = () => {
    

    return (
        <Layout>
            <Spinner size='giant' />
        </Layout>
    );
};

export default Loading;

const styles = StyleService.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
