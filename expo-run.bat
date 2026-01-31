@echo off
:: === CONFIG ===
set "SDK_PATH=C:\Users\User\AppData\Local\Android\Sdk"
set "AVD_NAME=Medium_Phone"

:: === SETUP PATH ===
setx PATH "%PATH%;%SDK_PATH%\emulator;%SDK_PATH%\platform-tools"

echo.
echo ✅ Added Android SDK paths to PATH
echo 📱 Starting emulator: %AVD_NAME%
echo.

:: === START EMULATOR ===
start "" "%SDK_PATH%\emulator\emulator.exe" -avd %AVD_NAME%

:: === WAIT FOR DEVICE ===
echo.
echo ⏳ Waiting for device to come online...
:wait_loop
adb devices | find "device" >nul
if errorlevel 1 (
    timeout /t 3 >nul
    goto wait_loop
)
echo ✅ Device is online!

:: === RUN EXPO ===
echo 🚀 Launching Expo app...
npx expo start --android
pause
