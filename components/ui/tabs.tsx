// Simple Tabs Component - Custom implementation for React Native
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface TabsProps {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});

const Tabs = ({ defaultValue = '', className = '', children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View className={`w-full ${className}`}>
        {children}
      </View>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

const TabsList = ({ className = '', children }: TabsListProps) => {
  return (
    <View className={`flex-row bg-white/10 rounded-lg p-1 mb-4 ${className}`}>
      {children}
    </View>
  );
};

TabsList.displayName = 'TabsList';

const TabsTrigger = ({ value, className = '', children }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  const isActive = activeTab === value;

  return (
    <Pressable
      onPress={() => setActiveTab(value)}
      className={`flex-1 py-3 px-2 rounded-md ${isActive ? 'bg-white/20' : 'bg-transparent'} ${className}`}
    >
      <Text className={`text-center font-medium text-xs ${isActive ? 'text-white' : 'text-white/70'}`}>
        {children}
      </Text>
    </Pressable>
  );
};

TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = ({ value, className = '', children }: TabsContentProps) => {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return (
    <View className={`mt-4 ${className}`}>
      {children}
    </View>
  );
};

TabsContent.displayName = 'TabsContent';

// Attach sub-components to the main Tabs component
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs, TabsContent, TabsList, TabsTrigger };
