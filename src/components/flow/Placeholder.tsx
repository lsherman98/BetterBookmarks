type PlaceHolderProps = {
  nodeType: string;
};

export const Placeholder = ({ nodeType }: PlaceHolderProps) => (
  <div className="contents">
    <div className="bg-gray-200 w-full h-2.5 mb-1" />
    <div className="bg-gray-200 w-full h-2.5 mb-1" />
    <div className="bg-gray-200 w-full h-2.5" />
  </div>
);
