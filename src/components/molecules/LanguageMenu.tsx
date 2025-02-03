import * as React from 'react';
import { Avatar, Dropdown, Menu, MenuButton, MenuItem, Typography } from "@mui/joy"
import image from "../../constant/image"
import { useEffect, useRef, useState } from "react"
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

    return (
        <Dropdown>

            <MenuButton
                variant='plain'
                sx={{gap: 1, p: 0.2}}>
                     <Avatar
                        src={currentLang === "sw" ? image.Images.tzFlag : image.Images.ukFlag}
                        size='sm'
                        sx={{
                            width: 20, height: 20, backgroundColor: 'transparent', borderRadius: 0
                        }}
                    />
                <Typography level='body-xs' sx={{display: {xs: "none", md: 'block'}}}>{currentLang === 'sw' ? "Swahili" : "English"}</Typography>
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
                <MenuItem
                    selected={currentLang == 'sw'}
                    onClick={() => _changeLanguage("sw")}
                    sx={{ display: 'flex' }}>
                    <Avatar src={image.Images.tzFlag} size='sm' sx={{ width: 20, height: 20, backgroundColor: 'transparent', borderRadius: 0 }} />
                    <Typography level='body-xs'>Swahili</Typography>
                </MenuItem>
                <MenuItem
                    selected={currentLang == 'en'}
                    onClick={() => _changeLanguage("en")}
                    sx={{ display: 'flex' }}>
                    <Avatar src={image.Images.ukFlag} size='sm' sx={{ width: 20, height: 20, backgroundColor: 'transparent', borderRadius: 0 }} />
                    <Typography level='body-xs'>English</Typography>
                </MenuItem>
            </Menu>
        </Dropdown>
    )
}

export default LanguageMenu