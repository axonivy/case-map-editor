import tseslint from 'typescript-eslint';
import config from '@axonivy/eslint-config';

export default tseslint.config(
  ...config.base,
  ...config.i18n,
  // TypeScript recommended configs
  {
    name: 'typescript-eslint',
    languageOptions: {
      parserOptions: {
        project: true, // Uses tsconfig.json from current directory
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
);
