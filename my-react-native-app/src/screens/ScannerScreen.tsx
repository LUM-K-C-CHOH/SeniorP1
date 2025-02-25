import React from 'react';
import { View, Text, Button } from 'react-native';

const ScannerScreen = ({ navigation }) => {
  const handleScan = () => {
    // Implement scanning functionality here
    alert('Scanning...');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Scanner Screen</Text>
      <Button title="Start Scan" onPress={handleScan} />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default ScannerScreen;