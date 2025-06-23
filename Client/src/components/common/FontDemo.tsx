import { Box, Typography, Card, CardContent } from '@mui/material';

/**
 * Component demo để test Roboto font với tất cả font weights
 */
export default function FontDemo() {
    const fontWeights = [
        { weight: 100, name: 'Thin', class: 'font-roboto-thin' },
        { weight: 200, name: 'Extra Light', class: 'font-roboto-extralight' },
        { weight: 300, name: 'Light', class: 'font-roboto-light' },
        { weight: 400, name: 'Regular', class: 'font-roboto-regular' },
        { weight: 500, name: 'Medium', class: 'font-roboto-medium' },
        { weight: 600, name: 'Semi Bold', class: 'font-roboto-semibold' },
        { weight: 700, name: 'Bold', class: 'font-roboto-bold' },
        { weight: 800, name: 'Extra Bold', class: 'font-roboto-extrabold' },
        { weight: 900, name: 'Black', class: 'font-roboto-black' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
                🎨 Roboto Font Demo
            </Typography>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Material UI Typography
                    </Typography>

                    <Typography variant="h1" gutterBottom>
                        Heading 1 - Roboto
                    </Typography>
                    <Typography variant="h2" gutterBottom>
                        Heading 2 - Roboto
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                        Heading 3 - Roboto
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        Heading 4 - Roboto
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Heading 5 - Roboto
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Heading 6 - Roboto
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Roboto font trong Material UI.
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Body 2: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Tailwind CSS Utilities
                    </Typography>

                    {fontWeights.map((font) => (
                        <Box key={font.weight} sx={{ mb: 2 }}>
                            <span className={font.class} style={{ fontSize: '18px' }}>
                                {font.name} ({font.weight}) - The quick brown fox jumps over the lazy dog.
                            </span>
                        </Box>
                    ))}

                    <Box sx={{ mt: 3 }}>
                        <span className="font-roboto-regular font-roboto-italic" style={{ fontSize: '18px' }}>
                            Regular Italic - Roboto in italic style
                        </span>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Glassmorphism với Roboto
                    </Typography>

                    <Box
                        sx={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                        >
                            Glassmorphism Effect
                        </Typography>
                        <Typography variant="body1">
                            Đây là text Roboto trên nền glassmorphism. Font sẽ được render
                            với antialiasing và hiển thị rõ ràng trên background blur.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
