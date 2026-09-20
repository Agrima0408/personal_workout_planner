package com.workoutplanner.model;

import java.util.List;

public class Workout {

    private String day;
    private String title;
    private String duration;
    private List<Exercise> exercises;

    public Workout() {
    }

    public Workout(String day, String title, String duration, List<Exercise> exercises) {
        this.day = day;
        this.title = title;
        this.duration = duration;
        this.exercises = exercises;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<Exercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }
}