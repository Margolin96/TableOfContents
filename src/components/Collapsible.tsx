import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface CollapsibleProps {
  /** Whether the content should be visible or hidden. */
  visible: Boolean;

  /** The duration of the transition animation in milliseconds. */
  duration?: number;
}

/**
 * A collapsible component that can hide or show its children with a smooth transition.
 */
export const Collapsible = ({ visible, duration = 150, children }: PropsWithChildren<CollapsibleProps>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  // Set content height based on visibility and content height.
  useEffect(() => {
    if (!nodeRef.current) return;

    setHeight(visible ? nodeRef.current.scrollHeight : 0);
  }, [visible]);

  return (
    <div
      ref={nodeRef}
      className="transition-all overflow-hidden h-screen"
      style={{
        maxHeight: `${height}px`,
        transitionDuration: `${duration}ms`
      }}
    >
      {visible && children}
    </div>
  );
};
