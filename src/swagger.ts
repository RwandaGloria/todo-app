import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'TodoApp API Documentation',
      version: '1.0.0',
      description: 'API Documentation for TodoApp',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Enter your Bearer token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
