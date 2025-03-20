import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  I18nManager
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LevelScreen from './LevelScreen'; // Импортируем LevelScreen


// Определение интерфейса для элемента списка языков
interface LanguageItem {
  code: string;
  name: string;
}

// Компонент выбора языка
const LanguageSelection: React.FC = () => {

    // Список доступных языков
    const languages: LanguageItem[] = [
      { code: 'ru', name: 'Русский' },
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'العربية' },
      { code: 'kk', name: 'Қазақша' },
      { code: 'uz', name: 'Oʻzbekcha' },
      { code: 'ky', name: 'Кыргызча' },
      { code: 'tg', name: 'Тоҷикӣ' },
      { code: 'zh', name: '中文' },
      { code: 'ja', name: '日本語' },
      { code: 'tr', name: 'Türkçe' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'hi', name: 'हिन्दी' },
      { code: 'ms', name: 'Bahasa Melayu' },
      { code: 'sw', name: 'Kiswahili' },
      { code: 'ko', name: '한국어' },
      { code: 'uk', name: 'Українська' },
      { code: 'ga', name: 'Gaeilge' },
    ];

  const [isModalVisible, setModalVisible] = useState(false); // Состояние видимости модального окна
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageItem | null>(null); // Состояние выбранного языка
  const [showLevelScreen, setShowLevelScreen] = useState(false); // Состояние для отображения LevelScreen

  // Функция загрузки сохраненного языка при запуске компонента
  useEffect(() => {
    loadSelectedLanguage();
  }, []);

    // Функция загрузки сохраненного языка из AsyncStorage
    const loadSelectedLanguage = async () => {
      try {
        const savedLanguageCode = await AsyncStorage.getItem('selectedLanguage'); // Получаем код языка
        if (savedLanguageCode) {
          const language = languages.find(lang => lang.code === savedLanguageCode); // Ищем язык по коду
          setSelectedLanguage(language || null); // Устанавливаем выбранный язык
        }
      } catch (error) {
        console.error('Failed to load the language.', error);
      }
    };

    // Функция сохранения выбранного языка в AsyncStorage
    const saveSelectedLanguage = async (languageCode: string) => {
      try {
        await AsyncStorage.setItem('selectedLanguage', languageCode); // Сохраняем код языка
      } catch (error) {
        console.error('Failed to save the language.', error);
      }
    };

  // Функция обработки выбора языка
  const handleLanguageSelect = (language: LanguageItem) => {
    setSelectedLanguage(language); // Устанавливаем выбранный язык
    setModalVisible(false); // Закрываем модальное окно
    saveSelectedLanguage(language.code); // Сохраняем выбранный язык
  };

  // Функция-заглушка для перехода на следующий экран
//   const handleContinue = () => {
//     if (selectedLanguage) {
//       console.log('Selected language:', selectedLanguage.code);
//       // Здесь будет переход на LevelScreen, когда он будет реализован
//     } else {
//       alert('Please select a language to continue.'); // Показываем предупреждение, если язык не выбран
//     }
//   };

  const handleContinue = () => {
    if (selectedLanguage) {
      setShowLevelScreen(true); // Показываем LevelScreen
    } else {
      alert('Please select a language to continue.');
    }
  };

    // Функция для отображения элемента списка языков
    const renderLanguageItem = ({ item }: { item: LanguageItem }) => (
      <TouchableOpacity
        style={styles.languageItem}
        onPress={() => handleLanguageSelect(item)}
      >
        <Text style={styles.languageItemText}>{item.name}</Text>
      </TouchableOpacity>
    );

    if (showLevelScreen) {
        return <LevelScreen />; // Показываем LevelScreen, если showLevelScreen === true
      }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Tajweed App</Text>
          <Text style={styles.subtitle}>Select your language:</Text>
        </View>

        <TouchableOpacity
          style={styles.selectedLanguageButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectedLanguageText}>
            {selectedLanguage ? selectedLanguage.name : 'Select Language'}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={languages}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item.code}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={[styles.continueButton, !selectedLanguage && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedLanguage}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF', // Светлый фон
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Темный цвет текста
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555', // Серый цвет текста
  },
  selectedLanguageButton: {
    backgroundColor: '#FFF', // Белый фон кнопки
    borderWidth: 1,
    borderColor: '#DDD', // Серая рамка
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    width: '80%', // Ширина кнопки
    alignItems: 'center',
        elevation: 2, // Тень для Android
    shadowColor: '#000', // Тень для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedLanguageText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  languageItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  languageItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#EEE',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#4CAF50', // Зеленый фон кнопки
    borderRadius: 5,
    padding: 15,
    width: '80%',
    alignItems: 'center',
  },
    disabledButton: {
        backgroundColor: '#cccccc', //Серый цвет для неактивной кнопки
    },
  continueButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LanguageSelection;
