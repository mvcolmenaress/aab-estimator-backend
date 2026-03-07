(function () {
  const container = document.createElement("div");
  container.style.border = "1px solid #ccc";
  container.style.padding = "20px";
  container.style.maxWidth = "400px";
  container.style.fontFamily = "Arial, sans-serif";

  container.innerHTML = `
    <h3>Instant Repair Estimate</h3>

    <label>Damage Type:</label>
    <select id="damage">
      <option value="dent">Dent</option>
      <option value="scratch">Scratch</option>
      <option value="bumper">Bumper</option>
    </select>

    <br><br>

    <label>Vehicle Type:</label>
    <select id="vehicle">
      <option value="sedan">Sedan</option>
      <option value="suv">SUV</option>
      <option value="truck">Truck</option>
    </select>

    <br><br>

    <button id="estimateBtn">Get Estimate</button>

    <div id="result" style="margin-top:15px;font-weight:bold;"></div>
  `;

  document.body.appendChild(container);

  document
    .getElementById("estimateBtn")
    .addEventListener("click", async () => {
      const damage = document.getElementById("damage").value;
      const vehicle = document.getElementById("vehicle").value;
      const resultDiv = document.getElementById("result");

      resultDiv.innerHTML = "Calculating...";

      try {
        const response = await fetch("https://aab-estimator-backend.onrender.com/estimate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ damage, vehicle }),
        });

        const data = await response.json();

        if (data.ok) {
          resultDiv.innerHTML = `
            Estimated Cost: $${data.estimate.amount}<br>
            Range: $${data.estimate.range.low} - $${data.estimate.range.high}
          `;
        } else {
          resultDiv.innerHTML = "Error: " + data.message;
        }
      } catch (err) {
        resultDiv.innerHTML = "Server error. Make sure backend is running.";
      }
    });
})();
