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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Camera, Images, X } from 'lucide-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { ImagePickerResponse } from 'react-native-image-picker';
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
  // URIs that have already rendered — initialised with whatever was already
  // in the list at mount so pre-existing photos don't shimmer.
  const [loadedUris, setLoadedUris] = useState<ReadonlySet<string>>(
    () => new Set(imagePaths),
  );

  const remaining = 3 - imagePaths.length;
  const canAdd = remaining > 0;

  function markLoaded(uri: string) {
    setLoadedUris(prev => {
      if (prev.has(uri)) return prev;
      const next = new Set(prev);
      next.add(uri);
      return next;
    });
  }

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

    const handleResponse = (res: ImagePickerResponse) => {
      if (res.errorCode === 'permission') {
        useSecurityStore.getState().setPickingMedia(false);
        Alert.alert('Permission denied', 'Enable camera or photo library access in your device Settings.');
        return;
      }
      if (res.errorCode === 'camera_unavailable') {
        useSecurityStore.getState().setPickingMedia(false);
        Alert.alert('Camera unavailable', 'No camera was found on this device.');
        return;
      }
      if (res.errorCode) {
        useSecurityStore.getState().setPickingMedia(false);
        Alert.alert('Error', res.errorMessage ?? 'Something went wrong. Please try again.');
        return;
      }
      onDone((res.assets ?? []).map(a => a.uri).filter((u): u is string => !!u));
    };

    if (mode === 'library') {
      launchImageLibrary(
        { mediaType: 'photo', selectionLimit: remaining, quality: 0.8 },
        handleResponse,
      );
    } else {
      launchCamera(
        { mediaType: 'photo', cameraType: 'back', quality: 0.8, saveToPhotos: false },
        handleResponse,
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
              onLoad={() => markLoaded(uri)}
            />
            {!loadedUris.has(uri) && (
              <ShimmerOverlay isDark={isDark} />
            )}
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
                  onPress={() => { setSheetVisible(false); setTimeout(() => launchPick('back'), 300); }}
                  rowBg={rowBg}
                  labelColor={labelColor}
                />
                <SheetRow
                  icon={<Images size={19} color={labelColor} />}
                  label="Photo Library"
                  onPress={() => { setSheetVisible(false); setTimeout(() => launchPick('library'), 300); }}
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

function ShimmerOverlay({ isDark }: { isDark: boolean }) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 650, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: RADIUS,
          backgroundColor: isDark ? Colors.slate700 : Colors.slate200,
        },
      ]}
    />
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
