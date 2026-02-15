import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

interface Props {
  onInstructionChange?: (instruction: string) => void;
}

const DeliveryInstructions: React.FC<Props> = React.memo(({ onInstructionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['leave-guard']);
  const [customInstruction, setCustomInstruction] = useState('');

  const options = [
    { id: 'no-bell', label: "Don't ring the bell", icon: '🔔' },
    { id: 'no-call', label: "Don't call", icon: '📞' },
    { id: 'leave-guard', label: 'Leave order with guard', icon: '👮' },
  ];

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
  };

  const handleTextChange = (text: string) => {
    setCustomInstruction(text);
    onInstructionChange?.(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery instructions</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => toggleOption(option.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={styles.optionText}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Type in any other instructions..."
        placeholderTextColor="#999999"
        value={customInstruction}
        onChangeText={handleTextChange}
        multiline
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  optionButtonSelected: {
    borderColor: '#FF9800',
    backgroundColor: 'white',
  },
  optionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  optionText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 14,
    color: '#000000',
    minHeight: 40,
    textAlignVertical: 'top',
  },
});

DeliveryInstructions.displayName = 'DeliveryInstructions';

export default DeliveryInstructions;

