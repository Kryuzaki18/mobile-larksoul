import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { FileText, Code2, X } from 'lucide-react-native';

import type { JournalEntry } from '../../../models/interfaces/users.model';
import { exportJournal, type ExportFormat } from '../../../services/exportService';
import { useSecurityStore } from '../../../store/securityStore';

interface Props {
  visible: boolean;
  entries: JournalEntry[];
  userName: string;
  onClose: () => void;
}

const FORMATS: {
  id: ExportFormat;
  label: string;
  desc: string;
  Icon: React.FC<{ size: number; color: string }>;
  accent: string;
}[] = [
  {
    id: 'pdf',
    label: 'PDF Document',
    desc: 'Formatted and ready to print or share',
    Icon: FileText,
    accent: '#8b5cf6',
  },
  {
    id: 'json',
    label: 'JSON Data',
    desc: 'Raw data for backup or migration',
    Icon: Code2,
    accent: '#0ea5e9',
  },
];

export default function ExportModal({ visible, entries, userName, onClose }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (loading) return;
    setLoading(format);
    useSecurityStore.getState().suppressLock();
    try {
      await exportJournal(format, entries, userName);
      onClose();
    } catch (err: unknown) {
      useSecurityStore.getState().clearSuppressLock();
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      Alert.alert('Export Failed', msg);
    } finally {
      setLoading(null);
    }
  };

  const sheetBg = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e293b' : '#f1f5f9';
  const cardBg = isDark ? '#0d1929' : '#f8fafc';
  const titleColor = isDark ? '#f8fafc' : '#0f172a';
  const subtitleColor = isDark ? '#64748b' : '#94a3b8';
  const handleColor = isDark ? '#334155' : '#e2e8f0';
  const cancelBg = isDark ? '#1e293b' : '#f1f5f9';

  const entryCount = entries.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={loading ? undefined : onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: sheetBg,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: Platform.OS === 'ios' ? 40 : 28,
                paddingHorizontal: 20,
              }}
            >
              {/* Handle */}
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: handleColor,
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
              />

              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 20,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: titleColor, marginBottom: 4 }}>
                    Export Journal
                  </Text>
                  <Text style={{ fontSize: 13, color: subtitleColor }}>
                    {entryCount} {entryCount === 1 ? 'entry' : 'entries'} · choose a format
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={loading ? undefined : onClose}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: cancelBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                  }}
                  activeOpacity={0.7}
                >
                  <X size={14} color={subtitleColor} />
                </TouchableOpacity>
              </View>

              {/* Format options */}
              {FORMATS.map(({ id, label, desc, Icon, accent }) => {
                const isActive = loading === id;
                const accentBg = isDark
                  ? `${accent}1e`
                  : id === 'pdf' ? '#f5f3ff' : '#f0f9ff';

                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => handleExport(id)}
                    disabled={loading !== null}
                    activeOpacity={0.72}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 14,
                      backgroundColor: cardBg,
                      borderWidth: 1.5,
                      borderColor: isActive ? accent : borderColor,
                      marginBottom: 10,
                      opacity: loading !== null && !isActive ? 0.45 : 1,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: accentBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                      }}
                    >
                      {isActive ? (
                        <ActivityIndicator size="small" color={accent} />
                      ) : (
                        <Icon size={20} color={accent} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: titleColor,
                          marginBottom: 3,
                        }}
                      >
                        {label}
                      </Text>
                      <Text style={{ fontSize: 12, color: subtitleColor, lineHeight: 17 }}>
                        {desc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Cancel */}
              <TouchableOpacity
                onPress={loading ? undefined : onClose}
                activeOpacity={0.7}
                style={{
                  marginTop: 4,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: cancelBg,
                  alignItems: 'center',
                  opacity: loading !== null ? 0.45 : 1,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: subtitleColor }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
