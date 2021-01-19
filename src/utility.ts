export const toDate = (val: Date | string): Date => {
  if (typeof val === "string") {
    return new Date(val);
  }
  return val;
};
