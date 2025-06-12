/**
 * 🚀 Fitness Web App - Main Server Entry Point
 * Express.js server với TypeScript, MongoDB, và security middleware
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import configurations
import { connectDatabase } from './config/database';
import { initializeCloudinary } from './config/cloudinary';
import { setupSwagger } from './config/swagger';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import routes from './routes';

// Load environment variables
dotenv.config();

/**
 * Create Express application
 */
const createApp = (): Application => {
    const app = express();

    // ================================
    // 🛡️ Security Middleware
    // ================================

    // Helmet for security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'", "https://api.cloudinary.com"]
            }
        }
    }));

    // CORS configuration
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
        message: {
            success: false,
            error: 'Too many requests from this IP, please try again later.',
            data: null
        },
        standardHeaders: true,
        legacyHeaders: false
    });

    app.use('/api/', limiter);

    // ================================
    // 📊 Logging & Parsing Middleware
    // ================================

    // Morgan logging
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    app.use(compression());

    // ================================
    // 🔍 Health Check Endpoint
    // ================================

    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Fitness App API is running! 🏋️‍♂️',
            data: {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0'
            }
        });
    });

    // ================================
    // 📖 API Documentation
    // ================================

    // Setup Swagger API documentation
    setupSwagger(app);    // ================================
    // 📡 API Routes
    // ================================

    const API_VERSION = process.env.API_VERSION || 'v1';

    // Main API routes
    app.use(`/api/${API_VERSION}`, routes);

    // ================================
    // ⚠️ Error Handling
    // ================================

    // 404 handler for unmatched routes
    app.use(notFoundHandler);

    // Global error handler
    app.use(errorHandler);

    return app;
};

/**
 * Start server
 */
const startServer = async (): Promise<void> => {
    try {
        // Initialize configurations
        await connectDatabase();
        initializeCloudinary();

        // Create Express app
        const app = createApp();

        // Start server
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log('🚀 =================================');
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📡 API URL: http://localhost:${PORT}/api/v1`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
            console.log('🚀 =================================');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('💥 UNHANDLED PROMISE REJECTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Start the server
if (require.main === module) {
    startServer();
}

export { createApp, startServer };
