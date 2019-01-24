declare namespace achain {
  type PromiseResolve<T> = T extends Promise<infer A> ? A : T;

  type AchainProps<T> = {
    [K in keyof PromiseResolve<T>]: AchainResult<PromiseResolve<T>[K]>
  };

  type AchainCall<T> = T extends (...args: infer A) => infer R
    ? {
        (...args: A): AchainResult<PromiseResolve<R>>;
      }
    : {};

  type AchainResult<T> = AchainProps<T> & AchainCall<T> & Promise<T>;

  type Achain = <T>(source: T, isLazy?: boolean) => AchainResult<T>;
}

declare var achain: achain.Achain;
export = achain;
