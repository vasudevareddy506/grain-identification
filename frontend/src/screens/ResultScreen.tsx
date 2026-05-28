import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { useTranslation } from '../hooks/TranslationContext';
import { Volume2, VolumeX, ArrowRight, Check } from 'lucide-react-native';
import { speakText, stopSpeech } from '../services/api';
import ConfidenceGauge from '../components/ConfidenceGauge';
import GlassCard from '../components/GlassCard';

export const ResultScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { t, translateGrain, language } = useTranslation();
  
  const scanData = route.params?.scanData;

  useEffect(() => {
    // Speak automatically on load
    if (scanData) {
      triggerTTS();
    }
    
    // Stop speaking when leaving screen
    return () => {
      stopSpeech();
    };
  }, [scanData]);

  if (!scanData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>No scan data provided.</Text>
      </View>
    );
  }

  const { grain_type, confidence, image_path, grain_details } = scanData;
  const translatedGrain = translateGrain(grain_details);

  const triggerTTS = () => {
    if (!translatedGrain) return;
    
    const confidencePct = Math.round(confidence * 100);
    
    // Generate text depending on locale
    let speechText = '';
    if (language === 'es') {
      speechText = `Grano identificado como ${translatedGrain.name} con un ${confidencePct} por ciento de confianza. ${translatedGrain.description}`;
    } else if (language === 'fr') {
      speechText = `Grain identifié comme ${translatedGrain.name} avec une confiance de ${confidencePct} pour cent. ${translatedGrain.description}`;
    } else if (language === 'hi') {
      speechText = `पहचान की गई अनाज का नाम ${translatedGrain.name} है, जिसकी सटीकता ${confidencePct} प्रतिशत है। ${translatedGrain.description}`;
    } else {
      speechText = `Grain identified as ${translatedGrain.name} with ${confidencePct} percent confidence. ${translatedGrain.description}`;
    }

    speakText(speechText, language);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
        {t('success')}
      </Text>

      {/* Image Preview & Gauge Row */}
      <View style={styles.topRow}>
        <Image source={{ uri: image_path }} style={[styles.scanImage, { borderColor: colors.border }]} />
        <View style={styles.gaugeContainer}>
          <ConfidenceGauge value={confidence} size={130} />
        </View>
      </View>

      {/* Main Results Card */}
      <GlassCard style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.classLabel, { color: colors.textMuted }]}>CLASSIFICATION</Text>
            <Text style={[styles.className, { color: colors.text }]}>
              {translatedGrain?.name || grain_type}
            </Text>
          </View>
          <TouchableOpacity style={[styles.volumeBtn, { backgroundColor: colors.primary }]} onPress={triggerTTS}>
            <Volume2 size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {translatedGrain ? (
          <View style={styles.grainSummary}>
            <Text style={[styles.summaryText, { color: colors.text }]}>
              {translatedGrain.description}
            </Text>

            {/* Quick Nutrition Preview */}
            <View style={[styles.nutritionPreview, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
              <View style={styles.nutriItem}>
                <Text style={[styles.nutriVal, { color: colors.primary }]}>{translatedGrain.nutrition_calories}</Text>
                <Text style={[styles.nutriLabel, { color: colors.textMuted }]}>kcal</Text>
              </View>
              <View style={styles.nutriDivider} />
              <View style={styles.nutriItem}>
                <Text style={[styles.nutriVal, { color: colors.primary }]}>{translatedGrain.nutrition_protein}g</Text>
                <Text style={[styles.nutriLabel, { color: colors.textMuted }]}>{t('protein')}</Text>
              </View>
              <View style={styles.nutriDivider} />
              <View style={styles.nutriItem}>
                <Text style={[styles.nutriVal, { color: colors.primary }]}>{translatedGrain.nutrition_carbs}g</Text>
                <Text style={[styles.nutriLabel, { color: colors.textMuted }]}>{t('carbs')}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('no_details')}</Text>
        )}
      </GlassCard>

      {/* Navigation Triggers */}
      <View style={styles.buttonContainer}>
        {translatedGrain && (
          <TouchableOpacity
            style={[styles.detailsBtn, { borderColor: colors.primary, borderWidth: 1 }]}
            onPress={() => navigation.navigate('Details', { grainName: grain_details.name })}
          >
            <Text style={[styles.detailsBtnText, { color: colors.primary }]}>{t('view_details')}</Text>
            <ArrowRight size={18} color={colors.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.doneBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Check size={18} color="#FFF" />
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  scanImage: {
    flex: 1,
    height: 140,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  gaugeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    padding: 18,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  classLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  className: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  volumeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grainSummary: {
    marginTop: 4,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  nutritionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
  },
  nutriItem: {
    alignItems: 'center',
  },
  nutriVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  nutriLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  nutriDivider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 30,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  detailsBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  doneBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
export default ResultScreen;
