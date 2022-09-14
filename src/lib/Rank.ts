export const Ranks = [1, 2, 3, 4, 5, 6, 7, 8] as const;

type Rank = typeof Ranks[number];
export default Rank;
