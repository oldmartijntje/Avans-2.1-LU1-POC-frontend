import React from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from '../contexts/TranslationContext';
import { config } from '../config/config';

type Language = typeof config.LANGUAGES[number];

const LanguageSwitcher: React.FC = () => {
    const { currentLanguage, setLanguage } = useTranslation();

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'english', name: 'English', flag: '🇺🇸' },
        { code: 'dutch', name: 'Nederlands', flag: '🇳🇱' }
    ];

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

    return (
        <Dropdown as={ButtonGroup} data-testid="language-switcher">
            <Button variant="outline-light" size="sm" disabled className="text-light-custom">
                {currentLang.flag} {currentLang.name}
            </Button>

            <Dropdown.Toggle
                split
                variant="outline-light"
                size="sm"
                id="language-dropdown"
                className="border-light"
            />

            <Dropdown.Menu align="end" data-bs-theme="dark" className="bg-darker-custom border-dark">
                {languages.map((lang) => (
                    <Dropdown.Item
                        key={lang.code}
                        active={currentLanguage === lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={currentLanguage === lang.code ? 'bg-primary text-white' : 'text-light-custom'}
                    >
                        {lang.flag} {lang.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default LanguageSwitcher;