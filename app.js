const API_URL = "https://script.google.com/macros/s/AKfycbyoTNTb7QXOez2oqNJ7MR8NLhvBbkpv1mbA6M-Itwly_J8gyLvpFjuZ1onm4jhTANJN/exec";

const itemNames = [
  "Milk",
  "Bread",
  "Chocolate"
];

const itemsContainer =
  document.getElementById("items");

itemNames.forEach(name => {

  itemsContainer.innerHTML += `
    <div class="item-card">

      <h3>${name}</h3>

      <input
        type="number"
        placeholder="Morning Qty"
        id="${name}-morning"
      >

      <input
        type="number"
        placeholder="Remaining Qty"
        id="${name}-remaining"
      >

      <input
        type="number"
        placeholder="Expired Qty"
        id="${name}-expired"
      >

    </div>
  `;
});

async function saveData() {

  const date =
    document.getElementById("date").value;

  const route =
    document.getElementById("route").value;

  const items = [];

  itemNames.forEach(name => {

    items.push({
      name: name,
      morning:
        document.getElementById(`${name}-morning`).value || 0,

      remaining:
        document.getElementById(`${name}-remaining`).value || 0,

      expired:
        document.getElementById(`${name}-expired`).value || 0
    });
  });

  const payload = {
    date,
    route,
    items
  };

  try {

    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {

      document.getElementById("status")
        .innerText = "Saved Successfully";

    } else {

      document.getElementById("status")
        .innerText = "Failed";
    }

  } catch (error) {

    document.getElementById("status")
      .innerText = "Error Saving Data";

    console.log(error);
  }
}