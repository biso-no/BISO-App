import React, { useEffect } from 'react';
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
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(new IndexPath(0));

  useEffect(() => {
    // Set the initial selected index based on the active language
    const activeLanguageIndex = languages.findIndex((lang) => lang.code === language);

    if (activeLanguageIndex !== -1) {
      setSelectedIndex(new IndexPath(activeLanguageIndex));
    }
  }, [language]);

  const handleLanguageChange = (code: string) => {
    if (setLanguage) {
      setLanguage(code);
      console.log(`Language changed to: ${code}`);
    }
  };

  const handleSelect = (index: IndexPath | IndexPath[]) => {
    if (Array.isArray(index)) {
      for (const selectedIndex of index) {
        const selectedLanguage = languages[selectedIndex.row].code;
        handleLanguageChange(selectedLanguage);
      }
    } else {
      const selectedLanguage = languages[index.row].code;
      handleLanguageChange(selectedLanguage);
    }
    setSelectedIndex(index);
  };

  return (
    <Layout style={[styles.container, style]}>
<Select
  style={{ minWidth: 200 }} // adjust this value as needed
  selectedIndex={selectedIndex}
  value={languages[selectedIndex.row].name}
  onSelect={handleSelect}
  placeholder={languages[selectedIndex.row].name || 'Select language'}
>
  {languages.map((language, index) => (
    <SelectItem key={index} title={language.name} />
  ))}
</Select>
    </Layout>
  );
};

const styles = StyleService.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LanguageSwitcher;
