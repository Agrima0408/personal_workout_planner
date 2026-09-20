package com.workoutplanner.model;

import java.time.LocalDate;

public class WorkoutLog {

    private Long id;
    private LocalDate date;
    private String exerciseName;
    private double weightUsed;
    private int repsCompleted;
    private String comments;

    public WorkoutLog() {
    }

    public WorkoutLog(
            Long id,
            LocalDate date,
            String exerciseName,
            double weightUsed,
            int repsCompleted,
            String comments
    ) {
        this.id = id;
        this.date = date;
        this.exerciseName = exerciseName;
        this.weightUsed = weightUsed;
        this.repsCompleted = repsCompleted;
        this.comments = comments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public double getWeightUsed() {
        return weightUsed;
    }

    public void setWeightUsed(double weightUsed) {
        this.weightUsed = weightUsed;
    }

    public int getRepsCompleted() {
        return repsCompleted;
    }

    public void setRepsCompleted(int repsCompleted) {
        this.repsCompleted = repsCompleted;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}