import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ScannerOverlay from './ScannerOverlay';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (isValidBarcode(data)) {
      onScan(data);
    } else {
      Alert.alert('Invalid Barcode', 'This barcode is not recognized.');
    }
  };

  const isValidBarcode = (data: string) => data.length > 5; // Example validation

  return (
    <RNCamera style={styles.camera} onBarCodeRead={handleBarCodeScanned}>
      <ScannerOverlay />
    </RNCamera>
  );
};

const styles = StyleSheet.create({
  camera: { flex: 1 },
});

export default BarcodeScanner;
