import { createContext, useContext, useState } from "react"

export const MenuSelectionContext = createContext();
export const useMenuSelector = () => useContext(MenuSelectionContext)

export default function MenuSelectionProvider({ children }) {
  const [selectedLink, setSelectedLink] = useState('dashboard');
  const [selectedSide, setSelectedSide] = useState('job details');

  return (
    <MenuSelectionContext.Provider
      value={{
        selectedLink,
        setSelectedLink,
        selectedSide,
        setSelectedSide
      }}
    >
      { children }
    </MenuSelectionContext.Provider>
  )
}
