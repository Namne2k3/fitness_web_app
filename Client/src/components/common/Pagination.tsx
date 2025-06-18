/**
 * 📄 Pagination Component - Reusable
 * Component pagination có thể tái sử dụng với custom styling
 */

import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    FirstPage,
    LastPage
} from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import React from 'react';

// ================================
// 🎯 Types & Interfaces
// ================================
interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    loading?: boolean;
    compact?: boolean;
}

// ================================
// 📄 Pagination Component
// ================================
const Pagination: React.FC<PaginationProps> = ({
    pagination,
    onPageChange,
    loading = false,
    compact = false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNextPage,
        hasPrevPage
    } = pagination;

    // Calculate items range
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to show
    const getPageNumbers = (): number[] => {
        const delta = isMobile ? 1 : 2; // Show fewer pages on mobile
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];

        // Calculate range around current page
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Add first page and dots if needed
        if (start > 1) {
            if (start > 2) {
                rangeWithDots.push(1, '...');
            } else {
                rangeWithDots.push(1);
            }
        }

        // Add main range
        rangeWithDots.push(...range);

        // Add last page and dots if needed
        if (end < totalPages) {
            if (end < totalPages - 1) {
                rangeWithDots.push('...', totalPages);
            } else {
                rangeWithDots.push(totalPages);
            }
        }

        return rangeWithDots.filter(item => typeof item === 'number') as number[];
    };

    const pageNumbers = getPageNumbers();

    // Don't render if only one page
    if (totalPages <= 1) return null;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: compact ? 'row' : 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mt: 4,
            p: 2,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.08)',
        }}>
            {/* Items Info */}
            {!compact && (
                <Typography variant="body2" color="text.secondary">
                    Hiển thị {startItem.toLocaleString()}-{endItem.toLocaleString()} trong {totalItems.toLocaleString()} kết quả
                </Typography>
            )}

            {/* Pagination Controls */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {/* First Page Button */}
                <IconButton
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrevPage || loading}
                    size="small"
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        borderRadius: 1,
                    }}
                >
                    <FirstPage />
                </IconButton>

                {/* Previous Button */}
                <IconButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage || loading}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <KeyboardArrowLeft />
                </IconButton>

                {/* Page Numbers */}
                {pageNumbers.map((pageNum, index) => (
                    <Button
                        key={index}
                        variant={pageNum === currentPage ? 'contained' : 'text'}
                        onClick={() => onPageChange(pageNum)}
                        disabled={loading}
                        size="small"
                        sx={{
                            minWidth: 36,
                            height: 36,
                            borderRadius: 1,
                            fontWeight: 600,
                            ...(pageNum === currentPage && {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                },
                            }),
                        }}
                    >
                        {pageNum}
                    </Button>
                ))}

                {/* Next Button */}
                <IconButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage || loading}
                    size="small"
                    sx={{ borderRadius: 1 }}
                >
                    <KeyboardArrowRight />
                </IconButton>

                {/* Last Page Button */}
                <IconButton
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage || loading}
                    size="small"
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        borderRadius: 1,
                    }}
                >
                    <LastPage />
                </IconButton>
            </Box>

            {/* Mobile-friendly page info */}
            {(compact || isMobile) && (
                <Typography variant="caption" color="text.secondary">
                    Trang {currentPage} / {totalPages}
                </Typography>
            )}
        </Box>
    );
};

export default Pagination;