import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// Context para manejar el estado de tabs
const TabsContext = createContext({});

export const Tabs = ({ defaultValue, value, onValueChange, children, className, ...props }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue || '');

  const currentValue = value !== undefined ? value : selectedTab;

  const handleValueChange = useCallback(
    (newValue) => {
      if (value === undefined) {
        setSelectedTab(newValue);
      }
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [value, onValueChange]
  );

  const contextValue = useMemo(
    () => ({ value: currentValue, onValueChange: handleValueChange }),
    [currentValue, handleValueChange]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={clsx('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'inline-flex h-10 items-center justify-center rounded-lg bg-gray-900/50 p-1',
        'border border-cyan-500/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className, disabled, ...props }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={clsx(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2',
        'text-sm font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200',
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
};

export const TabsContent = ({ value, children, className, ...props }) => {
  const { value: selectedValue } = useContext(TabsContext);

  if (selectedValue !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={clsx('mt-4', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Tabs;
