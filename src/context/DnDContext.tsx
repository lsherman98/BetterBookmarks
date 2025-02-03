import { createContext, useState } from "react";

type DnDContextType = [string, React.Dispatch<React.SetStateAction<string>>];
const DnDContext = createContext<DnDContextType>(["default", () => {}]);

export default DnDContext;

export const DnDProvider = ({ children }) => {
  const [type, setType] = useState("default");

  return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};
