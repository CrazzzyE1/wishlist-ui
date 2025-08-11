import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Cropper from 'react-easy-crop';
import { readFile, createImage } from './imageUtils';

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

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
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
        <Box sx={{ mb: 2 }}>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {!imageSrc ? (
                <Button
                    variant="contained"
                    onClick={handleUploadClick}
                    fullWidth
                >
                    Загрузить изображение
                </Button>
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
                        <Button
                            variant="contained"
                            onClick={handleCropComplete}
                        >
                            Применить обрезку
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