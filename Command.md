## Fresh Start (after closing VSCode & Xcode)

Follow these steps in order to get the app running on the iOS simulator in development mode from a clean start.

**1. Open the project folder**

```
cd ~/Desktop/FleaMarket
```

**2. Make sure dependencies are installed** (only needed if `node_modules` is missing or after pulling new changes)

```
npm install
```

**3. Build & launch the dev client on the iOS simulator**

This project uses a custom development build (Stream/WebRTC native modules), so you cannot use Expo Go. Build from the CLI (avoids the Xcode GUI crash):

```
npx expo run:ios
```

> First run compiles the native app and can take a few minutes. After it finishes, the dev build installs and opens automatically in the simulator, and the Metro bundler starts.

**4. (Subsequent runs) Just start Metro**

If the dev build is already installed on the simulator and you didn't change native code, you don't need to rebuild — just start the dev server:

```
npx expo start --dev-client
```

Then press `i` in the terminal to open it on the iOS simulator.

**Run on a physical iPhone instead**

```
npx expo run:ios --device
```

Select your connected iPhone when prompted.

---

## Run the Expo

```
npx expo start
```

# Run iOS simulator
```
npx expo run:ios --device
```

## Run the Vision Agents - AI voice

```
cd vision-agent
&&
uv run main.py serve
```