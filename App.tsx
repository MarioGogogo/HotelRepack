/**
 * 主应用入口 - 根导航
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import ApkUpdateModal from './src/components/ApkUpdateModal';
import { initApkUpdateListeners } from './src/services/ApkUpdateService';

function App(): React.JSX.Element {
  useEffect(() => {
    initApkUpdateListeners();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: '#6366f1',
            background: '#f2f2f7',
            card: '#ffffff',
            text: '#0f172a',
            border: '#e2e8f0',
            notification: '#6366f1',
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
      <ApkUpdateModal />
    </SafeAreaProvider>
  );
}

export default App;
