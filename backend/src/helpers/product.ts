import { Include } from '../types/product';

export const getInclude = (includes: Include[]) =>
  Object.fromEntries(
    includes.map((model) => {
      if (model === 'refills') {
        return [
          model,
          {
            include: {
              refill: true,
            },
          },
        ];
      }

      return [model, true];
    })
  );
