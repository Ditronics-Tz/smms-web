import * as React from 'react';
import { Box, Card, LinearProgress } from '@mui/joy';
import image from '../../constant/image';

export default function LoadingView({ loading }) {
    React.useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }, [loading]);

    if (!loading) return null; // Don't render if not loading

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.50)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card
                sx={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 120,
                    height: 120,
                }}
            >
                <img
                    src={image.Images.logo}
                    style={{
                        height: 80,
                        width: 80,
                        borderRadius: '50%',
                    }}
                    alt='logo'
                />
                <LinearProgress
                    size='md'
                    variant='soft'
                    thickness={4}
                    sx={{
                        color: 'background.appcolor',
                        background: 'transparent',
                        width: '100%',
                    }}
                />
            </Card>
        </Box>
    );
}
