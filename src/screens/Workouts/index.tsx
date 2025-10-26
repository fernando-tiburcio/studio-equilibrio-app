import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { apiService, ActiveWorkout } from "../../services/api";

// Componente de subdivisão expansível
interface SubdivisionCardProps {
  subdivision: number;
  muscleGroups: any[];
}

const SubdivisionCard: React.FC<SubdivisionCardProps> = ({
  subdivision,
  muscleGroups,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const handleNavigateToDetails = () => {
    (navigation as any).navigate("SubdivisionDetails", {
      subdivision,
      muscleGroups,
    });
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.subdivisionCard}>
      <View style={styles.subdivisionHeaderTop}>
        <TouchableOpacity
          style={styles.subdivisionHeader}
          onPress={toggleExpand}
          activeOpacity={0.7}
        >
          <View style={styles.subdivisionHeaderContent}>
            <Text style={styles.subdivisionTitle}>
              Subdivisão {subdivision}
            </Text>
            <Animated.View
              style={{ transform: [{ rotate: rotateInterpolate }] }}
            >
              <Text style={styles.expandIcon}>▼</Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={handleNavigateToDetails}
          activeOpacity={0.7}
        >
          <MaterialIcons name="visibility" size={20} color="#10b981" />
          <Text style={styles.viewDetailsText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.exercisesContainer}>
          {muscleGroups.flatMap((muscleGroup: any, mgIndex: number) =>
            muscleGroup.exercises.map((exercise: any, exIndex: number) => (
              <View key={exercise.id} style={styles.exerciseContainer}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseNumber}>{exIndex + 1}</Text>
                  <View style={styles.exerciseNameContainer}>
                    <Text style={styles.exerciseName}>
                      {exercise.exercise.name}
                    </Text>
                  </View>
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
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

export const WorkoutsScreen = () => {
  const [workout, setWorkout] = useState<ActiveWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkout = async () => {
    try {
      setError(null);
      const activeWorkout = await apiService.getActiveWorkout();
      console.log("activeWorkout", activeWorkout);
      setWorkout(activeWorkout);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar treino";
      setError(errorMessage);
      console.error("Erro ao carregar treino:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWorkout();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkout();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Carregando treino...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Puxe para baixo para tentar novamente
        </Text>
      </ScrollView>
    );
  }

  if (!workout || workout.organizedSubdivisions.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.emptyText}>Nenhum treino ativo</Text>
        <Text style={styles.emptySubtext}>Puxe para baixo para atualizar</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.subtitle}>{workout.subdivisions} subdivisões</Text>
      </View>

      {workout.organizedSubdivisions.map((subdivision) => (
        <SubdivisionCard
          key={subdivision.subdivision}
          subdivision={subdivision.subdivision}
          muscleGroups={subdivision.muscleGroups}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  subdivisionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subdivisionHeaderTop: {
    padding: 16,
  },
  subdivisionHeader: {
    flex: 1,
  },
  subdivisionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    marginLeft: 6,
  },
  subdivisionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  expandIcon: {
    fontSize: 16,
    color: "#10b981",
  },
  exercisesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  groupContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  groupCount: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
  },
  exerciseContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
  exerciseDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
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
