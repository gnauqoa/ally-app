const TabTitle = ({ title }: { title: string }) => {
  return (
    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 text-lg font-medium">
      {title}
    </p>
  );
};

export default TabTitle;