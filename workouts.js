const WORKOUTS = {
  Monday: {
    title: "Legs + Pack Strength",
    focus: "Build strong legs and hips for hiking, climbing, and carrying your hunting pack.",
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: "10–12", rest: 90 },
      { name: "Romanian Deadlift", sets: 3, reps: "10", rest: 90 },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: 75 },
      { name: "Step-Ups", sets: 3, reps: "10 each leg", rest: 75 },
      { name: "Standing Calf Raises", sets: 3, reps: "15–20", rest: 60 },
      { name: "Incline Treadmill / Pack Walk", sets: 1, reps: "15–20 min", rest: 0 }
    ]
  },

  Tuesday: {
    title: "Bow Strength + Upper Body",
    focus: "Strengthen your back, shoulders, and arms for drawing and holding your bow.",
    exercises: [
      { name: "Lat Pulldown", sets: 3, reps: "10–12", rest: 75 },
      { name: "Seated Cable Row", sets: 3, reps: "10–12", rest: 75 },
      { name: "Face Pulls", sets: 3, reps: "15", rest: 60 },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "8–10", rest: 90 },
      { name: "Single-Arm Cable Row", sets: 3, reps: "10 each arm", rest: 60 },
      { name: "Band Bow Draw Holds", sets: 3, reps: "20–30 sec each side", rest: 60 }
    ]
  },

  Thursday: {
    title: "Full Body + Hunting Conditioning",
    focus: "Combine strength, stability, grip, and conditioning for the field.",
    exercises: [
      { name: "Trap-Bar Deadlift", sets: 3, reps: "6–8", rest: 120 },
      { name: "Bulgarian Split Squat", sets: 3, reps: "8 each leg", rest: 90 },
      { name: "Chest-Supported Row", sets: 3, reps: "10", rest: 75 },
      { name: "Farmer Carry", sets: 3, reps: "40–60 sec", rest: 60 },
      { name: "Pallof Press", sets: 3, reps: "10 each side", rest: 60 },
      { name: "Stair Climber / Incline Walk", sets: 1, reps: "15–20 min", rest: 0 }
    ]
  },

  Saturday: {
    title: "Ruck + Bow Endurance",
    focus: "Build hiking endurance and practice shooting while slightly fatigued.",
    exercises: [
      { name: "Warm-Up Walk", sets: 1, reps: "5–10 min", rest: 0 },
      { name: "Ruck / Incline Hike", sets: 1, reps: "30–45 min", rest: 0 },
      { name: "Step-Ups", sets: 3, reps: "12 each leg", rest: 60 },
      { name: "Band Pull-Aparts", sets: 3, reps: "15–20", rest: 45 },
      { name: "Bow Draw Holds", sets: 3, reps: "20–30 sec each side", rest: 60 },
      { name: "Mobility / Stretching", sets: 1, reps: "10 min", rest: 0 }
    ]
  }
};

const TRAINING_SCHEDULE = {
  Monday: "3:30 PM",
  Tuesday: "3:30 PM",
  Thursday: "3:30 PM",
  Saturday: "6:00 AM"
};

window.WORKOUTS = WORKOUTS;
window.TRAINING_SCHEDULE = TRAINING_SCHEDULE;
