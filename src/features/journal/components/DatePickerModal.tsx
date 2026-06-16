import { Modal, Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalendarView from '../../home/components/CalendarView';

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export default function DatePickerModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: DatePickerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/30" style={{ paddingTop: insets.top }}>
        <View className="relative">
          <CalendarView
            selectedDate={selectedDate}
            onDayPress={date => {
              onSelect(date);
              onClose();
            }}
          />

          <View className="absolute bottom-0 left-0 right-0 items-center" style={{ marginBottom: -20 }}>
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
            >
              <X size={16} color="#475569" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
