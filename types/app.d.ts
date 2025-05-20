type RequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

// Taken from https://stackoverflow.com/a/53229567/13603811
// By user https://stackoverflow.com/users/11860232/tjjfvi
type UnionKeys<T> = T extends T ? keyof T : never;
type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never;
type OneOf<T extends NonNullable<unknown>[]> = {
  [K in keyof T]: Expand<T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>>;
}[number];
