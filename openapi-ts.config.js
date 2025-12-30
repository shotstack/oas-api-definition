import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './api.oas3.yaml',
  output: {
    path: './dist/zod',
    format: 'prettier',
  },
  plugins: [
    {
      name: 'zod',
      exportAllTypes: true,
      definitions: {
        name: '{{name}}Schema',
      },
      requests: {
        name: '{{name}}Request',
      },
      responses: {
        name: '{{name}}Response',
      },
    },
  ],
});
