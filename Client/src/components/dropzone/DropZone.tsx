import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone, FileRejection, DropEvent, Accept } from 'react-dropzone';

export interface DropZoneProps {
    onDrop: (acceptedFiles: File[], event: DropEvent) => void;
    accept?: Accept;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Simple reusable DropZone component using react-dropzone
 * Supports image preview, flexible accept prop, and basic config
 */
const DropZoneComponent: React.FC<DropZoneProps> = ({
    onDrop,
    accept = { 'image/*': [] },
    multiple = true,
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB
    disabled = false,
    className = '',
    style = {},
}) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        setPreviews(
            acceptedFiles
                .filter(file => file.type.startsWith('image/'))
                .map(file => URL.createObjectURL(file))
        );
        onDrop(acceptedFiles, event);
    }, [onDrop]);

    // Clean up previews on unmount
    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
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

    return (
        <div
            {...getRootProps({
                className: `dropzone ${className} ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${isDragAccept ? 'accept' : ''}`,
                style: {
                    border: isDragReject
                        ? '2.5px solid #f44336'
                        : isDragAccept
                            ? '2.5px solid #4caf50'
                            : '2.5px dashed #1976d2',
                    borderRadius: 16,
                    padding: 32,
                    minHeight: 180,
                    background: isDragActive
                        ? 'linear-gradient(135deg, #e3f2fd 0%, #fffde7 100%)'
                        : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                    boxShadow: isDragActive
                        ? '0 8px 32px rgba(25, 118, 210, 0.10)'
                        : '0 2px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    ...style,
                },
            })}
        >
            <input {...getInputProps()} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                marginBottom: previews.length ? 16 : 0,
            }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 48 48" style={{ opacity: 0.7 }}>
                    <rect width="48" height="48" rx="12" fill="#e3f2fd" />
                    <path d="M24 34V14M24 14l-7 7m7-7l7 7" stroke="#1976d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: isDragReject ? '#f44336' : isDragAccept ? '#4caf50' : '#1976d2',
                    letterSpacing: 0.2,
                }}>
                    {isDragActive
                        ? isDragReject
                            ? 'File không hợp lệ!'
                            : 'Thả file vào đây...'
                        : 'Kéo & thả file vào đây hoặc click để chọn file'}
                </span>
                <span style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                    (Chỉ chấp nhận: {accept && typeof accept === 'object' ? Object.keys(accept).join(', ') : 'image/*'})
                </span>
                <span style={{ fontSize: 12, color: '#bdbdbd', marginTop: 2 }}>
                    {multiple ? `Tối đa ${maxFiles} file, mỗi file ≤ ${(maxSize / 1024 / 1024).toFixed(1)}MB` : `Chỉ 1 file, ≤ ${(maxSize / 1024 / 1024).toFixed(1)}MB`}
                </span>
            </div>
            {previews.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: 8,
                }}>
                    {previews.map((url, idx) => (
                        <div key={url} style={{
                            background: 'linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)',
                            border: '1.5px solid #e3f2fd',
                            borderRadius: 10,
                            boxShadow: '0 2px 8px rgba(25,118,210,0.07)',
                            padding: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 90,
                        }}>
                            <img
                                src={url}
                                alt={`preview-${idx}`}
                                style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee', marginBottom: 4 }}
                            />
                            <span style={{ fontSize: 11, color: '#1976d2', wordBreak: 'break-all', textAlign: 'center' }}>
                                Ảnh {idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropZoneComponent;
