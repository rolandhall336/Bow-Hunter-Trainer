// Bow Hunter Trainer V2
// App helpers, timers, workout reminders, and local data storage.

const BHT = {
  version: "2.0",

  schedule: {
    Monday: "3:30 PM",
    Tuesday: "3:30 PM",
    Thursday: "3:30 PM",
    Saturday: "6:00 AM"
  },

  save(key, value) {
    localStorage.setItem(
      "bowHunter_" + key,
      JSON.stringify(value)
    );
  },

  load(key, fallback = null) {
    try {
      const value = localStorage.getItem("bowHunter_" + key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }
};

// ---------- TIMER ----------

let bhtTimer = null;
let bhtSecondsRemaining = 0;

function startTimer(seconds) {
  clearInterval(bhtTimer);

  bhtSecondsRemaining = Number(seconds);

  if (!Number.isFinite(bhtSecondsRemaining) || bhtSecondsRemaining <= 0) {
    return;
  }

  updateTimerDisplay();

  bhtTimer = setInterval(() => {
    bhtSecondsRemaining--;

    updateTimerDisplay();

    if (bhtSecondsRemaining <= 0) {
      clearInterval(bhtTimer);
      bhtTimer = null;

      if ("vibrate" in navigator) {
        navigator.vibrate([250, 150, 250]);
      }

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Bow Hunter Trainer", {
          body: "Timer finished. Time for your next set! 🏹"
        });
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(bhtTimer);
  bhtTimer = null;
  bhtSecondsRemaining = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display =
    document.getElementById("timerDisplay") ||
    document.getElementById("timer");

  if (!display) return;

  const minutes = Math.floor(bhtSecondsRemaining / 60);
  const seconds = bhtSecondsRemaining % 60;

  display.textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

// ---------- NOTIFICATIONS ----------

async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("Notifications are not supported by this browser.");
    return false;
  }

  if (Notification.permission === "granted") {
    BHT.save("notificationsEnabled", true);
    return true;
  }

  const permission = await Notification.requestPermission();
  const enabled = permission === "granted";

  BHT.save("notificationsEnabled", enabled);

  return enabled;
}

// ---------- WORKOUT SCHEDULE ----------

function getTodaysWorkoutTime() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });

  return BHT.schedule[today] || null;
}

function showWorkoutSchedule() {
  return {
    Monday: "3:30 PM",
    Tuesday: "3:30 PM",
    Thursday: "3:30 PM",
    Saturday: "6:00 AM"
  };
}

// ---------- WORKOUT HISTORY ----------

function logWorkout(workout) {
  const history = BHT.load("history", []);

  history.unshift({
    ...workout,
    completedAt: new Date().toISOString()
  });

  BHT.save("history", history);
  return history;
}

function getWorkoutHistory() {
  return BHT.load("history", []);
}

// ---------- PERSONAL RECORDS ----------

function savePR(exercise, weight, reps) {
  const prs = BHT.load("prs", {});

  const newWeight = Number(weight) || 0;
  const newReps = Number(reps) || 0;

  const current = prs[exercise];

  if (
    !current ||
    newWeight > current.weight ||
    (newWeight === current.weight && newReps > current.reps)
  ) {
    prs[exercise] = {
      weight: newWeight,
      reps: newReps,
      date: new Date().toISOString()
    };

    BHT.save("prs", prs);
    return true;
  }

  return false;
}

function getPRs() {
  return BHT.load("prs", {});
}

// ---------- BODY WEIGHT ----------

function logBodyWeight(weight) {
  const weights = BHT.load("bodyWeight", []);

  weights.push({
    weight: Number(weight),
    date: new Date().toISOString()
  });

  BHT.save("bodyWeight", weights);
  return weights;
}

function getBodyWeightHistory() {
  return BHT.load("bodyWeight", []);
}

// ---------- DATA EXPORT ----------

function exportBowHunterData() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: BHT.version,
    history: BHT.load("history", []),
    prs: BHT.load("prs", {}),
    bodyWeight: BHT.load("bodyWeight", []),
    notificationsEnabled: BHT.load("notificationsEnabled", false)
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "bow-hunter-trainer-backup.json";
  link.click();

  URL.revokeObjectURL(url);
}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", () => {
  console.log("🏹 Bow Hunter Trainer V2 loaded");

  const workoutTime = getTodaysWorkoutTime();

  if (workoutTime) {
    console.log("Today's scheduled workout:", workoutTime);
  }

  document.querySelectorAll("[data-timer]").forEach(button => {
    button.addEventListener("click", () => {
      startTimer(Number(button.dataset.timer));
    });
  });

  const notificationButton =
    document.getElementById("enableNotifications");

  if (notificationButton) {
    notificationButton.addEventListener(
      "click",
      enableNotifications
    );
  }
});
