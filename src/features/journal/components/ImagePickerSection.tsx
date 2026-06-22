import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
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

type PickMode = 'back' | 'front' | 'library';

export default function ImagePickerSection({ imagePaths, onChange }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  const remaining = 3 - imagePaths.length;
  const canAdd = remaining > 0;

  async function pick(mode: PickMode) {
    setSheetVisible(false);
    useSecurityStore.getState().setPickingMedia(true);
    await new Promise<void>(r => setTimeout(r, 300));

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
        { mediaType: 'photo', cameraType: mode, quality: 0.8, saveToPhotos: false },
        res => onDone((res.assets ?? []).map(a => a.uri).filter((u): u is string => !!u)),
      );
    }
  }

  function remove(index: number) {
    onChange(imagePaths.filter((_, i) => i !== index));
  }

  const sheetBg = isDark ? Colors.slate900 : Colors.white;
  const rowBg   = isDark ? Colors.slate800 : Colors.slate50;
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
            onPress={() => setSheetVisible(true)}
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
            <Text style={{
              fontSize: 9,
              fontWeight: '700',
              letterSpacing: 0.8,
              color: theme[500],
            }}>
              ADD PHOTO
            </Text>
          </TouchableOpacity>
        )}
      </View>

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
                onPress={() => pick('back')}
                rowBg={rowBg}
                labelColor={labelColor}
              />
              <SheetRow
                icon={<Images size={19} color={labelColor} />}
                label="Photo Library"
                onPress={() => pick('library')}
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
