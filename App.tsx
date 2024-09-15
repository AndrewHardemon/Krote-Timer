import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

interface Timer {
  id: number;
  seconds: number;
  isRunning: boolean;
  color: string;
}

const App = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [colorInput, setColorInput] = useState<string>(''); // For color input

  // Function to add a new timer with default color
  const addTimer = () => {
    const newTimer: Timer = {
      id: timers.length + 1,
      seconds: 0,
      isRunning: false,
      color: colorInput || '#f5fcff', // Set default color or use user-defined color
    };
    setTimers([...timers, newTimer]);
    setColorInput(''); // Clear input after adding
  };

  // Function to start/pause a timer
  const toggleTimer = (id: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
      )
    );
  };

  // Function to reset a timer
  const resetTimer = (id: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => (timer.id === id ? { ...timer, seconds: 0, isRunning: false } : timer))
    );
  };

  // Function to delete a timer
  const deleteTimer = (id: number) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) =>
          timer.isRunning ? { ...timer, seconds: timer.seconds + 1 } : timer
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Render each timer row
  const renderTimer = ({ item }: { item: Timer }) => (
    <View style={[styles.timerContainer, { backgroundColor: item.color }]}>
      <Text style={styles.timerText}>{formatTime(item.seconds)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={item.isRunning ? "Pause" : "Start"}
          onPress={() => toggleTimer(item.id)}
        />
        <Button title="Reset" onPress={() => resetTimer(item.id)} />
        <Button title="Delete" onPress={() => deleteTimer(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTimer}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.addTimerContainer}>
        <TextInput
          style={styles.colorInput}
          placeholder="Enter color (e.g. #ff5733)"
          value={colorInput}
          onChangeText={setColorInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTimer}>
          <Text style={styles.addButtonText}>+ Add New Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
  },
  listContainer: {
    paddingBottom: 100, // Leave space for the "New Timer" button
  },
  timerContainer: {
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  timerText: {
    fontSize: 48,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
  },
  addTimerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
  },
  colorInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});

export default App;
