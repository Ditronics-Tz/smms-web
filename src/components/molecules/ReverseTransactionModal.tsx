import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Divider from '@mui/joy/Divider';
import Textarea from '@mui/joy/Textarea';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import { WarningRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import branding from '../../config/branding';
import { thousandSeparator } from '../../utils';

export default function ReverseTransactionModal({ open, target, loading, onClose, onConfirm }) {
    const { t } = useTranslation();
    const [reason, setReason] = React.useState('');
    const [touched, setTouched] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setReason('');
            setTouched(false);
        }
    }, [open]);

    const valid = reason.trim().length >= 10;
    const showError = touched && !valid;

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog size="lg" aria-labelledby="reverse-modal-title">
                <ModalClose variant="outlined" onClick={onClose} />
                <DialogTitle id="reverse-modal-title">{t("transaction.reverse")}</DialogTitle>
                <Divider />
                <DialogContent>
                    {target && (
                        <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography level="body-sm"><b>{t("transaction.item_name")}:</b> {target.item_name}</Typography>
                            <Typography level="body-sm"><b>{t("transaction.student_name")}:</b> {target.student_name}</Typography>
                            <Typography level="body-sm"><b>{t("transaction.amount")}:</b> {branding.CURRENCY_SYMBOL} {thousandSeparator(target.amount ?? target.item_price)}</Typography>
                        </Box>
                    )}
                    <Typography
                        level="body-sm"
                        textColor="danger.plainColor"
                        startDecorator={<WarningRounded />}
                        sx={{ mb: 2 }}
                    >
                        {t("transaction.reverseWarning")}
                    </Typography>
                    <FormControl error={showError} sx={{ mb: 2 }}>
                        <FormLabel>{t("transaction.reason")}</FormLabel>
                        <Textarea
                            minRows={3}
                            placeholder={t("transaction.reasonPlaceholder")}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onBlur={() => setTouched(true)}
                        />
                        {showError && <Typography level="body-xs" color="danger">{t("transaction.reasonError")}</Typography>}
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" color="neutral" onClick={onClose} disabled={loading}>
                            {t("transaction.cancel")}
                        </Button>
                        <Button
                            variant="solid"
                            color="danger"
                            disabled={!valid || loading}
                            onClick={() => onConfirm(reason.trim())}
                        >
                            {loading ? t("init.loading") : t("transaction.reverse")}
                        </Button>
                    </Box>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}