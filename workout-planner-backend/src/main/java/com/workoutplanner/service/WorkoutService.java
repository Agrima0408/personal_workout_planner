package com.workoutplanner.service;

import com.workoutplanner.model.Exercise;
import com.workoutplanner.model.Workout;
import com.workoutplanner.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;

    public WorkoutService(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    public Workout getWorkoutByDay(String day) {
        return workoutRepository.findByDayIgnoreCase(day).orElse(null);
    }

    public Workout createWorkout(Workout workout) {
        if (workout.getExercises() != null) {
            for (Exercise exercise : workout.getExercises()) {
                exercise.setWorkout(workout);
            }
        }
        return workoutRepository.save(workout);
    }

    public void loadDefaultWorkouts() {

        // =========================
        // MONDAY
        // Upper Body + Chest + Posture + Core
        // =========================

        List<Exercise> mondayExercises = new ArrayList<>();

        mondayExercises.add(new Exercise(
                "Warm-up",
                1,
                5,
                0,
                0,
                "5 minutes easy warm-up",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Lat Pulldown",
                3,
                12,
                0,
                0,
                "Controlled movement. Keep shoulders down.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Dumbbell Bench Press",
                3,
                12,
                0,
                0,
                "Keep the movement controlled.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Seated Cable Row",
                3,
                12,
                0,
                0,
                "Keep chest lifted and squeeze shoulder blades.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Incline Dumbbell Press",
                3,
                12,
                0,
                0,
                "Use a comfortable weight.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Dumbbell Lateral Raise",
                3,
                12,
                0,
                0,
                "Use light weights and controlled movement.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Dead Bug",
                3,
                10,
                0,
                0,
                "Keep lower back controlled against the mat.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Bird Dog",
                3,
                10,
                0,
                0,
                "Move slowly and maintain balance.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Plank",
                3,
                30,
                0,
                0,
                "Hold for 30 seconds. Stop if form breaks.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Treadmill",
                1,
                2,
                0,
                0,
                "2 km. Speed 4–4.8 km/h. Incline 0–2.",
                ""
        ));

        mondayExercises.add(new Exercise(
                "Yoga / Stretching",
                1,
                10,
                0,
                0,
                "Easy cooldown and stretching.",
                ""
        ));

        Workout monday = new Workout(
                "Monday",
                "Upper Body + Chest + Posture + Core",
                "60–75 minutes",
                mondayExercises
        );

        attachExercisesToWorkout(monday);
        workoutRepository.save(monday);


        // =========================
// TUESDAY
// Knee-Friendly Lower Body + Glutes
// =========================

        List<Exercise> tuesdayExercises = new ArrayList<>();

        tuesdayExercises.add(new Exercise(
                "Warm-up",
                1,
                5,
                0,
                0,
                "5 minutes easy warm-up.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Dumbbell Romanian Deadlift",
                3,
                12,
                0,
                0,
                "Keep back neutral and move slowly.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Glute Bridge",
                3,
                15,
                0,
                0,
                "Squeeze glutes at the top.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Sit-to-Stand from Bench",
                3,
                10,
                0,
                0,
                "Use a controlled movement. Keep knees comfortable.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Clamshell",
                3,
                12,
                0,
                0,
                "Keep hips stable.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Side-Lying Leg Raise",
                3,
                12,
                0,
                0,
                "Move slowly without swinging.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Calf Raise",
                3,
                15,
                0,
                0,
                "Use support if needed.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Leg Extension",
                2,
                12,
                0,
                0,
                "Optional. Use a light, comfortable weight.",
                ""
        ));

        tuesdayExercises.add(new Exercise(
                "Treadmill",
                1,
                2,
                0,
                0,
                "2 km. Speed 4–4.5 km/h. Incline 0–1.",
                ""
        ));

        Workout tuesday = new Workout(
                "Tuesday",
                "Knee-Friendly Lower Body + Glutes",
                "60–75 minutes",
                tuesdayExercises
        );

        attachExercisesToWorkout(tuesday);
        workoutRepository.save(tuesday);

        // =========================
// WEDNESDAY
// Recovery Yoga + Core
// =========================

        List<Exercise> wednesdayExercises = new ArrayList<>();

        wednesdayExercises.add(new Exercise(
                "Easy Warm-up",
                1,
                5,
                0,
                0,
                "5 minutes of gentle movement.",
                ""
        ));

        wednesdayExercises.add(new Exercise(
                "Treadmill",
                1,
                2,
                0,
                0,
                "2 km at a comfortable pace. No need to push speed.",
                ""
        ));

        wednesdayExercises.add(new Exercise(
                "Yoga Flow",
                1,
                30,
                0,
                0,
                "25–30 minutes of gentle recovery yoga.",
                ""
        ));

        wednesdayExercises.add(new Exercise(
                "Core / Mobility",
                1,
                10,
                0,
                0,
                "Gentle core and mobility work.",
                ""
        ));

        Workout wednesday = new Workout(
                "Wednesday",
                "Recovery Yoga + Core",
                "45–60 minutes",
                wednesdayExercises
        );

        attachExercisesToWorkout(wednesday);
        workoutRepository.save(wednesday);


        // =========================
// THURSDAY
// Full Body + Farmer's Walk
// =========================

        List<Exercise> thursdayExercises = new ArrayList<>();

        thursdayExercises.add(new Exercise(
                "Warm-up",
                1,
                5,
                0,
                0,
                "5 minutes easy warm-up.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Goblet Squat",
                3,
                10,
                0,
                0,
                "Use a comfortable range of motion. Keep knees comfortable.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Dumbbell Romanian Deadlift",
                3,
                12,
                0,
                0,
                "Keep your back neutral and move in a controlled way.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Lat Pulldown",
                3,
                12,
                0,
                0,
                "Keep shoulders relaxed and control the return.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Dumbbell Shoulder Press",
                3,
                10,
                0,
                0,
                "Use a comfortable weight and avoid arching your back.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Glute Bridge",
                3,
                15,
                0,
                0,
                "Squeeze glutes at the top.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Farmer's Walk",
                3,
                30,
                0,
                0,
                "30 seconds per walk. Use a comfortable weight and maintain good posture.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Treadmill",
                1,
                2,
                0,
                0,
                "2 km. Speed 4–4.8 km/h. Incline 0–2.",
                ""
        ));

        thursdayExercises.add(new Exercise(
                "Yoga / Stretching",
                1,
                10,
                0,
                0,
                "Easy cooldown and full-body stretching.",
                ""
        ));

        Workout thursday = new Workout(
                "Thursday",
                "Full Body + Farmer's Walk",
                "60–75 minutes",
                thursdayExercises
        );

        attachExercisesToWorkout(thursday);
        workoutRepository.save(thursday);

        // =========================
// FRIDAY
// Chest + Back + Posture + Core
// =========================

        List<Exercise> fridayExercises = new ArrayList<>();

        fridayExercises.add(new Exercise(
                "Warm-up",
                1,
                5,
                0,
                0,
                "5 minutes easy warm-up.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Incline Dumbbell Press",
                3,
                12,
                0,
                0,
                "Use a comfortable weight and controlled movement.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Lat Pulldown",
                3,
                12,
                0,
                0,
                "Keep shoulders down and control the return.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Seated Cable Row",
                3,
                12,
                0,
                0,
                "Keep chest lifted and squeeze shoulder blades.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Dumbbell Chest Fly",
                3,
                12,
                0,
                0,
                "Use a light weight and avoid overstretching.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Face Pull",
                3,
                12,
                0,
                0,
                "Focus on posture and shoulder-blade movement.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Bird Dog",
                3,
                10,
                0,
                0,
                "Move slowly and maintain a stable core.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Dead Bug",
                3,
                10,
                0,
                0,
                "Keep your lower back controlled.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Plank",
                3,
                30,
                0,
                0,
                "30-second hold. Stop if form breaks.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Treadmill",
                1,
                2,
                0,
                0,
                "2 km. Speed 4–4.8 km/h. Incline 0–2.",
                ""
        ));

        fridayExercises.add(new Exercise(
                "Yoga / Stretching",
                1,
                10,
                0,
                0,
                "Easy cooldown and stretching.",
                ""
        ));

        Workout friday = new Workout(
                "Friday",
                "Chest + Back + Posture + Core",
                "60–75 minutes",
                fridayExercises
        );

        attachExercisesToWorkout(friday);
        workoutRepository.save(friday);


        // =========================
// SATURDAY
// Light Full Body + Yoga
// =========================

        List<Exercise> saturdayExercises = new ArrayList<>();

        saturdayExercises.add(new Exercise(
                "Warm-up",
                1,
                5,
                0,
                0,
                "5 minutes of easy movement.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Bodyweight Squat to Bench",
                2,
                10,
                0,
                0,
                "Use the bench for support. Keep the movement comfortable.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Dumbbell Romanian Deadlift",
                2,
                12,
                0,
                0,
                "Use a light, comfortable weight.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Seated Cable Row",
                2,
                12,
                0,
                0,
                "Focus on posture and controlled movement.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Dumbbell Lateral Raise",
                2,
                12,
                0,
                0,
                "Use light weights.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Glute Bridge",
                2,
                15,
                0,
                0,
                "Squeeze the glutes at the top.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Bird Dog",
                2,
                10,
                0,
                0,
                "Move slowly and maintain balance.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Treadmill",
                1,
                2,
                0,
                0,
                "2 km at a comfortable pace. Speed around 4–4.5 km/h.",
                ""
        ));

        saturdayExercises.add(new Exercise(
                "Yoga Flow",
                1,
                25,
                0,
                0,
                "20–25 minutes of gentle yoga and stretching.",
                ""
        ));

        Workout saturday = new Workout(
                "Saturday",
                "Light Full Body + Yoga",
                "50–60 minutes",
                saturdayExercises
        );

        attachExercisesToWorkout(saturday);
        workoutRepository.save(saturday);


        // =========================
// SUNDAY
// Rest + Recovery
// =========================

        List<Exercise> sundayExercises = new ArrayList<>();

        sundayExercises.add(new Exercise(
                "Rest Day",
                1,
                1,
                0,
                0,
                "Complete rest or gentle movement if you feel like it.",
                ""
        ));

        sundayExercises.add(new Exercise(
                "Gentle Stretching",
                1,
                10,
                0,
                0,
                "Optional 10 minutes of easy stretching.",
                ""
        ));

        Workout sunday = new Workout(
                "Sunday",
                "Rest + Recovery",
                "Rest day",
                sundayExercises
        );

        attachExercisesToWorkout(sunday);
        workoutRepository.save(sunday);
    }

    private void attachExercisesToWorkout(Workout workout) {
        if (workout.getExercises() != null) {
            for (Exercise exercise : workout.getExercises()) {
                exercise.setWorkout(workout);
            }
        }
    }
}