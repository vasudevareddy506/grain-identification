import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { useTranslation } from '../hooks/TranslationContext';
import { getGrainByName } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Sprout, Flame, BookOpen } from 'lucide-react-native';

type TabType = 'nutrition' | 'cultivation' | 'uses';

export const DetailsScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { t, translateGrain } = useTranslation();
  
  const grainName = route.params?.grainName;
  const [grain, setGrain] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('nutrition');

  useEffect(() => {
    const fetchDetails = async () => {
      if (grainName) {
        setLoading(true);
        const data = await getGrainByName(grainName);
        setGrain(data);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [grainName]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!grain) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>{t('no_details')}</Text>
      </View>
    );
  }

  const translated = translateGrain(grain);

  // Helper to render nutrition horizontal progress bars
  const renderNutritionBar = (label: string, value: number, maxVal: number, color: string, suffix: string = 'g') => {
    const percentage = Math.min((value / maxVal) * 100, 100);
    return (
      <View style={styles.nutriRow}>
        <View style={styles.nutriLabelRow}>
          <Text style={[styles.nutriName, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.nutriValue, { color: colors.text, fontWeight: '700' }]}>{value}{suffix}</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.cardSecondary }]}>
          <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={[styles.emojiHeader]}>🌾</Text>
        <Text style={[styles.title, { color: colors.text }]}>{translated.name}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>{translated.description}</Text>
      </View>

      {/* Tabs Controller */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'nutrition' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Flame size={16} color={activeTab === 'nutrition' ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'nutrition' ? colors.primary : colors.textMuted }]}>
            {t('nutrition')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'cultivation' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('cultivation')}
        >
          <Sprout size={16} color={activeTab === 'cultivation' ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'cultivation' ? colors.primary : colors.textMuted }]}>
            {t('cultivation')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'uses' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('uses')}
        >
          <BookOpen size={16} color={activeTab === 'uses' ? colors.primary : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'uses' ? colors.primary : colors.textMuted }]}>
            {t('uses')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <GlassCard style={styles.contentCard}>
        {activeTab === 'nutrition' && (
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Nutritional Profile (per 100g)</Text>
            <View style={styles.nutriContainer}>
              {renderNutritionBar(t('calories'), translated.nutrition_calories, 500, colors.secondary, ' kcal')}
              {renderNutritionBar(t('protein'), translated.nutrition_protein, 30, colors.primary)}
              {renderNutritionBar(t('carbs'), translated.nutrition_carbs, 100, '#42A5F5')}
              {renderNutritionBar(t('fat'), translated.nutrition_fat, 20, colors.accent)}
              {renderNutritionBar(t('fiber'), translated.nutrition_fiber, 25, '#78909C')}
            </View>
          </View>
        )}

        {activeTab === 'cultivation' && (
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('cultivation')}</Text>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {translated.cultivation_info}
            </Text>
          </View>
        )}

        {activeTab === 'uses' && (
          <View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('uses')}</Text>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {translated.uses}
            </Text>
          </View>
        )}
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  emojiHeader: {
    fontSize: 54,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    height: 48,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: '100%',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  contentCard: {
    padding: 20,
    marginBottom: 40,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  nutriContainer: {
    gap: 14,
  },
  nutriRow: {
    marginBottom: 4,
  },
  nutriLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nutriName: {
    fontSize: 13,
    fontWeight: '600',
  },
  nutriValue: {
    fontSize: 13,
  },
  track: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
});
export default DetailsScreen;
