/**
 * Skeleton loader components for async content placeholders.
 * Provides visual loading states instead of spinners.
 */

export const SkeletonBox = ({ className = '', ...props }) => (
  <div className={`skeleton ${className}`} {...props} />
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton h-3"
        style={{
          width: i === lines - 1 ? '60%' : '100%',
        }}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`glass rounded-2xl overflow-hidden ${className}`}>
    <SkeletonBox className="w-full h-56" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-3 w-1/3" />
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex items-center justify-between pt-2">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return <SkeletonBox className={`rounded-full ${sizes[size]} ${className}`} />;
};

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {/* Header */}
    <div className="flex gap-4 pb-3 border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBox key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3">
        {Array.from({ length: cols }).map((_, j) => (
          <SkeletonBox key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

const Skeleton = {
  Box: SkeletonBox,
  Text: SkeletonText,
  Card: SkeletonCard,
  Avatar: SkeletonAvatar,
  Table: SkeletonTable,
};

export default Skeleton;
