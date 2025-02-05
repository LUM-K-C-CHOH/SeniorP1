import React, { useState, useEffect, useRef } from 'react';
import CustomButton from '@/components/CustomButton';
import Modal from 'react-native-modal';

import {
  Image,
  ListRenderItemInfo,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { getMedicationList } from '@/services/medication';
import { IMedication, TResponse } from '@/@types';
import {
  BellIcon,
  DeleteIcon,
  EditIcon,
  FlyIcon,
  PillIcon,
  SettingIcon,
  StockIcon
} from '@/utils/assets';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const initialRef = useRef<boolean>();
  const router = useRouter();
  
  const { t } = useTranslation();

  const [medicationList, setMedicationList] = useState<IMedication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmPopupOptions, setDeleteConfirmPopupOptions] = useState<{[k: string]: boolean|number}>({ opened: false, id: -1 });

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;
    getMedicationList()
      .then((res: TResponse) => {
        if (res.success) {
          setMedicationList(res.data?? []);
        } else {

        }
      });
  }, []);

  const getColorByLevel = (stock: number): string => {
    if (stock > 15) {
      return '#34C759';
    } else if (stock > 5) {
      return '#FF9500';
    } else {
      return 'red';
    }
  }

  const handleEditRow = (rowMap: RowMap<IMedication>, id: number): void => {
    const find = medicationList.find(v => v.id === id);
    
    if (!find) return;

    router.push({ pathname: '/medication/edit', params: { id } });
  }

  const handleDeleteRow = (rowMap: RowMap<IMedication>, id: number): void => {
    console.log('delete', id);
    setDeleteConfirmPopupOptions({ opened: true, id });
  }

  const handleDeleteConfrim = (): void => {
    const delteId: number = deleteConfirmPopupOptions.id as number;

    if (delteId < 0) return;
    
    setDeleteConfirmPopupOptions({ opened: false, id: -1 });
  }

  const handleOpenedRow = (): void => {

  }

  const handleLoadData = async (): Promise<void> => {
    setIsLoading(true);
    getMedicationList()
      .then((res: TResponse) => {
        setIsLoading(false);

        if (res.success) {
          setMedicationList(res.data?? []);
        } else {

        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  }

  const handleAddMedication = (): void => {
    router.push('/medication/add');
  }

  const renderItem = (data: ListRenderItemInfo<IMedication>) => (
    <ThemedView style={styles.itemWrapper}>
      <Image source={{ uri: data.item.image }} width={60} height={60}/>
      <ThemedView style={styles.infoWrapper}>
        <ThemedView style={{ flexGrow: 1 }}>
          <ThemedText style={styles.itemTitle}>{data.item.name}</ThemedText>
          <ThemedView style={styles.itemTextWrapper}>
            <PillIcon />
            <ThemedText style={styles.normalText}>{data.item.dosage}</ThemedText>
            <ThemedText>{'•'}</ThemedText>
            <ThemedText style={styles.normalText}>{data.item.frequency}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.itemTextWrapper}>
            <StockIcon color={getColorByLevel(data.item.stock)} />
            <ThemedText
              style={[styles.normalText, { color: getColorByLevel(data.item.stock) }]}
            >
              {`${data.item.stock} Tablets`}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={{ rowGap: 5 }}>
          <ThemedView style={{ flexDirection: 'row', columnGap: 5 }}>
            <BellIcon />
            <FlyIcon />
          </ThemedView>
          <ThemedView>
            <TouchableOpacity onPress={() => {}}>
              <SettingIcon />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderHiddenItem = (data: ListRenderItemInfo<IMedication>, rowMap: RowMap<IMedication>) => (
    <ThemedView style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => handleEditRow(rowMap, data.item.id)}
      >
        <EditIcon />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => handleDeleteRow(rowMap, data.item.id)}
      >
        <DeleteIcon />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <Modal
        isVisible={deleteConfirmPopupOptions.opened as boolean}
        onBackdropPress={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        onBackButtonPress={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        onSwipeComplete={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        swipeDirection="left"
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
      >
        <ThemedView style={pstyles.deleteConfirmModalContainer}>
          <ThemedView style={pstyles.deleteConfirmModalBody}>
            <ThemedText style={pstyles.deleteConfirmModalBodyText}>Are you sure to delete it?</ThemedText>
          </ThemedView>
          <ThemedView style={pstyles.deleteConfirmModalActions}>
            <TouchableOpacity
              style={pstyles.deleteConfirmModalNegativeButton}
              onPress={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
            >
              <Text style={pstyles.deleteConfirmModalNegativeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={pstyles.deleteConfirmModalPositiveButton}
              onPress={handleDeleteConfrim}
            >
              <Text style={pstyles.deleteConfirmModalPositiveButtonText}>Delete</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
      <ThemedView style={styles.listHeader}>
        <ThemedText
          style={[styles.listHeaderText, { width: '20%' }]}
        >
          {t('medication_manage.item')}
        </ThemedText>
        <ThemedText
          style={[styles.listHeaderText, { width: '40%' }]}
        >
          {t('medication_manage.description')}
        </ThemedText>
        <ThemedText
          style={[styles.listHeaderText, { width: '40%' }]}
        >
          {t('medication_manage.refill_reminder')}
        </ThemedText>
      </ThemedView>
      <SwipeListView
        style={styles.mainWrapper}
        data={medicationList}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe={true}
        rightOpenValue={-150}
        previewRowKey={'0'}
        previewOpenValue={0}
        previewOpenDelay={3000}
        onRowDidOpen={handleOpenedRow}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleLoadData} />
        }
      />
      <ThemedView style={styles.actionWrapper}>
        <CustomButton onPress={handleAddMedication}>
          <Text style={styles.addMedicationButtonText}>+{t('medication_manage.add_medication')}</Text>
        </CustomButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  listHeader: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  listHeaderText: {
    textAlign: 'center',
    fontSize: 14
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    columnGap: 10,
  },
  infoWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#777',    
  },
  itemTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#000',
    columnGap: 5,
  },
  normalText: {
    fontSize: 14,
    fontWeight: 400,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#07d22d',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#fb4420',
    right: 0,
  },
  backTextWhite: {
    color: '#fff',
  },
  addMedicationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500
  },
  actionWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20
  }
});

const pstyles = StyleSheet.create({
  deleteConfirmModalContainer: {
    paddingHorizontal: 20,
    borderRadius: 10
  },
  deleteConfirmModalBody: {
    paddingVertical: 15
  },
  deleteConfirmModalBodyText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 400,
  },
  deleteConfirmModalActions: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    justifyContent: 'center',
    columnGap: 50
  },
  deleteConfirmModalNegativeButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#e8e7e7'
  },
  deleteConfirmModalNegativeButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 400
  },
  deleteConfirmModalPositiveButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fbc4c4'
  },
  deleteConfirmModalPositiveButtonText: {
    color: '#fc2727',
    fontSize: 14,
    fontWeight: 400
  },
});
