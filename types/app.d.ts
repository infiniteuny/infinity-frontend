type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Taken from https://stackoverflow.com/a/54178819
// By user https://stackoverflow.com/users/1392468/damian-pieczy%c5%84ski
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Taken from https://stackoverflow.com/a/53229567/13603811
// By user https://stackoverflow.com/users/11860232/tjjfvi
type UnionKeys<T> = T extends T ? keyof T : never;
type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never;
type OneOf<T extends NonNullable<unknown>[]> = {
  [K in keyof T]: Expand<T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>>;
}[number];
