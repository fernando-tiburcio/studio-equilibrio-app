import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useWorkout } from "../../contexts/WorkoutContext";

export interface ExerciseDetail {
  id: string;
  repetitions: number;
  series: number;
  description: string;
  details: string;
  rest: number;
  exercise: {
    id: string;
    name: string;
    muscleGroup: {
      id: string;
      name: string;
    };
    equipment: {
      id: string;
      name: string;
    };
  };
}

interface Exercise {
  id: string;
  repetitions: number;
  series: number;
  description: string;
  details: string;
  rest: number;
  exercise: {
    id: string;
    name: string;
    muscleGroup: {
      id: string;
      name: string;
    };
    equipment: {
      id: string;
      name: string;
    };
  };
}

interface SubdivisionDetailsProps {
  route: {
    params: {
      subdivision: number;
      muscleGroups: any[];
    };
  };
}

export const SubdivisionDetailsScreen: React.FC<SubdivisionDetailsProps> = ({
  route,
}) => {
  const { subdivision, muscleGroups } = route.params;
  const navigation = useNavigation();
  const { isExerciseCompleted } = useWorkout();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subdivisão {subdivision}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {muscleGroups.flatMap((muscleGroup: any, mgIndex: number) =>
          muscleGroup.exercises.map((exercise: any, exIndex: number) => {
            const isCompleted = isExerciseCompleted(exercise.id);

            return (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseContainer,
                  isCompleted && styles.exerciseContainerCompleted,
                ]}
                onPress={() =>
                  !isCompleted &&
                  (navigation as any).navigate("ExerciseDetails", {
                    exercise,
                  })
                }
                disabled={isCompleted}
                activeOpacity={isCompleted ? 1 : 0.7}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseNumber}>{exIndex + 1}</Text>
                  <View style={styles.exerciseNameContainer}>
                    <Text
                      style={[
                        styles.exerciseName,
                        isCompleted && styles.exerciseNameCompleted,
                      ]}
                    >
                      {exercise.exercise.name}
                    </Text>
                  </View>
                  {isCompleted ? (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#10b981"
                    />
                  ) : (
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#10b981"
                    />
                  )}
                </View>

                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseCategory}>
                    {exercise.exercise.muscleGroup.name}
                  </Text>
                  <Text style={styles.exerciseCategory}>
                    {exercise.exercise.equipment.name}
                  </Text>
                </View>

                <View style={styles.exerciseDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Séries:</Text>
                    <Text style={styles.detailValue}>{exercise.series}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Repetições:</Text>
                    <Text style={styles.detailValue}>
                      {exercise.repetitions}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Descanso:</Text>
                    <Text style={styles.detailValue}>{exercise.rest}s</Text>
                  </View>
                </View>

                {exercise.description && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>{exercise.description}</Text>
                  </View>
                )}

                {exercise.details && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Detalhes:</Text>
                    <Text style={styles.notesText}>{exercise.details}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  exerciseContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exerciseContainerCompleted: {
    backgroundColor: "#e8f5e9",
    opacity: 0.7,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10b981",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 12,
  },
  exerciseNameContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  exerciseNameCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  exerciseInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  exerciseCategory: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  exerciseDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  notesContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#fff9e6",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#856404",
    lineHeight: 18,
  },
});
