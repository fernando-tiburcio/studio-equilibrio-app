import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Vibration,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useWorkout } from "../../contexts/WorkoutContext";
import { ExerciseDetail } from "../SubdivisionDetails";

interface ExerciseDetailsProps {
  route: {
    params: {
      exercise: ExerciseDetail;
    };
  };
}

export const ExerciseDetailsScreen: React.FC<ExerciseDetailsProps> = ({
  route,
}) => {
  const { exercise } = route.params;
  const navigation = useNavigation();
  const { markExerciseAsCompleted, isExerciseCompleted } = useWorkout();
  const [completedSeries, setCompletedSeries] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exercise.rest);
  const [showTimer, setShowTimer] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasMarkedCompleted = useRef(false);

  const notify = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.log("Error with haptics:", error);
    }
  };

  useEffect(() => {
    if (
      completedSeries >= exercise.series &&
      exercise.series > 0 &&
      !hasMarkedCompleted.current
    ) {
      markExerciseAsCompleted(exercise.id);
      hasMarkedCompleted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedSeries, exercise.series, exercise.id]);

  const startRest = () => {
    setShowTimer(true);
    setIsResting(true);
    setTimeLeft(exercise.rest);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          setShowTimer(false);
          Vibration.vibrate([500, 500, 500]);
          notify();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(interval);
  };

  const markSeriesCompleted = () => {
    setCompletedSeries((prev) => prev + 1);
    if (completedSeries + 1 < exercise.series) {
      startRest();
    }
  };

  const skipRest = () => {
    setShowTimer(false);
    setIsResting(false);
    setTimeLeft(exercise.rest);
  };

  const isCompleted = completedSeries >= exercise.series;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.exercise.name}</Text>
      </View>

      {/* Exercise Info */}
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informações do Exercício</Text>

          <View style={styles.infoRow}>
            <MaterialIcons name="fitness-center" size={20} color="#10b981" />
            <Text style={styles.infoLabel}>Grupo Muscular:</Text>
            <Text style={styles.infoValue}>
              {exercise.exercise.muscleGroup.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="build" size={20} color="#10b981" />
            <Text style={styles.infoLabel}>Equipamento:</Text>
            <Text style={styles.infoValue}>
              {exercise.exercise.equipment.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="repeat" size={20} color="#10b981" />
            <Text style={styles.infoLabel}>Repetições:</Text>
            <Text style={styles.infoValue}>{exercise.repetitions}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="timer" size={20} color="#10b981" />
            <Text style={styles.infoLabel}>Descanso:</Text>
            <Text style={styles.infoValue}>{exercise.rest}s</Text>
          </View>
        </View>

        {/* Series Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progresso</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedSeries / exercise.series) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedSeries} de {exercise.series} séries concluídas
          </Text>
        </View>

        {/* Series Cards */}
        <View style={styles.seriesContainer}>
          {Array.from({ length: exercise.series }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.seriesCard,
                index < completedSeries && styles.seriesCardCompleted,
                index === completedSeries &&
                  isResting &&
                  styles.seriesCardActive,
              ]}
            >
              <Text style={styles.seriesNumber}>{index + 1}</Text>
              {index < completedSeries && (
                <MaterialIcons name="check-circle" size={24} color="#10b981" />
              )}
              {index === completedSeries && isResting && (
                <MaterialIcons name="timer" size={24} color="#ffc107" />
              )}
              {index > completedSeries && (
                <MaterialIcons
                  name="radio-button-unchecked"
                  size={24}
                  color="#999"
                />
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        {!isCompleted && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              isResting && styles.completeButtonDisabled,
            ]}
            onPress={markSeriesCompleted}
            disabled={isResting}
          >
            <MaterialIcons name="check" size={24} color="#fff" />
            <Text style={styles.completeButtonText}>Confirmar Série</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={styles.successContainer}>
            <MaterialIcons name="check-circle" size={80} color="#10b981" />
            <Text style={styles.successText}>Exercício Concluído!</Text>
          </View>
        )}

        {exercise.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Observações:</Text>
            <Text style={styles.descriptionText}>{exercise.description}</Text>
          </View>
        )}
      </View>

      {/* Full Screen Timer */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showTimer}
        onRequestClose={skipRest}
      >
        <Animated.View style={[styles.timerOverlay, { opacity: fadeAnim }]}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerTitle}>Descanso</Text>
            <Text style={styles.timerTime}>{timeLeft}s</Text>
            <TouchableOpacity style={styles.skipButton} onPress={skipRest}>
              <Text style={styles.skipButtonText}>Pular</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  progressCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  seriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  seriesCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  seriesCardCompleted: {
    backgroundColor: "#e8f5e9",
    borderColor: "#10b981",
  },
  seriesCardActive: {
    backgroundColor: "#fff9e6",
    borderColor: "#ffc107",
  },
  seriesNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  completeButtonDisabled: {
    backgroundColor: "#ccc",
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  successContainer: {
    alignItems: "center",
    padding: 32,
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 16,
    marginBottom: 24,
  },
  descriptionCard: {
    backgroundColor: "#fff9e6",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: "#856404",
    lineHeight: 18,
  },
  timerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    minWidth: 250,
  },
  timerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  timerTime: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 32,
  },
  skipButton: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
});
