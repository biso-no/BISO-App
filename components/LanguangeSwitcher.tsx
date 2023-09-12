import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from 'expo-router';
import { Select, StyleService, Layout, IndexPath, SelectItem } from '@ui-kitten/components';

interface LanguageSwitcherProps {
  style?: object;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'nb', name: 'Norsk' },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style }) => {
  const { setLanguage } = useLanguage();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
  };

  return (
    <Layout
      style={[styles.container, style]}
    >
      <Layout>
        <Select
          selectedIndex={selectedIndex}
          value={languages[selectedIndex.row].name}
          onSelect={() => handleLanguageChange(languages[selectedIndex.row].code)}
          placeholder={languages[selectedIndex.row].name || 'Select language'}
        >
          {languages.map((language, index) => (
            <SelectItem key={index} title={language.name} />
          ))}
        </Select>
      </Layout>
    </Layout>
  );
};

const styles = StyleService.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

});

export default LanguageSwitcher;
