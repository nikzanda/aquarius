import { Include } from '../types/refill';

export const getInclude = (includes: Include[]) =>
  Object.fromEntries(
    includes.map((model) => {
      if (model === 'products') {
        return [
          model,
          {
            include: { product: true },
          },
        ];
      }
      if (model === 'tests') {
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
