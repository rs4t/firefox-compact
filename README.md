# Firefox Compact

Frameless mode for Firefox, like Helium's and Zen's. Hide the toolbars and bring them back by hovering the top of the window. Toggle it with **Ctrl+Alt+C**. With the [HeliumFox](https://github.com/rs4t/heliumfox) theme, it also switches between Helium's layouts.

Works with any theme: it only hides and reveals the toolbars, it never changes their colors.

## How it works

Firefox doesn't let extensions hide its own toolbars, but a small CSS file can. So this comes in two parts:

- **The extension** remembers your settings and gives you the shortcut and the settings popup.
- **`compact.css`** does the hiding. The extension tells it what to do by adding invisible characters to the window title, which the CSS can read.

## Install

### 1. Set up the CSS (once)

**Windows:** paste this into PowerShell and press Enter:

```powershell
irm https://raw.githubusercontent.com/rs4t/firefox-compact/main/install.ps1 | iex
```

It finds your Firefox profile, saves `compact.css` there, and adds one `@import` line to the top of your `userChrome.css` and `userContent.css`. Any theme files you already have are kept and backed up. You can read exactly what it does in [install.ps1](install.ps1).

<details>
<summary><b>Mac, Linux, or manual setup</b></summary>

1. In `about:config`, set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
2. Open `about:support` and click **Open Folder** next to *Profile Folder*. Make a `chrome` folder there if it's missing.
3. Save [`compact.css`](extension/compact.css) into that `chrome` folder.
4. Add this as the very first line of both `userChrome.css` and `userContent.css` in the same folder (create them if they don't exist):

   ```css
   @import "compact.css";
   ```

</details>

Then fully close Firefox and open it again.

### 2. Install the extension (temporary, until signed)

1. Download this repo (**Code → Download ZIP**) and unzip it.
2. In Firefox, open `about:debugging#/runtime/this-firefox` and click **Load Temporary Add-on…**.
3. Select `extension/manifest.json`.

Temporary add-ons unload when Firefox restarts, so you'll need to load it again each time until it's signed for permanent install.

If the CSS setup is missing, the extension icon shows a red **!** and the popup shows the setup command. It checks every time Firefox starts, so if you switch to a theme that replaces your CSS files, it will tell you.

## Use

Click the extension icon to open its settings:

- **Frameless mode** hides the toolbars until you hover the top of the window. **Ctrl+Alt+C** turns it on or off. You can change the shortcut in `about:addons` → ⚙ → **Manage Extension Shortcuts**.
- **Always show the top bar** keeps the URL bar visible, so only the tab row hides.
- A live preview at the top of the popup shows what your window will look like.
- The toolbars also stay visible while you type in the URL bar (Ctrl+L, Ctrl+T), while a menu is open, and while you drag a tab.
- **With vertical tabs**, frameless mode hides the tab sidebar too. Hover the edge it sits on to slide it back.

### Layouts (with HeliumFox)

With the [HeliumFox](https://github.com/rs4t/heliumfox) theme installed, the popup also shows Helium's layout picker:

| Layout | What it does |
| --- | --- |
| **Classic** | Tab row on top, toolbar below |
| **Dynamic** | Toolbar on top. The tab row only appears with 2 or more tabs |
| **Compact** | Everything in one row: URL bar, tabs, `+`, extensions, menu |
| **Vertical** | Uses Firefox's own vertical tabs (Settings → General → Browser layout). HeliumFox styles them |

The picker only appears when HeliumFox is installed, so with any other theme the extension stays a plain frameless-mode toggle.

## Theme compatibility

Frameless mode works with any theme, unless the theme itself sets one of these with `!important`:

- `max-height`, `min-height` or `overflow` on `#TabsToolbar`, `#nav-bar` or `#PersonalToolbar`
- `position` or `transform` on `#navigator-toolbox`, which themes with their own auto-hiding or floating toolbars do
- `position` on `#sidebar-container` (vertical tabs)

Also keep `@import "compact.css";` as the **first** line of `userChrome.css` and `userContent.css`.

## Good to know

- On Windows, minimize, maximize and close live in the tab bar, so when it's hidden they appear when you hover the top.
- Other extensions that also add a window title prefix (like Sidebery's window titles) will overwrite compact mode's marker, so the two can't be used together.
- The setup check reads the import line in `userContent.css`. If a theme replaces only `userChrome.css`, the extension can't tell.
- Firefox's fullscreen and the Customize screen ignore compact mode.

Made to pair with [HeliumFox](https://github.com/rs4t/heliumfox) and [Latin Accent Plus](https://github.com/rs4t/latin-accent-plus), but it works with any theme.

## License

MIT
