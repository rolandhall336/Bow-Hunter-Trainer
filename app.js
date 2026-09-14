const STORE_KEY = "bowHunterTrainerV2";

let state = loadState();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {
      completed: {},
      history: [],
      prs: {}
    };
  } catch {
    return {
      completed: {},
      history: [],
      prs: {}
    };
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function showSection(id, button) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active");
  });

  document.getElementById(id)?.classList.add("active");

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  if (id === "week") renderWeek();
  if (id === "progress") renderProgress();
  if (id === "data") renderData();
}

function getTodayName() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });
}

function exerciseKey(day, index) {
  return `${day}-${index}`;
}

function renderToday() {
  const host = document.getElementById("todayWorkout");

  if (!host) return;

  const today = getTodayName();
  const workout = window.WORKOUTS?.[today];

  if (!workout) {
    host.innerHTML = `
      <div class="empty">
        <h3>Recovery Day</h3>
        <p>No scheduled workout today. Walking, mobility, or easy recovery work is perfect.</p>
      </div>
    `;
    return;
  }

  host.innerHTML = `
    <h3>${workout.title}</h3>
    <p class="exercise-info">${workout.focus}</p>

    ${workout.exercises.map((exercise, index) => {
      const key = exerciseKey(today, index);
      const done = !!state.completed[key];

      return `
        <div class="exercise ${done ? "doneEx" : ""}" id="ex-${index}">
          <div class="exercise-title">${exercise.name}</div>

          <div class="exercise-info">
            ${exercise.sets} set${exercise.sets === 1 ? "" : "s"}
            • ${exercise.reps}
            ${exercise.rest ? ` • ${exercise.rest}s rest` : ""}
          </div>

          <label>
            Weight / Load
            <input
              id="weight-${index}"
              inputmode="decimal"
              placeholder="optional"
            >
          </label>

          <button
            class="action secondary"
            onclick="startTimer(${exercise.rest || 60})"
          >
            ⏱ ${exercise.rest || 60}s timer
          </button>

          <button
            class="action ${done ? "gold" : ""}"
            onclick="toggleExercise('${today}', ${index}, this)"
          >
            ${done ? "✓ Done" : "Mark Done"}
          </button>
        </div>
      `;
    }).join("")}

    <button
      class="btn primary"
      onclick="finishWorkout('${today}')"
    >
      Finish Workout
    </button>
  `;
}

function toggleExercise(day, index, button) {
  const key = exerciseKey(day, index);

  state.completed[key] = !state.completed[key];

  saveState();

  const card = button.closest(".exercise");

  if (card) {
    card.classList.toggle("doneEx", state.completed[key]);
  }

  button.textContent = state.completed[key]
    ? "✓ Done"
    : "Mark Done";

  button.classList.toggle(
    "gold",
    state.completed[key]
  );
}

function finishWorkout(day) {
  const workout = window.WORKOUTS?.[day];

  if (!workout) return;

  const completedCount = workout.exercises.filter(
    (_, index) => state.completed[exerciseKey(day, index)]
  ).length;

  state.history.unshift({
    day,
    date: new Date().toISOString(),
    completedCount,
    total: workout.exercises.length
  });

  saveState();

  alert(
    `Saved ${day} workout: ${completedCount}/${workout.exercises.length} exercises completed.`
  );

  renderProgress();
}

function renderWeek() {
  const host = document.getElementById("weekList");

  if (!host) return;

  host.innerHTML = Object.entries(
    window.WORKOUTS || {}
  ).map(([day, workout]) => `
    <div class="exercise">
      <div class="exercise-title">
        ${day} — ${workout.title}
      </div>

      <div class="exercise-info">
        ${workout.focus}
      </div>

      <div class="exercise-info" style="margin-top:8px">
        ${workout.exercises.map(exercise =>
          `• ${exercise.name}: ${exercise.sets} × ${exercise.reps}`
        ).join("<br>")}
      </div>
    </div>
  `).join("");
}

function renderProgress() {
  const host = document.getElementById("progressContent");

  if (!host) return;

  const totalWorkouts = state.history.length;

  const totalExercises = state.history.reduce(
    (sum, item) => sum + item.completedCount,
    0
  );

  const percent = Math.min(
    100,
    totalWorkouts / 16 * 100
  );

  host.innerHTML = `
    <div class="stats">
      <div class="stat">
        <strong>${totalWorkouts}</strong>
        <span>Workouts</span>
      </div>

      <div class="stat">
        <strong>${totalExercises}</strong>
        <span>Exercises</span>
      </div>

      <div class="stat">
        <strong>${Object.keys(state.prs).length}</strong>
        <span>PRs</span>
      </div>
    </div>

    <div class="progress-bar" style="margin-top:16px">
      <div
        class="progress-fill"
        style="width:${percent}%"
      ></div>
    </div>

    <div style="margin-top:18px">
      ${
        state.history.length
          ? state.history.slice(0, 10).map(item => `
              <div class="history-item">
                <strong>${item.day}</strong>
                — ${new Date(item.date).toLocaleDateString()}

                <div class="exercise-info">
                  ${item.completedCount}/${item.total}
                  exercises completed
                </div>
              </div>
            `).join("")
          : `
            <div class="empty">
              No completed workouts yet.
            </div>
          `
      }
    </div>
  `;
}

function renderData() {
  const host = document.getElementById("dataContent");

  if (!host) return;

  const schedule = window.TRAINING_SCHEDULE || {};

  host.innerHTML = `
    <div class="exercise">
      <div class="exercise-title">
        Gym Schedule
      </div>

      ${Object.entries(schedule).map(
        ([day, time]) => `
          <div class="exercise-info">
            ${day}: ${time}
          </div>
        `
      ).join("")}
    </div>

    <button
      class="btn secondary"
      onclick="exportData()"
    >
      Export Backup
    </button>

    <button
      class="btn secondary"
      style="margin-top:10px"
      onclick="resetAllData()"
    >
      Reset App Data
    </button>
  `;
}

function exportData() {
  const blob = new Blob(
    [JSON.stringify(state, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "bow-hunter-trainer-backup.json";

  link.click();

  URL.revokeObjectURL(url);
}

function resetAllData() {
  if (
    !confirm(
      "Erase all Bow Hunter Trainer data on this device?"
    )
  ) {
    return;
  }

  state = {
    completed: {},
    history: [],
    prs: {}
  };

  saveState();

  renderToday();
  renderProgress();
}

let timerId = null;

function startTimer(seconds) {
  clearInterval(timerId);

  let remaining = Number(seconds) || 60;

  let banner = document.getElementById("bhtTimer");

  if (!banner) {
    banner = document.createElement("div");

    banner.id = "bhtTimer";

    banner.style.cssText = `
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 96px;
      z-index: 999;
      padding: 16px;
      border-radius: 16px;
      background: #123b29;
      color: white;
      text-align: center;
      font-size: 28px;
      font-weight: 800;
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
    `;

    document.body.appendChild(banner);
  }

  const update = () => {
    banner.textContent =
      remaining > 0
        ? `⏱ ${remaining}s`
        : "GO! 🏹";

    if (remaining <= 0) {
      clearInterval(timerId);

      if (navigator.vibrate) {
        navigator.vibrate([150, 100, 150]);
      }

      setTimeout(() => {
        banner.remove();
      }, 1800);
    }

    remaining--;
  };

  update();

  timerId = setInterval(update, 1000);
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderToday();
    renderWeek();
    renderProgress();
    renderData();
  }
);
