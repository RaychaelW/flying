const storyText = document.getElementById("story-text");
const storyImage = document.getElementById("story-image"); // New: image container
const choices = document.getElementById("choices");
const inventoryDiv = document.getElementById("inventory");
const undoBtn = document.getElementById("undo-btn");

let flightLog = JSON.parse(localStorage.getItem("flightLog")) || [];
let historyStack = [];

const scenes = {
  start: {
    text: "You're in the hangar. Choose your aircraft.",
    image: "https://images.unsplash.com/photo-1580151455837-cf8b7bc07a96",
    choices: [
      { text: "Jet Fighter", next: "jetPath" },
      { text: "Mythical Creature", next: "dragonPath" }
    ]
  },
  jetPath: {
    text: "You're flying at high altitude. A storm is approaching!",
    image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e",
    choices: [
      { text: "Go around the storm", next: "secretBase", log: "Avoided Storm" },
      { text: "Fly through it", next: "crashLanding", log: "Risked Storm", item: "Parachute" }
    ]
  },
  secretBase: {
    text: "You discover a hidden air base. Do you land?",
    image: "https://images.unsplash.com/photo-1592461874720-8df9ef049b48",
    choices: [
      { text: "Yes, investigate", next: "intelFound", log: "Found Base Intel" },
      { text: "No, keep flying", next: "safeLanding", log: "Ignored Base" }
    ]
  },
  intelFound: {
    text: "You find secret flight codes. You win!",
    image: "https://images.unsplash.com/photo-1616261463338-90986d07f663",
    choices: []
  },
  crashLanding: {
    text: "You crash! Do you have a parachute?",
    image: "https://images.unsplash.com/photo-1520119170932-2c6f1f59f3d8",
    choices: [
      { text: "Use Parachute", next: "surviveCrash", condition: "Parachute" },
      { text: "No parachute", next: "gameOver" }
    ]
  },
  surviveCrash: {
    text: "You parachuted to safety. Well done!",
    image: "https://images.unsplash.com/photo-1611605697995-d9f6a971b30b",
    choices: []
  },
  gameOver: {
    text: "You crash and the mission ends. Game over.",
    image: "https://images.unsplash.com/photo-1545060894-3caa70f1e232",
    choices: []
  },
  dragonPath: {
    text: "The dragon soars. A rival dragon appears!",
    image: "https://images.unsplash.com/photo-1524503033411-c9566986fc8f",
    choices: [
      { text: "Battle the creature", next: "victory", item: "Dragon Scale", log: "Won Battle" },
      { text: "Evade and ascend", next: "skyPortal", log: "Escaped Conflict" }
    ]
  },
  victory: {
    text: "You defeat the rival and take its scale.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    choices: []
  },
  skyPortal: {
    text: "You ascend into a mysterious sky portal.",
    image: "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4",
    choices: []
  },
  safeLanding: {
    text: "You land safely and complete your mission.",
    image: "https://images.unsplash.com/photo-1512069772997-cd879d8a02f4",
    choices: []
  }
};

function renderScene(sceneKey) {
  const scene = scenes[sceneKey];
  historyStack.push(sceneKey);

  // ✅ Set story text and image
  storyText.innerText = scene.text;
  storyImage.style.backgroundImage = `url('${scene.image || ""}')`;

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
      if (choice.condition && !flightLog.includes(choice.condition)) return;

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