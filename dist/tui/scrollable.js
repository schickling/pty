// ScrollRegion: manages offset, selection, and viewport for scrollable lists
export function createScrollRegion(totalItems, viewportHeight) {
    return { offset: 0, selectedIndex: 0, totalItems, viewportHeight };
}
export function updateScrollRegion(region, totalItems, viewportHeight) {
    const vh = viewportHeight ?? region.viewportHeight;
    const sel = Math.min(region.selectedIndex, Math.max(0, totalItems - 1));
    return ensureVisible({ ...region, totalItems, viewportHeight: vh, selectedIndex: sel });
}
export function scrollUp(region) {
    if (region.selectedIndex <= 0)
        return region;
    return ensureVisible({ ...region, selectedIndex: region.selectedIndex - 1 });
}
export function scrollDown(region) {
    if (region.selectedIndex >= region.totalItems - 1)
        return region;
    return ensureVisible({ ...region, selectedIndex: region.selectedIndex + 1 });
}
export function pageUp(region) {
    const newIndex = Math.max(0, region.selectedIndex - region.viewportHeight);
    return ensureVisible({ ...region, selectedIndex: newIndex });
}
export function pageDown(region) {
    const newIndex = Math.min(region.totalItems - 1, region.selectedIndex + region.viewportHeight);
    return ensureVisible({ ...region, selectedIndex: newIndex });
}
export function scrollToTop(region) {
    return ensureVisible({ ...region, selectedIndex: 0 });
}
export function scrollToBottom(region) {
    return ensureVisible({ ...region, selectedIndex: Math.max(0, region.totalItems - 1) });
}
function ensureVisible(region) {
    let { offset, selectedIndex, viewportHeight } = region;
    if (selectedIndex < offset) {
        offset = selectedIndex;
    }
    else if (selectedIndex >= offset + viewportHeight) {
        offset = selectedIndex - viewportHeight + 1;
    }
    offset = Math.max(0, Math.min(offset, Math.max(0, region.totalItems - viewportHeight)));
    return { ...region, offset, selectedIndex };
}
/** Return the visible slice of items given a scroll region. */
export function visibleSlice(items, region) {
    return items.slice(region.offset, region.offset + region.viewportHeight);
}
