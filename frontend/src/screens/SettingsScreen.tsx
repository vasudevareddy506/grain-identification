import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { useTranslation } from '../hooks/TranslationContext';
import { getOfflineMode, setOfflineMode, BASE_API_URL, setBaseApiUrl, clearLocalHistory, checkServerHealth } from '../services/api';
import { Sun, Moon, Languages, Globe, Database, Network, CircleCheck } from 'lucide-react-native';
import GlassCard from '../components/GlassCard';
import { Language } from '../services/localization';

export const SettingsScreen: React.FC = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();

  const [offlineEnabled, setOfflineEnabled] = useState(getOfflineMode());
  const [serverUrl, setServerUrl] = useState(BASE_API_URL.replace('http://', '').replace('https://', ''));
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial connection
    checkConn();
  }, []);

  const checkConn = async () => {
    const online = await checkServerHealth();
    setServerOnline(online);
  };

  const handleOfflineToggle = (value: boolean) => {
    setOfflineEnabled(value);
    setOfflineMode(value);
    checkConn();
  };

  const handleSaveServerUrl = () => {
    setIsTestingConn(true);
    setBaseApiUrl(serverUrl);
    
    // Quick timeout test
    setTimeout(async () => {
      const online = await checkServerHealth();
      setServerOnline(online);
      setIsTestingConn(false);
      Alert.alert("Server Configured", `API address updated to: ${BASE_API_URL}`);
    }, 1000);
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('clear_history'),
      "Are you sure you want to clear all offline history? This cannot be undone.",
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: "Clear",
          style: 'destructive',
          onPress: () => {
            clearLocalHistory();
            Alert.alert("History Cleared", "Local cache has been wiped.");
          }
        }
      ]
    );
  };

  const renderLangOption = (label: string, code: Language) => {
    const isActive = language === code;
    return (
      <TouchableOpacity
        key={code}
        style={[
          styles.langBtn,
          {
            backgroundColor: isActive ? colors.primary : colors.cardSecondary,
            borderColor: colors.border
          }
        ]}
        onPress={() => setLanguage(code)}
      >
        <Text style={[styles.langText, { color: isActive ? '#FFF' : colors.text }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settings')}</Text>

      {/* Theme Selection */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Sun size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('theme')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowText, { color: colors.text }]}>{t('dark_mode')}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#BDC3C7', true: colors.primary }}
            thumbColor={'#FFF'}
          />
        </View>
      </GlassCard>

      {/* Language Selection */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Languages size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('language')}</Text>
        </View>
        <View style={styles.langGrid}>
          {renderLangOption('English', 'en')}
          {renderLangOption('Español', 'es')}
          {renderLangOption('Français', 'fr')}
          {renderLangOption('हिन्दी', 'hi')}
        </View>
      </GlassCard>

      {/* ML Prediction Modes */}
      <GlassCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Globe size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>ML Prediction Engine</Text>
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowText, { color: colors.text }]}>{t('offline_mode')}</Text>
            <Text style={[styles.subText, { color: colors.textMuted }]}>{t('offline_mode_sub')}</Text>
          </View>
          <Switch
            value={offlineEnabled}
            onValueChange={handleOfflineToggle}
            trackColor={{ false: '#BDC3C7', true: colors.primary }}
            thumbColor={'#FFF'}
          />
        </View>
      </GlassCard>

      {/* API Server Configurations */}
      {!offlineEnabled && (
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Network size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('server_status')}</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Connection:</Text>
            <View style={[styles.statusBadge, { backgroundColor: serverOnline ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={{ color: serverOnline ? colors.success : colors.accent, fontWeight: '700', fontSize: 11 }}>
                {serverOnline ? t('connected') : t('disconnected')}
              </Text>
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>{t('server_address')}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="e.g., 192.168.1.50:8000"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSaveServerUrl}
              disabled={isTestingConn}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      )}

      {/* Database Administration */}
      <GlassCard style={[styles.card, { marginBottom: 40 }]}>
        <View style={styles.cardHeader}>
          <Database size={20} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Database</Text>
        </View>
        <TouchableOpacity
          style={[styles.clearBtn, { borderColor: colors.accent, borderWidth: 1 }]}
          onPress={handleClearHistory}
        >
          <Text style={[styles.clearBtnText, { color: colors.accent }]}>
            {t('clear_history')}
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '600',
  },
  subText: {
    fontSize: 11,
    marginTop: 2,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    minWidth: '45%',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  saveBtn: {
    width: 65,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  clearBtn: {
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  clearBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
export default SettingsScreen;
