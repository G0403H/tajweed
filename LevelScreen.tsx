import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Интерфейс для уровня
interface LevelItem {
  id: string;
  name: string;
  description: string;
}

// Компонент выбора уровня
const LevelScreen: React.FC = () => {
  // Список уровней
  const levels: LevelItem[] = [
    {
      id: 'novice',
      name: 'Новичок',
      description: 'Не умею читать Коран ни произносить буквы',
    },
    {
      id: 'intermediate',
      name: 'Средний уровень',
      description: 'Я умею читать и произносить буквы, но не владею таджвидом',
    },
    {
      id: 'teacher',
      name: 'Преподаватель',
      description: 'Хочу использовать приложение для занятий',
    },
  ];

  const [selectedLevel, setSelectedLevel] = useState<LevelItem | null>(null); // Состояние выбранного уровня

    // Функция загрузки сохраненного уровня при запуске
    useEffect(() => {
        loadSelectedLevel();
    }, []);

    // Функция загрузки сохраненного уровня из AsyncStorage
    const loadSelectedLevel = async () => {
        try {
            const savedLevelId = await AsyncStorage.getItem('selectedLevel');
            if (savedLevelId) {
                const level = levels.find((lvl) => lvl.id === savedLevelId);
                setSelectedLevel(level || null);
            }
        } catch (error) {
            console.error('Failed to load the level.', error);
        }
    };

    // Функция сохранения выбранного уровня
    const saveSelectedLevel = async (levelId: string) => {
        try {
            await AsyncStorage.setItem('selectedLevel', levelId);
        } catch (error) {
            console.error('Failed to save the level.', error);
        }
    };

  // Обработчик выбора уровня
  const handleLevelSelect = (level: LevelItem) => {
    setSelectedLevel(level);
        saveSelectedLevel(level.id);
  };

  // Обработчик нажатия кнопки "Продолжить"
  const handleContinue = () => {
    if (selectedLevel) {
      console.log('Selected level:', selectedLevel.id);
      // Здесь будет переход на InstructionScreen (заглушка)
    } else {
      alert('Пожалуйста, выберите уровень.');
    }
  };

    // Функция рендеринга элемента уровня
    const renderLevelItem = (level: LevelItem) => (
        <TouchableOpacity
            key={level.id}
            style={[
                styles.levelItem,
                selectedLevel?.id === level.id && styles.selectedLevelItem,
            ]}
            onPress={() => handleLevelSelect(level)}
        >
            <Text style={styles.levelName}>{level.name}</Text>
            <Text style={styles.levelDescription}>{level.description}</Text>
        </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Выберите уровень</Text>
        </View>

        {levels.map(renderLevelItem)}

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLevel && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedLevel}
        >
          <Text style={styles.continueButtonText}>Продолжить</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
    color: '#333',
    marginBottom: 10,
  },
  levelItem: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    width: '80%',
        elevation: 2, // Тень для Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
  },
  selectedLevelItem: {
    backgroundColor: '#e0f7fa', // Цвет фона для выбранного уровня
    borderColor: '#80deea', // Цвет рамки для выбранного уровня
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  levelDescription: {
    fontSize: 14,
    color: '#555',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default LevelScreen;
