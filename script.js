const storyText = document.getElementById("story-text");
const choices = document.getElementById("choices");
const inventoryDiv = document.getElementById("inventory");
const undoBtn = document.getElementById("undo-btn");

let flightLog = JSON.parse(localStorage.getItem("flightLog")) || [];
let historyStack = [];

const scenes = {
  start: {
    text: "You're in the hangar. Choose your aircraft.",
    choices: [
      { text: "Jet Fighter", next: "jetPath" },
      { text: "Mythical Creature", next: "dragonPath" }
    ]
  },
  jetPath: {
    text: "You're flying at high altitude. A storm is approaching!",
    choices: [
      { text: "Go around the storm", next: "secretBase", log: "Avoided Storm" },
      { text: "Fly through it", next: "crashLanding", log: "Risked Storm", item: "Parachute" }
    ]
  },
  secretBase: {
    text: "You discover a hidden air base. Do you land?",
    choices: [
      { text: "Yes, investigate", next: "intelFound", log: "Found Base Intel" },
      { text: "No, keep flying", next: "safeLanding", log: "Ignored Base" }
    ]
  },
  intelFound: {
    text: "You find secret flight codes. You win!",
    choices: []
  },
  crashLanding: {
    text: "You crash! Do you have a parachute?",
    choices: [
      { text: "Use Parachute", next: "surviveCrash", condition: "Parachute" },
      { text: "No parachute", next: "gameOver" }
    ]
  },
  surviveCrash: {
    text: "You parachuted to safety. Well done!",
    choices: []
  },
  gameOver: {
    text: "You crash and the mission ends. Game over.",
    choices: []
  },
  dragonPath: {
    text: "The dragon soars. A rival dragon appears!",
    choices: [
      { text: "Battle the creature", next: "victory", item: "Dragon Scale", log: "Won Battle" },
      { text: "Evade and ascend", next: "skyPortal", log: "Escaped Conflict" }
    ]
  },
  victory: {
    text: "You defeat the rival and take its scale.",
    choices: []
  },
  skyPortal: {
    text: "You ascend into a mysterious sky portal.",
    choices: []
  },
  safeLanding: {
    text: "You land safely and complete your mission.",
    choices: []
  }
};

function renderScene(sceneKey) {
  const scene = scenes[sceneKey];
  historyStack.push(sceneKey);
  storyText.innerText = scene.text;
  choices.innerHTML = "";

  if (scene.choices.length === 0) {
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    restartBtn.onclick = () => {
      flightLog = [];
      historyStack = [];
      localStorage.removeItem("flightLog");
      renderScene("start");
    };
    choices.appendChild(restartBtn);
  } else {
    scene.choices.forEach(choice => {
      if (choice.condition && !flightLog.includes(choice.condition)) {
        return; // skip this option if condition not met
      }

      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => {
        if (choice.log) flightLog.push(choice.log);
        if (choice.item) flightLog.push(choice.item);
        localStorage.setItem("flightLog", JSON.stringify(flightLog));
        renderScene(choice.next);
        updateInventory();
      };
      choices.appendChild(btn);
    });
  }
}

function updateInventory() {
  inventoryDiv.innerHTML =
    "<strong>Flight Log:</strong><br>" + (flightLog.length ? flightLog.join("<br>") : "None");
}

undoBtn.onclick = () => {
  if (historyStack.length > 1) {
    historyStack.pop();
    const lastScene = historyStack[historyStack.length - 1];
    renderScene(lastScene);
  }
};

renderScene("start");
updateInventory();