import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileRejection, DropEvent, Accept } from 'react-dropzone';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon, CheckCircle, Error } from '@mui/icons-material';

export interface DropZoneProps {
    onDrop: (acceptedFiles: File[], event: DropEvent) => void;
    accept?: Accept;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    showPreview?: boolean;
    label?: string;
    helperText?: string;
}

/**
 * Modern DropZone component với Material UI styling
 * Supports image preview, flexible accept prop, and beautiful UI
 */
const DropZoneComponent: React.FC<DropZoneProps> = ({
    onDrop,
    accept = { 'image/*': [] },
    multiple = false,
    maxFiles = 1,
    maxSize = 5 * 1024 * 1024, // 5MB
    disabled = false,
    className = '',
    style = {},
    showPreview = true,
    label = 'Upload Thumbnail',
    helperText,
}) => {
    const [previews, setPreviews] = useState<Array<{ url: string; file: File }>>([]);
    const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

    const handleDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        // Clear previous rejections
        setRejectedFiles(fileRejections);

        // Create previews for accepted files
        if (showPreview && acceptedFiles.length > 0) {
            const newPreviews = acceptedFiles
                .filter(file => file.type.startsWith('image/'))
                .map(file => ({
                    url: URL.createObjectURL(file),
                    file
                }));

            setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
        }

        onDrop(acceptedFiles, event);
    }, [onDrop, showPreview, multiple, previews]);

    // Clean up preview URLs on unmount or when previews change
    useEffect(() => {
        return () => {
            previews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const removePreview = useCallback((index: number) => {
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    }, [previews]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        isDragAccept,
    } = useDropzone({
        onDrop: handleDrop,
        accept,
        multiple,
        maxFiles,
        maxSize,
        disabled,
    });

    const getBorderColor = () => {
        if (isDragReject) return '#f44336';
        if (isDragAccept) return '#4caf50';
        if (isDragActive) return '#1976d2';
        return '#e0e0e0';
    };

    const getBackgroundColor = () => {
        if (isDragReject) return 'rgba(244, 67, 54, 0.04)';
        if (isDragAccept) return 'rgba(76, 175, 80, 0.04)';
        if (isDragActive) return 'rgba(25, 118, 210, 0.04)';
        return 'rgba(0, 0, 0, 0.02)';
    };

    const getIcon = () => {
        if (isDragReject) return <Error sx={{ fontSize: 48, color: '#f44336' }} />;
        if (isDragAccept) return <CheckCircle sx={{ fontSize: 48, color: '#4caf50' }} />;
        return <CloudUpload sx={{ fontSize: 48, color: '#1976d2' }} />;
    };

    const getMessage = () => {
        if (isDragReject) return 'File không hợp lệ!';
        if (isDragAccept) return 'Thả file vào đây...';
        if (isDragActive) return 'Thả file vào đây...';
        return 'Kéo & thả file vào đây hoặc click để chọn';
    };

    return (
        <Box className={className} sx={{ width: '100%', ...style }}>
            {/* Label */}
            {label && (
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                    {label}
                </Typography>
            )}

            {/* Drop Zone hoặc Preview - thay thế lẫn nhau */}
            <Box
                {...getRootProps()}
                sx={{
                    border: `2px ${previews.length > 0 ? 'solid' : 'dashed'} ${getBorderColor()}`,
                    borderRadius: 3,
                    p: previews.length > 0 ? 1.5 : 3,
                    textAlign: 'center',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    background: previews.length > 0
                        ? 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)'
                        : getBackgroundColor(),
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    opacity: disabled ? 0.6 : 1,
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: disabled ? undefined : previews.length > 0
                            ? 'rgba(25, 118, 210, 0.05)'
                            : 'rgba(25, 118, 210, 0.02)',
                        borderColor: disabled ? undefined : '#1976d2',
                    },
                }}
            >
                <input {...getInputProps()} />

                {/* Hiển thị Preview thay vì Drop Zone khi có file */}
                {showPreview && previews.length > 0 ? (
                    <>
                        {/* Single Preview cho mode không multiple */}
                        {!multiple && previews.length === 1 && (
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: 200,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Main Preview Image */}
                                <Box
                                    component="img"
                                    src={previews[0].url}
                                    alt="Preview"
                                    sx={{
                                        width: '100%',
                                        height: 140,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        border: '1px solid rgba(0,0,0,0.1)',
                                    }}
                                />

                                {/* Overlay với file info */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                        color: 'white',
                                        p: 1,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                                        {previews[0].file.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {(previews[0].file.size / 1024).toFixed(1)} KB
                                    </Typography>
                                </Box>

                                {/* Delete Button */}
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removePreview(0);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(244, 67, 54, 1)',
                                        },
                                    }}
                                    size="small"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {/* Multiple Preview Grid */}
                        {multiple && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                                    gap: 1,
                                    width: '100%',
                                    maxHeight: 120,
                                    overflowY: 'auto',
                                }}
                            >
                                {previews.map((preview, index) => (
                                    <Box
                                        key={preview.url}
                                        sx={{
                                            position: 'relative',
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={preview.url}
                                            alt={`Preview ${index + 1}`}
                                            sx={{
                                                width: '100%',
                                                height: 80,
                                                objectFit: 'cover',
                                                border: '1px solid rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removePreview(index);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                backgroundColor: 'rgba(244, 67, 54, 0.9)',
                                                color: 'white',
                                                width: 20,
                                                height: 20,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(244, 67, 54, 1)',
                                                },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 12 }} />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Instruction overlay khi hover */}
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                                mt: 1,
                                opacity: 0.8,
                            }}
                        >
                            Click để thay đổi hoặc kéo file mới vào đây
                        </Typography>
                    </>
                ) : (
                    <>
                        {/* Original Drop Zone UI khi chưa có file */}
                        {getIcon()}

                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 500,
                                color: isDragReject ? '#f44336' : isDragAccept ? '#4caf50' : 'text.primary'
                            }}
                        >
                            {getMessage()}
                        </Typography>

                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {helperText || `${multiple ? `Tối đa ${maxFiles} file` : 'Chỉ 1 file'}, mỗi file ≤ ${(maxSize / 1024 / 1024).toFixed(1)}MB`}
                        </Typography>

                        {accept && (
                            <Chip
                                label={`Chấp nhận: ${Object.keys(accept).join(', ')}`}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5, fontSize: '0.75rem' }}
                            />
                        )}
                    </>
                )}
            </Box>

            {/* Error Messages */}
            {rejectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {rejectedFiles.map((rejection, index) => (
                        <Typography
                            key={index}
                            variant="caption"
                            sx={{
                                display: 'block',
                                color: 'error.main',
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                p: 1,
                                borderRadius: 1,
                                mb: 1
                            }}
                        >
                            <strong>{rejection.file.name}:</strong> {rejection.errors.map(e => e.message).join(', ')}
                        </Typography>
                    ))}
                </Box>
            )}

            {/* Preview Images */}

        </Box>
    );
};

export default DropZoneComponent;