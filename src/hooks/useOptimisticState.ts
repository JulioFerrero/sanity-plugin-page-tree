import { Dispatch, SetStateAction, useState } from 'react';

export const useOptimisticState = <S>(state: S): [S, Dispatch<SetStateAction<S | null>>] => {
  const [optimisticState, setOptimisticState] = useState<S | null>(null);

  const setOptimistic: Dispatch<SetStateAction<S | null>> = update => {
    setOptimisticState(prev => {
      const next = typeof update === 'function' ? (update as (prev: S | null) => S | null)(prev) : update;

      if (next === state) {
        return null;
      }

      return next;
    });
  };

  const resolvedState = optimisticState ?? state;

  return [resolvedState, setOptimistic];
};
