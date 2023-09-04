import { PropsWithChildren, useEffect, useState } from 'react';

interface CollapsibleProps {
  /** Whether the content should be visible or hidden. */
  visible: Boolean;

  /** The duration of the transition animation in milliseconds. */
  duration?: number;
}

/**
 * A collapsible component that can hide or show its children with a smooth transition.
 */
export const Collapsible = ({ visible, duration = 300, children }: PropsWithChildren<CollapsibleProps>) => {
  const [visibility, setVisibility] = useState<Boolean>(visible);
  const [maxHeight, setMaxHeight] = useState<string>();

  useEffect(() => {
    if (visible) {
      setVisibility(visible);
    } else {
      setTimeout(() => {
        setVisibility(visible);
      }, duration);
    }

    setMaxHeight('100vh');

    setTimeout(() => {
      setMaxHeight(visible ? 'unset' : '0');
    }, visible ? duration : 1);
  }, [duration, visible]);

  return (
    <div
      className="transition-all overflow-hidden"
      style={{ maxHeight, transitionDuration: `${duration}ms` }}
    >
      {visibility && children}
    </div>
  );
};
