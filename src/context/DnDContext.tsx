import { createContext, useState, ReactNode } from "react";

type DnDContextType = [type: string, setType: React.Dispatch<React.SetStateAction<string>>];

const DEFAULT_NODE_TYPE = "default";

const DnDContext = createContext<DnDContextType>([DEFAULT_NODE_TYPE, () => {}]);

export default DnDContext;

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<string>(DEFAULT_NODE_TYPE);

  return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};
