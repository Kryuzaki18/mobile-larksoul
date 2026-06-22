import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  ActionSheetIOS,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Camera, Images, X } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../utils/themes';
import { useActiveTheme } from '../../../hooks/useActiveTheme';
import { useSecurityStore } from '../../../store/securityStore';

const THUMB = 80;
const RADIUS = 10;

interface Props {
  imagePaths: string[];
  onChange: (paths: string[]) => void;
}

type PickMode = 'back' | 'library';

export default function ImagePickerSection({ imagePaths, onChange }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [pendingMode, setPendingMode] = useState<PickMode | null>(null);

  const remaining = 3 - imagePaths.length;
  const canAdd = remaining > 0;

  useEffect(() => {
    if (Platform.OS === 'ios' || sheetVisible || pendingMode === null) return;
    const mode = pendingMode;
    setPendingMode(null);
    const t = setTimeout(() => launchPick(mode), 100);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetVisible, pendingMode]);

  async function launchPick(mode: PickMode) {
    useSecurityStore.getState().setPickingMedia(true);

    if (Platform.OS === 'android' && mode === 'back') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'LarkSoul needs access to your camera to add photos to journal entries.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        useSecurityStore.getState().setPickingMedia(false);
        Alert.alert('Camera access denied', 'Enable camera permission in Settings to use this feature.');
        return;
      }
    }

    const onDone = (uris: string[]) => {
      useSecurityStore.getState().setPickingMedia(false);
      if (uris.length > 0) onChange([...imagePaths, ...uris]);
    };

    if (mode === 'library') {
      launchImageLibrary(
        { mediaType: 'photo', selectionLimit: remaining, quality: 0.8 },
        res => onDone((res.assets ?? []).map(a => a.uri).filter((u): u is string => !!u)),
      );
    } else {
      launchCamera(
        { mediaType: 'photo', cameraType: 'back', quality: 0.8, saveToPhotos: false },
        res => onDone((res.assets ?? []).map(a => a.uri).filter((u): u is string => !!u)),
      );
    }
  }

  function openSheet() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Camera', 'Photo Library'], cancelButtonIndex: 0 },
        index => {
          if (index === 1) launchPick('back');
          else if (index === 2) launchPick('library');
        },
      );
    } else {
      setSheetVisible(true);
    }
  }

  function remove(index: number) {
    onChange(imagePaths.filter((_, i) => i !== index));
  }

  const sheetBg    = isDark ? Colors.slate900 : Colors.white;
  const rowBg      = isDark ? Colors.slate800 : Colors.slate50;
  const labelColor = isDark ? Colors.slate100 : Colors.slate900;

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        {imagePaths.map((uri, i) => (
          <View key={`${uri}-${i}`} style={{ width: THUMB, height: THUMB }}>
            <Image
              source={{ uri }}
              style={{ width: THUMB, height: THUMB, borderRadius: RADIUS }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => remove(i)}
              hitSlop={8}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: Colors.slate800,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={11} color={Colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        ))}

        {canAdd && (
          <TouchableOpacity
            onPress={openSheet}
            activeOpacity={0.7}
            style={{
              width: THUMB,
              height: THUMB,
              borderRadius: RADIUS,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: isDark ? Colors.slate600 : Colors.slate300,
              backgroundColor: isDark ? Colors.slate800 : Colors.slate50,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Camera size={20} color={theme[500]} />
            <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: theme[500] }}>
              ADD PHOTO
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {Platform.OS === 'android' && (
        <Modal
          visible={sheetVisible}
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setSheetVisible(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: Colors.backdrop, justifyContent: 'flex-end' }}
            onPress={() => setSheetVisible(false)}
          >
            <Pressable>
              <View style={{
                backgroundColor: sheetBg,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: 40,
                paddingHorizontal: 16,
              }}>
                <View style={{
                  width: 36, height: 4, borderRadius: 2,
                  backgroundColor: isDark ? Colors.slate700 : Colors.slate200,
                  alignSelf: 'center',
                  marginBottom: 20,
                }} />

                <SheetRow
                  icon={<Camera size={19} color={labelColor} />}
                  label="Camera"
                  onPress={() => { setPendingMode('back'); setSheetVisible(false); }}
                  rowBg={rowBg}
                  labelColor={labelColor}
                />
                <SheetRow
                  icon={<Images size={19} color={labelColor} />}
                  label="Photo Library"
                  onPress={() => { setPendingMode('library'); setSheetVisible(false); }}
                  rowBg={rowBg}
                  labelColor={labelColor}
                />

                <TouchableOpacity
                  onPress={() => setSheetVisible(false)}
                  activeOpacity={0.7}
                  style={{
                    marginTop: 8,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: isDark ? Colors.slate800 : Colors.slate100,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '600', color: isDark ? Colors.slate400 : Colors.slate500 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

function SheetRow({
  icon, label, onPress, rowBg, labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  rowBg: string;
  labelColor: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: rowBg,
      }}
    >
      {icon}
      <Text style={{ fontSize: 15, fontWeight: '500', color: labelColor }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
