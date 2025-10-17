import React from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from '../contexts/TranslationContext';
import type { Language } from '../contexts/TranslationContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'english', name: 'English', flag: '🇺🇸' },
        { code: 'dutch', name: 'Nederlands', flag: '🇳🇱' }
    ];

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

    return (
        <Dropdown as={ButtonGroup}>
            <Button variant="outline-light" size="sm" disabled>
                {currentLanguage.flag} {currentLanguage.name}
            </Button>

            <Dropdown.Toggle
                split
                variant="outline-light"
                size="sm"
                id="language-dropdown"
            />

            <Dropdown.Menu align="end">
                {languages.map((lang) => (
                    <Dropdown.Item
                        key={lang.code}
                        active={language === lang.code}
                        onClick={() => setLanguage(lang.code)}
                    >
                        {lang.flag} {lang.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default LanguageSwitcher;