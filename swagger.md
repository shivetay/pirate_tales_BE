# Swagger API Documentation Guide

This guide explains how to add comprehensive API documentation to your Pirate Tales Backend using **free tools**. We'll use Swagger UI with OpenAPI 3.0 specification.

## Table of Contents
1. [Why Swagger/OpenAPI?](#why-swaggeropenapi)
2. [Free Tools Overview](#free-tools-overview)
3. [Implementation Steps](#implementation-steps)
4. [Example Implementation](#example-implementation)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)

## Why Swagger/OpenAPI?

- **Free and Open Source**: No licensing costs
- **Industry Standard**: Widely adopted by developers
- **Interactive Documentation**: Test APIs directly from the browser
- **Code Generation**: Generate client SDKs automatically
- **Validation**: Built-in request/response validation
- **Team Collaboration**: Easy to share and maintain

## Free Tools Overview

### 1. **Swagger UI** (Recommended)
- **Cost**: Free
- **Features**: Interactive API documentation, testing interface
- **Installation**: `npm install swagger-ui-express`
- **TypeScript Support**: `npm install @types/swagger-ui-express`

### 2. **OpenAPI Specification**
- **Cost**: Free
- **Format**: YAML or JSON
- **Version**: 3.0+ (latest stable)

### 3. **Swagger Editor** (Online)
- **Cost**: Free
- **URL**: https://editor.swagger.io/
- **Features**: Real-time editing and validation

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

### Step 2: Create OpenAPI Specification

Create `src/docs/swagger.yaml` with your API specification.

### Step 3: Configure Swagger in Express

Add Swagger middleware to your Express app.

### Step 4: Add JSDoc Comments

Document your controllers with JSDoc comments for automatic schema generation.

## Example Implementation

### 1. Install Required Packages

```bash
# Install Swagger UI
npm install swagger-ui-express
npm install --save-dev @types/swagger-ui-express

# Optional: For automatic schema generation
npm install swagger-jsdoc
npm install --save-dev @types/swagger-jsdoc
```

### 2. Create Swagger Configuration

Create `src/docs/swagger.ts`:

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pirate Tales API',
      version: '1.0.0',
      description: 'Backend API for MMO web-based game Pirate Tales',
      contact: {
        name: 'Łukasz Dawidowicz',
        email: 'your-email@example.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'user_name', 'created_at'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'pirate@example.com',
            },
            user_name: {
              type: 'string',
              description: 'Username',
              example: 'CaptainSparrow',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            message: {
              type: 'string',
              example: 'Login successful',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
```

### 3. Update Your Express App

Modify `src/app.ts`:

```typescript
import cors from 'cors';
import express from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import morgan from 'morgan';
import { specs, swaggerUi } from './docs/swagger';
import { authRoutes, userRoutes } from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(xss());

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  console.log('Development mode');
  app.use(morgan('dev'));
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pirate Tales API Documentation',
}));

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;
```

### 4. Add JSDoc Comments to Controllers

Update `src/controllers/authController.ts`:

```typescript
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - user_name
 *               - password
 *               - password_confirm
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pirate@example.com
 *               user_name:
 *                 type: string
 *                 example: CaptainSparrow
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: mySecurePassword123
 *               password_confirm:
 *                 type: string
 *                 format: password
 *                 example: mySecurePassword123
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ... existing implementation
};

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pirate@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecurePassword123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ... existing implementation
};
```

Update `src/controllers/useController.ts`:

```typescript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ... existing implementation
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ... existing implementation
};
```

### 5. Add Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "docs:serve": "swagger-ui-serve src/docs/swagger.yaml",
    "docs:validate": "swagger-codegen validate -i src/docs/swagger.yaml"
  }
}
```

## Advanced Features

### 1. **Request/Response Validation**

Add validation middleware:

```bash
npm install express-openapi-validator
```

```typescript
import OpenApiValidator from 'express-openapi-validator';

app.use(
  OpenApiValidator.middleware({
    apiSpec: './src/docs/swagger.yaml',
    validateRequests: true,
    validateResponses: true,
  })
);
```

### 2. **Environment-Specific Documentation**

```typescript
const getServerUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-production-url.com/api/v1';
  }
  return 'http://localhost:3000/api/v1';
};

// Use in swagger config
servers: [
  {
    url: getServerUrl(),
    description: `${process.env.NODE_ENV} server`,
  },
],
```

### 3. **Custom Styling**

```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #1e3a8a }
  `,
  customSiteTitle: 'Pirate Tales API',
}));
```

## Best Practices

### 1. **Documentation Structure**
- Group endpoints by functionality (tags)
- Use consistent naming conventions
- Provide clear descriptions and examples
- Include error responses for all endpoints

### 2. **Security Documentation**
- Document authentication methods
- Show required headers/parameters
- Provide example tokens for testing

### 3. **Versioning**
- Use semantic versioning for API versions
- Maintain backward compatibility
- Document deprecation notices

### 4. **Testing**
- Use the interactive Swagger UI for testing
- Validate all request/response schemas
- Test error scenarios

## Accessing Your Documentation

After implementation, your API documentation will be available at:

- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

## Additional Free Tools

### 1. **Swagger Editor** (Online)
- URL: https://editor.swagger.io/
- Features: Real-time editing, validation, preview

### 2. **Swagger Codegen** (Open Source)
- Generate client SDKs in multiple languages
- Command: `swagger-codegen generate -i swagger.yaml -l javascript -o ./client`

### 3. **Redoc** (Alternative to Swagger UI)
- More modern, responsive design
- Install: `npm install redoc-express`
- Better for public API documentation

## Troubleshooting

### Common Issues:

1. **Swagger UI not loading**: Check file paths and ensure all dependencies are installed
2. **JSDoc not generating**: Verify comment syntax and file paths in swagger-jsdoc options
3. **CORS issues**: Add CORS configuration for Swagger UI
4. **Schema validation errors**: Use Swagger Editor to validate your specification

### Debug Commands:

```bash
# Validate OpenAPI spec
npx swagger-codegen validate -i src/docs/swagger.yaml

# Generate client SDK
npx swagger-codegen generate -i src/docs/swagger.yaml -l typescript-axios -o ./generated-client
```

This implementation provides a complete, free solution for API documentation that's professional, interactive, and maintainable.
