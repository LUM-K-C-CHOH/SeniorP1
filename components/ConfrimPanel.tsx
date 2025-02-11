/**
 * Delete Confrim Panel
 * RTHA
 * 
 * Created by Thornton at 02/10/2025
 */
import React from 'react';
import Modal from 'react-native-modal';

import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

type ConfirmPanelProps = {
  visible: boolean,
  titleText: string,
  bodyText?: string,
  bodyElement?: React.ReactNode
  resultVisible?: boolean,
  resultElement?: React.ReactNode,
  positiveButtonText: string,
  negaitiveButtonText: string,
  onConfirm: () => void
  onCancel: () => void
};

const ConfirmPanel = ({
  visible,
  titleText,
  bodyElement,
  bodyText,
  resultVisible,
  resultElement,
  positiveButtonText,
  negaitiveButtonText,
  onConfirm,
  onCancel
}: ConfirmPanelProps): JSX.Element => {
  return (
    <Modal
      isVisible={visible}
      swipeDirection={['down']}
      style={styles.confirmPanel}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      onSwipeComplete={onCancel}
      animationInTiming={300}
      animationOutTiming={300}
    >
      {resultVisible&&
        <>{resultElement}</>
      }
      {!resultVisible&&
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.titleText}>{titleText}</ThemedText>            
          </View>
          <View style={styles.body}>
            {bodyElement&& <>{bodyElement}</>}
            {bodyText&&
              <ThemedText style={styles.text}>{bodyText}</ThemedText>
            }
          </View>
          <View style={styles.actions}>
              <TouchableHighlight
                onPress={onCancel}
                style={styles.button}
              >
                <View style={[styles.buttonTextWrapper, { borderRightColor: '#e2e2e2', borderRightWidth: 1 }]}>
                  <Text style={styles.buttonText}>{negaitiveButtonText}</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={onConfirm}
                style={styles.button}
              >
                <View style={styles.buttonTextWrapper}>
                  <Text style={styles.buttonText}>{positiveButtonText}</Text>
                </View>
              </TouchableHighlight>
          </View>
        </ThemedView>
      }
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmPanel: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    paddingTop: 30
  },
  header: {
    alignItems: 'center'
  },
  titleText: {
    fontSize: 17,
    fontWeight: 600,
    color: '#000'
  },
  body: {
    width: 238,
    paddingBottom: 30,
    alignSelf: 'center',
    marginTop: 10
  },
  text: {
    fontSize: 13,
    fontWeight: 400,
    color: '#000',
    textAlign: 'center'
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1
  },
  button: {
    flex: 1,
    height: 45
  },
  buttonTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000'
  }
});

export const ConfirmResultStyle = StyleSheet.create({
  container: {
    rowGap: 10,
    paddingTop: 30,
    paddingBottom: 30
  },
  titleText: {
    textAlign: 'center'
  },
  iconWrapper: {
    alignItems: 'center'
  },
  actionsWrapper: {
    flexDirection: 'row',
    columnGap: 5,
    justifyContent: 'center'
  },
  labelText: {

  },
  linkText: {
    fontWeight: 600
  }
});

export default ConfirmPanel;