import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ScannerOverlay: React.FC = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.topOverlay}></View>
      <View style={styles.center}>
        <View style={styles.scanBox}></View>
        <Text style={styles.instructions}>Align the barcode inside the box</Text>
      </View>
      <View style={styles.bottomOverlay}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  instructions: {
    position: 'absolute',
    top: '60%',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScannerOverlay;
