import { Text, Button, Layout, StyleService } from '@ui-kitten/components';
import i18n from '../../constants/localization';
import { useRouter } from 'expo-router';

export default function NoAccess() {

    const router = useRouter();


    return (
        <Layout style={styles.container}>
            <Text style={styles.title} category="h1">
                {i18n.t('no_access')}
            </Text>
            <Button
                style={styles.button}
                appearance='outline'
                onPress={() => {
                    router.push('/');
                }}
            >
                {i18n.t('back_to_home')}
            </Button>
        </Layout>
    );
}

const styles = StyleService.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
})