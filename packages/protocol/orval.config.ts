import { defineConfig } from 'orval';

const client = 'fetch';
const override = {
  mutator: {
    path: './src/data/custom-fetch.ts',
    name: 'customFetch'
  }
};

export default defineConfig({
  openapiIvy: {
    input: {
      target: 'target/openapi.json',
      filters: { tags: ['case-map'] }
    },
    output: {
      target: './src/data/ivy-client.ts',
      client,
      prettier: true,
      override
    }
  }
});
