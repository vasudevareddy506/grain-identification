import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { useTranslation } from '../hooks/TranslationContext';
import { getScanHistory, deleteScanRecord, getAnalyticsData } from '../services/api';
import { Search, Trash2, Calendar, TrendingUp, BarChart2, ShieldAlert } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';

export const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [history, setHistory] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const hData = await getScanHistory();
    setHistory(hData);
    
    const aData = await getAnalyticsData();
    setAnalytics(aData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const hData = await getScanHistory();
    setHistory(hData);
    
    const aData = await getAnalyticsData();
    setAnalytics(aData);
    setIsRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      t('delete_scan'),
      t('sure_delete'),
      [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteScanRecord(id);
            if (success) {
              loadData();
            }
          }
        }
      ]
    );
  };

  const filteredHistory = history.filter(item =>
    item.grain_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={[styles.scanItemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.image_path }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemGrain, { color: colors.text }]}>{item.grain_type}</Text>
          <Text style={[styles.itemConf, { color: colors.success }]}>
            {Math.round(item.confidence * 100)}%
          </Text>
        </View>
        
        {item.notes ? (
          <Text style={[styles.itemNotes, { color: colors.textMuted }]} numberOfLines={1}>
            {item.notes}
          </Text>
        ) : null}

        <View style={styles.itemFooter}>
          <View style={styles.dateContainer}>
            <Calendar size={12} color={colors.textMuted} />
            <Text style={[styles.itemDate, { color: colors.textMuted }]}>
              {formatDate(item.created_at)}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => navigation.navigate('Result', { scanData: item })}
            >
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>Review</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
            >
              <Trash2 size={15} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Helper to render customized horizontal bar distributions
  const renderDistributionBar = (name: string, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <View key={name} style={styles.distRow}>
        <View style={styles.distLabelRow}>
          <Text style={[styles.distName, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.distCount, { color: colors.textMuted }]}>{count} ({Math.round(percentage)}%)</Text>
        </View>
        <View style={[styles.distTrack, { backgroundColor: colors.cardSecondary }]}>
          <View style={[styles.distBar, { width: `${percentage}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Controller */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('history')}</Text>
        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowDashboard(!showDashboard)}
        >
          {showDashboard ? <Calendar size={16} color={colors.primary} /> : <BarChart2 size={16} color={colors.primary} />}
          <Text style={[styles.toggleBtnText, { color: colors.primary }]}>
            {showDashboard ? 'List View' : 'Dashboard'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Dashboard */}
      {showDashboard ? (
        <ScrollView style={styles.scrollableBody} showsVerticalScrollIndicator={false} refreshing={isRefreshing} onRefresh={handleRefresh}>
          {analytics ? (
            <View style={{ gap: 16, paddingBottom: 30 }}>
              {/* Dashboard Summary Statistics */}
              <View style={styles.statsGrid}>
                <GlassCard style={styles.statCard}>
                  <TrendingUp size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {analytics.total_scans}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                    {t('total_analyzed')}
                  </Text>
                </GlassCard>

                <GlassCard style={styles.statCard}>
                  <ShieldAlert size={24} color={colors.secondary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {Math.round(analytics.average_confidence * 100)}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                    {t('average_acc')}
                  </Text>
                </GlassCard>
              </View>

              {/* Distribution Chart */}
              <GlassCard>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {t('distribution')}
                </Text>
                <View style={{ gap: 12, marginTop: 10 }}>
                  {Object.keys(analytics.class_distribution).length > 0 ? (
                    Object.entries(analytics.class_distribution).map(([name, count]) =>
                      renderDistributionBar(name, count as number, analytics.total_scans)
                    )
                  ) : (
                    <Text style={{ textAlign: 'center', color: colors.textMuted, fontStyle: 'italic', paddingVertical: 12 }}>
                      No data to display.
                    </Text>
                  )}
                </View>
              </GlassCard>
            </View>
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
        </ScrollView>
      ) : (
        /* History List View */
        <View style={{ flex: 1 }}>
          {/* Search bar */}
          <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search history..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>📁</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  {loading ? 'Loading...' : t('no_history')}
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
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
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  scanItemCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemGrain: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemConf: {
    fontSize: 14,
    fontWeight: '800',
  },
  itemNotes: {
    fontSize: 12,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontWeight: '600',
  },
  scrollableBody: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  distRow: {
    marginBottom: 2,
  },
  distLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  distName: {
    fontSize: 12,
    fontWeight: '700',
  },
  distCount: {
    fontSize: 11,
  },
  distTrack: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  distBar: {
    height: '100%',
    borderRadius: 3,
  },
});
export default HistoryScreen;
