import * as React from 'react';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { STATUS } from '../../constant';
import { toast } from 'react-toastify';
import { Avatar, Box, Card, LinearProgress, Typography } from '@mui/joy';
import image from '../../constant/image';

import { motion } from 'framer-motion';

export default function LoadingView({ loading }) {
    const [open, setOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (loading) {
            setOpen(true)
            setTimeout(() => {
                setOpen(false)
                // toast.warning('Loading timeout.')
            }, 22000)
        } else {
            setOpen(false)
        }
    })

    const icon = {
        hidden: {
          pathLength: 0,
          fill: "rgba(255, 255, 255, 0)"
        },
        visible: {
          pathLength: 1,
          fill: "rgba(255, 255, 255, 1)"
        }
      }

    return (
        <React.Fragment>
            <Box sx={{
                display: open ? 'block' : 'none',
                width: '100%',
                height: '100%',
                backgroundColor: '#00000050',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999,
                justifyContent: 'center',
                alignItems: 'center'

            }}>
                <Card
                    sx={{
                        top: '40%',
                        // left: 0,
                        // bo
                        // p: 2,
                        gap: 2,
                        alignSelf: 'center',
                        width: 120,
                        height: 120,
                        margin: 'auto',
                        transition: `opacity 300ms`,
                    }}>
                    <img src={image.Images.logo} style={{
                        padding: '10px',
                        borderRadius: '1000px',
                        borderColor: 'blue',
                        // borderWidth: '20px',
                        // backgroundColor: 'tomato'
                    }} alt='logo' />
                    {/* <svg
                        xmlns={image.Images.logo}
                        
                        viewBox="0 0 100 100"
                    >
                        <motion.path
                            d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
                            variants={icon}
                            initial="hidden"
                            animate="visible"
                        />
                    </svg> */}
                    <LinearProgress
                        size='md'
                        variant='soft'
                        thickness={3}
                        sx={{
                            color: 'background.appcolor',
                            background: 'transparent',
                        }}
                    />
                </Card>
            </Box>

        </React.Fragment>

    );
}