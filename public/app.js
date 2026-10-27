async function loadInfo() {
  try {
    const res = await fetch("/api/info");
    const data = await res.json();
    document.getElementById("node").textContent = data.node;
    document.getElementById("uptime").textContent = `${data.uptimeSeconds}s`;
    document.getElementById("env").textContent = data.environment;
    document.getElementById("commit").textContent = data.commit.slice(0, 7);
  } catch (err) {
    console.error("Failed to load info", err);
  }
}

document.getElementById("refresh-btn").addEventListener("click", loadInfo);
loadInfo();
