export interface FuzzyResult {
    match: boolean;
    score: number;
}
/**
 * Fuzzy match a query against a target string.
 * Characters in the query must appear in the target in order, but not adjacently.
 * Returns whether it matched and a score (higher = better match).
 *
 * Scoring:
 * - Consecutive character matches get a bonus
 * - Matches at word boundaries (after -, _, /, space, or start of string) get a bonus
 * - Shorter targets score higher for the same query
 * - Prefix matches score higher than mid-string matches
 */
export declare function fuzzyMatch(query: string, target: string): FuzzyResult;
