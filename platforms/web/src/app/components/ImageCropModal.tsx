"use client";

import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/Button';
import NextImage from 'next/image';

interface ImageCropModalProps {
    isOpen: boolean;
    imageSrc: string;
    aspect: number;
    onClose: () => void;
    onCropComplete: (croppedImage: Blob) => void;
}

// Function to generate the cropped image
async function getCroppedImg(
    image: HTMLImageElement,
    crop: Crop,
): Promise<Blob | null> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const targetWidth = Math.floor(crop.width * scaleX);
    const targetHeight = Math.floor(crop.height * scaleY);

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        targetWidth,
        targetHeight
    );

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                }
            },
            'image/jpeg',
            0.95
        );
    });
}


export const ImageCropModal = ({ isOpen, imageSrc, aspect, onClose, onCropComplete }: ImageCropModalProps) => {
    const [crop, setCrop] = useState<Crop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: 'px',
                    width: Math.min(width, height, 400),
                },
                aspect,
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
    };

    const handleCrop = async () => {
        if (crop?.width && crop?.height && imgRef.current) {
            const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
            if(croppedImageBlob) {
                onCropComplete(croppedImageBlob);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-background hud-panel w-full max-w-xl rounded-2xl p-6 md:p-8 space-y-6 border border-border">
                <h2 className="text-3xl font-bold text-center text-white font-mono hud-text-glow">Crop Your Image</h2>
                <div className="flex justify-center bg-black/50 rounded-lg overflow-hidden p-2 border border-border">
                     <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        aspect={aspect}
                        minWidth={100}
                        minHeight={100}
                        ruleOfThirds
                    >
                        <NextImage ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Crop preview" width={800} height={600} style={{ maxHeight: '60vh', userSelect: 'none', objectFit: 'contain' }} />
                    </ReactCrop>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={onClose} className="w-full">Cancel</Button>
                    <Button onClick={handleCrop} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">Save Crop</Button>
                </div>
            </div>
        </div>
    );
}; 