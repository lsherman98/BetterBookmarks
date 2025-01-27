import DnDContext from "@/context/DnDContext";
import {  useContext } from "react";

export const useDnD = () => {
  return useContext(DnDContext);
};
