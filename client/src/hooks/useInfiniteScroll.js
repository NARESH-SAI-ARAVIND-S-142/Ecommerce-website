import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scrolling using Intersection Observer.
 */
export const useInfiniteScroll = (hasMore, loading, onLoadMore) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
};

export default useInfiniteScroll;
