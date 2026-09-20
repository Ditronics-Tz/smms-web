import * as React from 'react';
import { Avatar, Dropdown, Menu, MenuButton, MenuItem, Typography } from "@mui/joy"
import image, { LOCALES } from "../../constant/image"
import { useState } from "react"
import i18n from '../../i18n/i18n.js'

const LanguageMenu = ({ change }) => {
    const [currentLang, setCurrentLang] = useState(i18n.language);

    const _changeLanguage = (newLang) => {
        localStorage.setItem('language', newLang)
        i18n.changeLanguage(newLang)
            .then(() => {
                setCurrentLang(newLang)
                change()
            })
            .catch(err => {
                console.error(err);
                console.log('Language update failed ');
            })
    }

    const currentLocale = LOCALES.find((locale) => locale.code === currentLang) || LOCALES[0];

    return (
        <Dropdown>

            <MenuButton
                variant='plain'
                sx={{gap: 1, p: 0.2}}>
                     <Avatar
                        src={image.Images[currentLocale.flagKey]}
                        size='sm'
                        sx={{
                            width: 20, height: 20, backgroundColor: 'transparent', borderRadius: 0
                        }}
                    />
                <Typography level='body-xs' sx={{display: {xs: "none", md: 'block'}}}>{currentLocale.label}</Typography>
            </MenuButton>
            <Menu
                placement="bottom-end"
                size="sm"
                sx={{
                    zIndex: "99999",
                    p: 1,
                    gap: 1,
                    "--ListItem-radius": "var(--joy-radius-sm)",
                }}>
                {LOCALES.map((locale) => (
                    <MenuItem
                        key={locale.code}
                        selected={currentLang === locale.code}
                        onClick={() => _changeLanguage(locale.code)}
                        sx={{ display: 'flex' }}>
                        <Avatar src={image.Images[locale.flagKey]} size='sm' sx={{ width: 20, height: 20, backgroundColor: 'transparent', borderRadius: 0 }} />
                        <Typography level='body-xs'>{locale.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    )
}

export default LanguageMenu