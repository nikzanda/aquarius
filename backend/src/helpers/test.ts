import { Include } from '../types/test';

export const getInclude = (includes: Include[]) =>
  Object.fromEntries(
    includes.map((model) => {
      if (model === 'refills') {
        return [
          model,
          {
            include: { product: true },
          },
        ];
      }
      if (model === 'strips') {
        return [
          model,
          {
            include: {
              test: true,
            },
          },
        ];
      }
      return [model, true];
    })
  );
