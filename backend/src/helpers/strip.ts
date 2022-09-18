import { Include } from '../types/strip';

export const getInclude = (includes: Include[]) =>
  Object.fromEntries(
    includes.map((model) => {
      if (model === 'tests') {
        return [
          model,
          {
            include: { test: true },
          },
        ];
      }

      return [model, true];
    })
  );
