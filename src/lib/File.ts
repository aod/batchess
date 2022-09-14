export const Files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

type File = typeof Files[number];
export default File;
