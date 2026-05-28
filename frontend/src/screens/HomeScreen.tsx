import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { useTranslation } from '../hooks/TranslationContext';
import { Search, ScanLine, Info, History, ArrowRight } from 'lucide-react-native';
import { getGrainsList, getScanHistory, checkServerHealth } from '../services/api';
import GlassCard from '../components/GlassCard';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t, translateGrain } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [grains, setGrains] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const gList = await getGrainsList();
      setGrains(gList);
      
      const history = await getScanHistory();
      setRecentScans(history.slice(0, 4));
      
      const online = await checkServerHealth();
      setServerOnline(online);
    };

    loadData();
    
    // Refresh when screen gains focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const filteredGrains = grains.filter(g => {
    const translated = translateGrain(g);
    return translated?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  const renderGrainItem = ({ item }: { item: any }) => {
    const translated = translateGrain(item);
    return (
      <TouchableOpacity
        style={[styles.grainCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('Details', { grainName: item.name })}
      >
        <View style={[styles.grainIconBg, { backgroundColor: colors.primaryLight }]}>
          <Text style={{ fontSize: 24 }}>🌾</Text>
        </View>
        <View style={styles.grainInfo}>
          <Text style={[styles.grainName, { color: colors.text }]}>{translated.name}</Text>
          <Text style={[styles.grainMuted, { color: colors.textMuted }]} numberOfLines={1}>
            {translated.description}
          </Text>
        </View>
        <ArrowRight size={18} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.textMuted }]}>WELCOME TO</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('app_name')}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: serverOnline ? '#E8F5E9' : '#FFEBEE' }]}>
          <View style={[styles.statusIndicator, { backgroundColor: serverOnline ? colors.success : colors.accent }]} />
          <Text style={[styles.statusText, { color: serverOnline ? colors.success : colors.accent }]}>
            {serverOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Primary Scan Button Banner */}
      <GlassCard style={styles.scanBanner}>
        <View style={styles.scanBannerLeft}>
          <Text style={[styles.scanBannerTitle, { color: colors.text }]}>{t('tap_to_scan')}</Text>
          <Text style={[styles.scanBannerSub, { color: colors.textMuted }]}>{t('scan_sub')}</Text>
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Scan')}
          >
            <ScanLine size={20} color="#FFF" />
            <Text style={styles.scanButtonText}>{t('scan')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.scanBannerRight}>
          <View style={[styles.scanCircle, { borderColor: colors.primary }]}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
          </View>
        </View>
      </GlassCard>

      {/* Quick Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('search_placeholder')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Recent Scans Carousel */}
      {recentScans.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recent_scans')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
            {recentScans.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.recentCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Result', { scanData: item })}
              >
                <Image source={{ uri: item.image_path }} style={styles.recentImage} />
                <View style={styles.recentDetails}>
                  <Text style={[styles.recentName, { color: colors.text }]}>{item.grain_type}</Text>
                  <Text style={[styles.recentConf, { color: colors.success }]}>
                    {Math.round(item.confidence * 100)}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Grain Library */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>{t('grain_library')}</Text>
        <FlatList
          data={filteredGrains}
          renderItem={renderGrainItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t('no_details')}</Text>
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scanBanner: {
    flexDirection: 'row',
    height: 160,
    marginBottom: 20,
  },
  scanBannerLeft: {
    flex: 1.2,
    justifyContent: 'center',
  },
  scanBannerRight: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  scanBannerSub: {
    fontSize: 12,
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  scanButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scanCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  recentList: {
    gap: 12,
    paddingBottom: 8,
  },
  recentCard: {
    width: 130,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recentImage: {
    width: '100%',
    height: 90,
  },
  recentDetails: {
    padding: 8,
  },
  recentName: {
    fontWeight: '700',
    fontSize: 13,
  },
  recentConf: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  grainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  grainIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grainInfo: {
    flex: 1,
    marginLeft: 12,
  },
  grainName: {
    fontWeight: '700',
    fontSize: 16,
  },
  grainMuted: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 12,
    fontStyle: 'italic',
  },
});
export default HomeScreen;
