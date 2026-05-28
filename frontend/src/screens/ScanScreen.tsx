import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { useTranslation } from '../hooks/TranslationContext';
import { Camera, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadAndPredictGrain } from '../services/api';
import GlassCard from '../components/GlassCard';

// Simulated grain templates for quick scan
const SIMULATED_TEMPLATES = [
  { name: 'Rice', emoji: '🍚', color: '#ECEFF1' },
  { name: 'Wheat', emoji: '🌾', color: '#FFF8E1' },
  { name: 'Corn', emoji: '🌽', color: '#FFFDE7' },
  { name: 'Chickpeas', emoji: '🥙', color: '#D7CCC8' }
];

export const ScanScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Scan beam animation
  const beamAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop the laser scan animation
    if (isAnalyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(beamAnim, {
            toValue: 240,
            duration: 1500,
            useNativeDriver: true
          }),
          Animated.timing(beamAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      beamAnim.setValue(0);
    }
  }, [isAnalyzing]);

  // Request permissions
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraPermission.granted && libraryPermission.granted;
  };

  const handleLaunchCamera = async () => {
    setErrorMsg(null);
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setErrorMsg("Camera permissions required.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processImage(result.assets[0].uri);
      }
    } catch (e) {
      setErrorMsg("Failed to launch camera.");
    }
  };

  const handleLaunchGallery = async () => {
    setErrorMsg(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        processImage(result.assets[0].uri);
      }
    } catch (e) {
      setErrorMsg("Failed to open gallery.");
    }
  };

  const handleSimulatedScan = (templateName: string) => {
    setErrorMsg(null);
    // Use an online placeholder image or dummy uri to represent the grain
    const simulatedUri = `https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400`;
    processImage(simulatedUri, `Simulated scan of ${templateName}`);
  };

  const processImage = async (uri: string, customNotes?: string) => {
    setSelectedImage(uri);
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const prediction = await uploadAndPredictGrain(uri, customNotes);
      setIsAnalyzing(false);
      // Navigate to Results page with prediction response
      navigation.navigate('Result', { scanData: prediction });
    } catch (err) {
      setIsAnalyzing(false);
      setErrorMsg(t('error'));
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setErrorMsg(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Banner */}
      <View style={styles.topInfo}>
        <Text style={[styles.title, { color: colors.text }]}>{t('scan_grain')}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Align grain sample within boundaries to begin identification.
        </Text>
      </View>

      {/* Main Viewfinder Frame */}
      <View style={[styles.viewfinderContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {selectedImage ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: selectedImage }} style={styles.viewfinderImage} />
            {isAnalyzing && (
              <Animated.View
                style={[
                  styles.scanBeam,
                  {
                    backgroundColor: colors.primary,
                    transform: [{ translateY: beamAnim }]
                  }
                ]}
              />
            )}
          </View>
        ) : (
          <View style={styles.viewfinderPlaceholder}>
            <Camera size={48} color={colors.textMuted} />
            <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
              Camera Viewfinder
            </Text>
          </View>
        )}

        {/* Boundary brackets visualizer */}
        <View style={[styles.bracket, styles.bracketTopLeft, { borderColor: colors.primary }]} />
        <View style={[styles.bracket, styles.bracketTopRight, { borderColor: colors.primary }]} />
        <View style={[styles.bracket, styles.bracketBottomLeft, { borderColor: colors.primary }]} />
        <View style={[styles.bracket, styles.bracketBottomRight, { borderColor: colors.primary }]} />

        {isAnalyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.analyzingText}>{t('analyzing')}</Text>
          </View>
        )}
      </View>

      {errorMsg && (
        <Text style={[styles.errorText, { color: colors.accent }]}>
          {errorMsg}
        </Text>
      )}

      {/* Action Buttons */}
      {!selectedImage && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={handleLaunchCamera}
          >
            <Camera size={22} color="#FFF" />
            <Text style={styles.btnText}>{t('camera')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.cardSecondary, borderWidth: 1, borderColor: colors.border }]}
            onPress={handleLaunchGallery}
          >
            <ImageIcon size={22} color={colors.text} />
            <Text style={[styles.btnText, { color: colors.text }]}>{t('gallery')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedImage && !isAnalyzing && (
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.accent }]}
          onPress={resetScanner}
        >
          <RefreshCw size={18} color="#FFF" />
          <Text style={styles.btnText}>Rescan</Text>
        </TouchableOpacity>
      )}

      {/* Simulator Section for Quick Evaluation */}
      {!selectedImage && (
        <GlassCard style={styles.simCard}>
          <View style={styles.simHeader}>
            <Sparkles size={16} color={colors.secondary} />
            <Text style={[styles.simTitle, { color: colors.text }]}>Simulator Quick Scan (Emulator/Web)</Text>
          </View>
          <View style={styles.templateRow}>
            {SIMULATED_TEMPLATES.map((tmpl, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.templateBtn, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}
                onPress={() => handleSimulatedScan(tmpl.name)}
              >
                <Text style={{ fontSize: 22, marginBottom: 4 }}>{tmpl.emoji}</Text>
                <Text style={[styles.templateName, { color: colors.text }]}>{tmpl.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  topInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  viewfinderContainer: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  viewfinderPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  viewfinderImage: {
    width: '100%',
    height: '100%',
  },
  scanBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    opacity: 0.8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  bracket: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderWidth: 4,
  },
  bracketTopLeft: {
    top: 15,
    left: 15,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
  },
  bracketTopRight: {
    top: 15,
    right: 15,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 10,
  },
  bracketBottomLeft: {
    bottom: 15,
    left: 15,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
  },
  bracketBottomRight: {
    bottom: 15,
    right: 15,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#FFF',
    fontWeight: '700',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  btnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginBottom: 20,
  },
  simCard: {
    marginTop: 10,
    padding: 12,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  simTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  templateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  templateBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  templateName: {
    fontSize: 10,
    fontWeight: '600',
  },
});
export default ScanScreen;
