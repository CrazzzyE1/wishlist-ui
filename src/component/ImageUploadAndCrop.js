import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Cropper from 'react-easy-crop';
import { readFile, createImage } from './imageUtils';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import {Typography} from "@mui/material";

export default function ImageUploadAndCrop({ onImageCropped, aspectRatio }) {
    const [imageSrc, setImageSrc] = React.useState(null);
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);
    const inputRef = React.useRef();

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
        }
    };

    const onCropComplete = async (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);

        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onImageCropped(croppedImage);
        } catch (e) {
            console.error('Ошибка при обрезке изображения', e);
        }
    };


    const handleUploadClick = () => {
        inputRef.current.click();
    };

    const handleCropComplete = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            onImageCropped(croppedImage);
        } catch (e) {
            console.error('Ошибка при обрезке изображения', e);
        }
    };

    return (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {!imageSrc ? (
                <Box
                    onClick={handleUploadClick}
                    sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200,
                        width: '100%',
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        '&:hover': {
                            bgcolor: '#e0e0e0'
                        }
                    }}
                >
                    <AddAPhotoOutlinedIcon
                        sx={{
                            fontSize: 60,
                            color: 'action.active',
                            mb: 1
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        Загрузить фото
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{
                        position: 'relative',
                        height: 200,
                        width: '100%',
                        bgcolor: '#f5f5f5'
                    }}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </Box>

                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setImageSrc(null)}
                        >
                            Отмена
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}

async function getCroppedImg(imageSrc, croppedAreaPixels) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.9);
    });
}