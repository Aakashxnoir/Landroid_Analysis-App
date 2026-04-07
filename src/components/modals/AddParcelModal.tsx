import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import centroid from '@turf/centroid';
import bbox from '@turf/bbox';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import ParcelService from '../../services/parcelService';
import { useAuth } from '../../hooks/useAuth';

interface AddParcelModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddParcelModal: React.FC<AddParcelModalProps> = ({ visible, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [landownerName, setLandownerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [geojsonFile, setGeojsonFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilePick = async () => {
    try {
      let res;
      
      if (Platform.OS === 'web') {
        res = await new Promise<any>((resolve, reject) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.geojson,.json';
          input.onchange = (e: any) => {
            const file = e.target?.files?.[0];
            if (!file) {
              reject(new Error('cancelled'));
              return;
            }
            resolve({
              name: file.name,
              uri: URL.createObjectURL(file)
            });
          };
          input.onerror = () => reject(new Error('picker failed'));
          input.click();
        });
      } else {
        const DocumentPicker = require('react-native-document-picker').default;
        res = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles],
        });
      }

      if (res.name && !res.name.endsWith('.geojson') && !res.name.endsWith('.json')) {
        setError('Please upload a valid .geojson file.');
        return;
      }
      setGeojsonFile(res);
      setError(null);
    } catch (err: any) {
      if (err.message !== 'cancelled') {
        setError('Failed to pick file.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!landownerName.trim() || !phoneNumber.trim()) {
      setError('Name and Phone Number are required.');
      return;
    }
    if (!geojsonFile) {
      setError('Please upload a boundary.geojson file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch local file content to string
      const response = await fetch(geojsonFile.uri);
      const fileText = await response.text();
      let geojsonObject;
      
      try {
        geojsonObject = JSON.parse(fileText);
      } catch (e) {
        throw new Error('Invalid JSON format in the uploaded file.');
      }

      // GeoJSON parsing using turf
      const center = centroid(geojsonObject);
      const boundingBox = bbox(geojsonObject);

      const centroidCoords = center.geometry.coordinates; // [lng, lat]

      const parcelData = {
        landowner_name: landownerName,
        phone_number: phoneNumber,
        geojson: geojsonObject,
        centroid: centroidCoords,
        bbox: boundingBox,
        owner_id: user?.uid // assigning to current user/consultant
      };

      const result = await ParcelService.addParcel(parcelData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Success
      setLandownerName('');
      setPhoneNumber('');
      setGeojsonFile(null);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the parcel.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Parcel</Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={DESIGN_SYSTEM.COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Landowner Name</Text>
            <Input 
              value={landownerName}
              onChangeText={setLandownerName}
              placeholder="e.g. John Doe"
              editable={!isLoading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <Input 
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="e.g. +1 234 567 8900"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Boundary GeoJSON</Text>
            <TouchableOpacity 
              style={styles.filePicker} 
              onPress={handleFilePick}
              disabled={isLoading}
            >
              <Ionicons name={geojsonFile ? "checkmark-circle" : "document-attach-outline"} size={24} color={geojsonFile ? DESIGN_SYSTEM.COLORS.ACCENT : DESIGN_SYSTEM.COLORS.PRIMARY} />
              <Text style={styles.filePickerText}>
                {geojsonFile ? geojsonFile.name : "Select boundary.geojson"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <Button 
              title="Cancel" 
              variant="secondary" 
              onPress={onClose} 
              style={[styles.button, styles.cancelButton]} 
              disabled={isLoading}
            />
            <Button 
              title={isLoading ? "Saving..." : "Create Parcel"} 
              onPress={handleSubmit} 
              style={styles.button} 
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    ...DESIGN_SYSTEM.SHADOWS.MEDIUM,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H2,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: DESIGN_SYSTEM.COLORS.ERROR,
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  filePickerText: {
    marginLeft: 8,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 12,
  }
});

export default AddParcelModal;
