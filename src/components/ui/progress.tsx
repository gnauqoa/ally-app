import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  indicatorProps,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorProps?: React.ComponentProps<typeof ProgressPrimitive.Indicator>;
}) {
  const {
    className: indicatorClassName,
    style: indicatorStyle,
    ...indicatorRestProps
  } = indicatorProps || {};
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all bg-primary",
          indicatorClassName
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...indicatorStyle,
        }}
        {...indicatorRestProps}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
