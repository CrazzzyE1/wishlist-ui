import * as React from 'react';
import {useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Cropper from 'react-easy-crop';
import {createImage, readFile} from './ImageUtils';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import {CircularProgress, LinearProgress, Typography} from "@mui/material";
import heic2any from "heic2any";

export default function ImageUploadAndCrop({onImageCropped, aspectRatio}) {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [cropSize, setCropSize] = useState({width: 250, height: 250});
    const [zoom, setZoom] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef();

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsLoading(true);
            setUploadProgress(0);

            try {
                let file = e.target.files[0];
                setUploadProgress(30);
                if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                    try {
                        const conversionResult = await heic2any({
                            blob: file,
                            toType: 'image/jpeg',
                        });
                        file = new File([conversionResult], file.name.replace(/\.heic$/i, '.jpg'), {type: 'image/jpeg'});
                    } catch (conversionError) {
                        console.error('Ошибка конвертации HEIC:', conversionError);
                        return;
                    }
                }

                setUploadProgress(70);
                const imageDataUrl = await readFile(file);
                setImageSrc(imageDataUrl);
                setUploadProgress(100);

            } catch (error) {
                console.error('Ошибка загрузки файла:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                    setUploadProgress(0);
                }, 500);
            }
        }
    };

    const onCropComplete = async (croppedArea, croppedAreaPixels) => {
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

    return (
        <Box sx={{mb: 2, textAlign: 'center'}}>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
            />

            {isLoading ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200,
                        width: '100%',
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        gap: 2
                    }}
                >
                    <CircularProgress size={40}/>
                    <Typography variant="body2" color="text.secondary">
                        Загружаем изображение...
                    </Typography>
                    <Box sx={{width: '80%'}}>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            sx={{height: 8, borderRadius: 4}}
                        />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {uploadProgress}%
                    </Typography>
                </Box>
            ) : !imageSrc ? (
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
                        height: 250,
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
                            objectFit="contain"
                            restrictPosition={false}
                            cropSize={cropSize}
                        />
                    </Box>

                    <Box sx={{mt: 1, display: 'flex', gap: 1}}>
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