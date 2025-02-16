import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { useTranslation } from 'react-i18next';


export default function AlertModal({ visibility, message, onConfirm, onClose }) {
    const { t } = useTranslation();

    return (
        <Modal open={visibility} onClose={onClose}>
            <ModalDialog
            size='lg'
                aria-labelledby="nested-modal-title"
                aria-describedby="nested-modal-description"
            >
                <Typography id="nested-modal-title" level="h2">
                    {t('alert.attention')}
                </Typography>
                <Typography id="nested-modal-description" textColor="text.tertiary">
                    {message}
                </Typography>
                <Box
                    sx={{
                        mt: 1,
                        display: 'flex',
                        gap: 1,
                        flexDirection: 'row-reverse',
                    }}
                >
                    <Button variant="outlined" color="danger" onClick={onClose}>
                        {t('alert.cancel')}
                    </Button>
                    <Button variant="solid" color="danger" onClick={onConfirm}>
                        {t('alert.yes')}
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
