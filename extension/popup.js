const INSTALL_COMMAND =
  "irm https://raw.githubusercontent.com/rs4t/firefox-compact/main/install.ps1 | iex";

const DEFAULTS = { enabled: false, mode: "both", layout: "dynamic" };
const $ = (id) => document.getElementById(id);

function probeSet(id, property) {
  return getComputedStyle($(id)).getPropertyValue(property).trim() !== "";
}

async function copy(button, text) {
  await navigator.clipboard.writeText(text);
  const label = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => (button.textContent = label), 1500);
}

async function showShortcut() {
  const commands = await browser.commands.getAll();
  const toggle = commands.find((c) => c.name === "toggle-compact-mode");
  $("shortcut").textContent = toggle?.shortcut || "not set";

  if (typeof browser.commands.openShortcutSettings === "function") {
    $("change-shortcut").hidden = false;
    $("change-shortcut").addEventListener("click", () => browser.commands.openShortcutSettings());
  }
}

// Mirror the current settings in the live preview and the open/closed sections.
function render(argon) {
  const frameless = $("enabled").checked;
  const checked = document.querySelector('input[name="layout"]:checked');
  // Without Argon, Firefox's own layout is tabs on top, toolbar below.
  const layout = argon && checked ? checked.value : "classic";

  const stage = $("stage");
  stage.dataset.layout = layout;
  if (frameless) stage.dataset.frameless = $("always-top").checked ? "tabs" : "both";
  else delete stage.dataset.frameless;

  $("top-reveal").classList.toggle("open", frameless);
  $("vertical-hint").classList.toggle("open", argon && layout === "vertical");
}

async function init() {
  const state = await browser.storage.local.get(DEFAULTS);
  // Argon, or an install from when it was still called HeliumFox
  const argon = probeSet("argon-probe", "--argon-css") || probeSet("heliumfox-probe", "--heliumfox-css");

  // Frameless mode = hide everything; "Always show the top bar" = only the tabs hide.
  $("enabled").checked = state.enabled;
  $("always-top").checked = state.mode === "tabs";
  $("enabled").addEventListener("change", (e) => {
    browser.storage.local.set({ enabled: e.target.checked });
    render(argon);
  });
  $("always-top").addEventListener("change", (e) => {
    browser.storage.local.set({ mode: e.target.checked ? "tabs" : "both" });
    render(argon);
  });

  // Layout picker, only with the Argon theme.
  if (argon) {
    $("layout-section").hidden = false;
    for (const radio of document.querySelectorAll('input[name="layout"]')) {
      radio.checked = radio.value === state.layout;
      radio.addEventListener("change", () => {
        browser.storage.local.set({ layout: radio.value });
        render(argon);
      });
    }
  }

  // First paint without transitions, so the popup opens in its current state.
  document.documentElement.classList.add("no-motion");
  render(argon);
  requestAnimationFrame(() => requestAnimationFrame(() =>
    document.documentElement.classList.remove("no-motion")));

  showShortcut();

  if (!probeSet("compact-mode-probe", "--compact-mode-css")) {
    $("setup").hidden = false;
    $("command").textContent = INSTALL_COMMAND;
    $("copy-command").addEventListener("click", (e) => copy(e.target, INSTALL_COMMAND));
    $("copy-css").addEventListener("click", async (e) => {
      const css = await (await fetch(browser.runtime.getURL("compact.css"))).text();
      copy(e.target, css);
    });
  }
}

init();
