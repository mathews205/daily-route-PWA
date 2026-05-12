const API_URL = "https://script.google.com/macros/s/AKfycbyoTNTb7QXOez2oqNJ7MR8NLhvBbkpv1mbA6M-Itwly_J8gyLvpFjuZ1onm4jhTANJN/exec";

const itemNames = [
  "Achappam",
  "Kuzhal",
  "Cheeda",
  "Unda",
  "Ladu",
  "Pappada Boli",
  "Avalose Podi",
  "Coconut Boli",
  "Fruit Chips",
  "Chips",
  "Pakkavada",
  "Mixture",
  "Madakku",
  "Ellunda",
  "Tomato Murukku",
  "Finger White",
  "Achappam (Box)",
  "Bombay Mixture",
  "Cake",
  "Kuzhal (500g)"
];

const itemsContainer = document.getElementById("items");

function renderItems() {
  const tripType = document.getElementById("tripType").value;

  itemsContainer.innerHTML = "";

  if (!tripType) return;

  itemNames.forEach(name => {
    let fields = "";

    if (tripType === "going") {
      fields = `
        <input
          type="number"
          placeholder="Quantity"
          id="${name}-quantity"
        >
      `;
    }

    if (tripType === "returning") {
      fields = `
        <div class="two-column">
          <input
            type="number"
            placeholder="Balance"
            id="${name}-balance"
          >

          <input
            type="number"
            placeholder="Damaged"
            id="${name}-damaged"
          >
        </div>
      `;
    }

    itemsContainer.innerHTML += `
      <div class="item-card">
        <h3>${name}</h3>
        ${fields}
      </div>
    `;
  });
}

async function saveData() {
  const date = document.getElementById("date").value;
  const route = document.getElementById("route").value;
  const tripType = document.getElementById("tripType").value;

  if (!date || !route || !tripType) {
    alert("⚠️ Please select date, route and trip type.");
    return;
  }

  const duplicateKey = `${date}-${route}-${tripType}`;

  if (localStorage.getItem(duplicateKey)) {
    alert("🚫 This entry is already saved for today.\n\nDate: " + date + "\nRoute: " + route + "\nType: " + tripType);
    return;
  }

  const confirmSave = confirm(
    `Please confirm before saving:\n\nDate: ${date}\nRoute: ${route}\nType: ${tripType}\n\nDo you want to submit?`
  );

  if (!confirmSave) {
    return;
  }

  const items = [];

  itemNames.forEach(name => {
    if (tripType === "going") {
      items.push({
        name: name,
        quantity: document.getElementById(`${name}-quantity`).value || 0
      });
    }

    if (tripType === "returning") {
      items.push({
        name: name,
        balance: document.getElementById(`${name}-balance`).value || 0,
        damaged: document.getElementById(`${name}-damaged`).value || 0
      });
    }
  });

  const payload = {
    date,
    route,
    tripType,
    items
  };

  try {
    document.getElementById("status").innerText = "Saving...";

    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem(duplicateKey, "saved");

      alert("✅ Data saved successfully!");

      document.getElementById("status").innerText =
        "Saved Successfully";
    } else {
      alert("❌ Failed to save data.");
      document.getElementById("status").innerText =
        "Failed";
    }

  } catch (error) {
    alert("❌ Error saving data. Check internet or API URL.");

    document.getElementById("status").innerText =
      "Error Saving Data";

    console.log(error);
  }
}

renderItems();