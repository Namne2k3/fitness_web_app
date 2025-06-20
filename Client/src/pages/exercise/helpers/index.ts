// ================================
// 🔧 Helper Functions
// ================================
const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
        case 'beginner': return 'success';
        case 'intermediate': return 'warning';
        case 'advanced': return 'error';
        default: return 'success';
    }
};

const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
        case 'beginner': return 'Người mới';
        case 'intermediate': return 'Trung bình';
        case 'advanced': return 'Nâng cao';
        default: return 'Người mới';
    }
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'strength': return '💪';
        case 'cardio': return '❤️';
        case 'flexibility': return '🧘';
        default: return '🏋️';
    }
};

const getCategoryLabel = (category: string): string => {
    switch (category) {
        case 'strength': return 'Sức mạnh';
        case 'cardio': return 'Tim mạch';
        case 'flexibility': return 'Linh hoạt';
        default: return 'Khác';
    }
};

const getDifficultyChipColor = (difficulty: string): 'success' | 'warning' | 'error' | 'primary' => {
    switch (difficulty) {
        case 'beginner': return 'success';
        case 'intermediate': return 'warning';
        case 'advanced': return 'error';
        default: return 'primary';
    }
};

export {
    getDifficultyColor,
    getDifficultyLabel,
    getCategoryIcon,
    getCategoryLabel,
    getDifficultyChipColor
};