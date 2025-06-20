import React from "react";
import {
    Pagination,
    Box,
    Typography,
    Paper,
    useTheme,
    alpha
} from "@mui/material";
import { useExercises } from "../../../hooks/useExercises";
import { ExerciseListParams } from "../../../services/exerciseService";

/**
 * 📄 ExercisePagination - Enhanced pagination với info display
 */
interface ExercisePaginationProps {
    params: ExerciseListParams;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const ExercisePagination: React.FC<ExercisePaginationProps> = ({
    params,
    currentPage,
    onPageChange
}) => {
    const { data: exerciseData, isLoading } = useExercises(params);
    const theme = useTheme(); if (isLoading || !exerciseData || !exerciseData.pagination) {
        return null;
    }

    const { totalPages, totalItems, itemsPerPage } = exerciseData.pagination;

    if (!totalPages || !totalItems || !itemsPerPage || totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <Paper
            elevation={0}
            sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
            }}
        >
            {/* Pagination Info */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                order: { xs: 2, md: 1 }
            }}>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        color: 'text.secondary'
                    }}
                >
                    Hiển thị
                </Typography>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        background: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                    }}
                >
                    {startItem}-{endItem}
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        color: 'text.secondary'
                    }}
                >
                    trong tổng số
                </Typography>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        background: theme.palette.secondary.main,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                    }}
                >
                    {totalItems.toLocaleString()}
                </Box>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        color: 'text.secondary'
                    }}
                >
                    bài tập
                </Typography>
            </Box>

            {/* Pagination */}
            <Box sx={{ order: { xs: 1, md: 2 } }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={onPageChange}
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)',
                            fontWeight: 600,
                            minWidth: 40,
                            height: 40,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-selected': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                color: 'white',
                                border: 'none',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                }
                            }
                        }
                    }}
                />
            </Box>
        </Paper>
    );
};

export default ExercisePagination;