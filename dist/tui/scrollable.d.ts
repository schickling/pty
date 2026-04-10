export interface ScrollRegion {
    offset: number;
    selectedIndex: number;
    totalItems: number;
    viewportHeight: number;
}
export declare function createScrollRegion(totalItems: number, viewportHeight: number): ScrollRegion;
export declare function updateScrollRegion(region: ScrollRegion, totalItems: number, viewportHeight?: number): ScrollRegion;
export declare function scrollUp(region: ScrollRegion): ScrollRegion;
export declare function scrollDown(region: ScrollRegion): ScrollRegion;
export declare function pageUp(region: ScrollRegion): ScrollRegion;
export declare function pageDown(region: ScrollRegion): ScrollRegion;
export declare function scrollToTop(region: ScrollRegion): ScrollRegion;
export declare function scrollToBottom(region: ScrollRegion): ScrollRegion;
/** Return the visible slice of items given a scroll region. */
export declare function visibleSlice<T>(items: T[], region: ScrollRegion): T[];
