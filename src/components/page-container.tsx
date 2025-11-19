import clsx from "clsx";

const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col h-full overflow-y-auto pb-[calc(env(safe-area-inset-bottom) + 1rem)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
