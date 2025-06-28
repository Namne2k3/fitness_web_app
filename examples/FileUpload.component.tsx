/**
 * 📁 File Upload Component
 * React component for uploading files to AI system
 */

import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
    onFileUpload: (file: File) => Promise<void>;
    isUploading: boolean;
    accept?: string;
    maxSize?: number; // in bytes
    multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileUpload,
    isUploading,
    accept = '.pdf,.txt,.docx,.md',
    maxSize = 10 * 1024 * 1024, // 10MB
    multiple = false
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): { isValid: boolean; error?: string } => {
        // Check file size
        if (file.size > maxSize) {
            return {
                isValid: false,
                error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
            };
        }

        // Check file type
        const allowedTypes = accept.split(',').map(type => type.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            return {
                isValid: false,
                error: `File type ${fileExtension} is not allowed. Allowed types: ${accept}`
            };
        }

        return { isValid: true };
    };

    const handleFiles = async (files: FileList) => {
        const file = files[0]; // Take first file if multiple not allowed
        
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            setErrorMessage(validation.error || 'Invalid file');
            setUploadStatus('error');
            return;
        }

        try {
            setUploadStatus('idle');
            setErrorMessage('');
            await onFileUpload(file);
            setUploadStatus('success');
            
            // Reset success status after 3 seconds
            setTimeout(() => setUploadStatus('idle'), 3000);
        } catch (error) {
            setErrorMessage('Failed to upload file');
            setUploadStatus('error');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const getStatusIcon = () => {
        if (isUploading) {
            return (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            );
        }
        
        switch (uploadStatus) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Upload className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusText = () => {
        if (isUploading) return 'Uploading...';
        
        switch (uploadStatus) {
            case 'success':
                return 'Upload successful!';
            case 'error':
                return errorMessage || 'Upload failed';
            default:
                return 'Upload document';
        }
    };

    const getStatusColor = () => {
        if (isUploading) return 'text-blue-600';
        
        switch (uploadStatus) {
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="relative">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                className="hidden"
            />

            {/* Upload button */}
            <button
                type="button"
                onClick={openFileDialog}
                disabled={isUploading}
                className={`
                    p-2 rounded-lg border transition-colors duration-200
                    ${dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${isUploading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }
                    ${uploadStatus === 'success' 
                        ? 'border-green-500 bg-green-50' 
                        : ''
                    }
                    ${uploadStatus === 'error' 
                        ? 'border-red-500 bg-red-50' 
                        : ''
                    }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                title={getStatusText()}
            >
                {getStatusIcon()}
            </button>

            {/* Drag overlay */}
            {dragActive && (
                <div
                    className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="text-blue-600 font-medium">
                        Drop file here
                    </div>
                </div>
            )}

            {/* Status tooltip */}
            {(uploadStatus !== 'idle' || isUploading) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                    <span className={getStatusColor()}>{getStatusText()}</span>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
};

/**
 * Advanced File Upload with Preview
 */
export const AdvancedFileUpload: React.FC<{
    onFileUpload: (file: File, metadata?: any) => Promise<void>;
    isUploading: boolean;
}> = ({ onFileUpload, isUploading }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        description: '',
        category: 'general',
        tags: ''
    });

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const fileMetadata = {
            description: metadata.description,
            category: metadata.category,
            tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        };

        await onFileUpload(selectedFile, fileMetadata);
        setSelectedFile(null);
        setMetadata({ description: '', category: 'general', tags: '' });
    };

    return (
        <div className="space-y-4">
            <FileUpload
                onFileUpload={handleFileSelect}
                isUploading={false}
            />

            {selectedFile && (
                <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{selectedFile.name}</span>
                            <span className="text-xs text-gray-500">
                                ({Math.round(selectedFile.size / 1024)} KB)
                            </span>
                        </div>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={metadata.description}
                            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        
                        <select
                            value={metadata.category}
                            onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="general">General</option>
                            <option value="fitness">Fitness</option>
                            <option value="nutrition">Nutrition</option>
                            <option value="training">Training</option>
                        </select>
                        
                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={metadata.tags}
                            onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            )}
        </div>
    );
};
