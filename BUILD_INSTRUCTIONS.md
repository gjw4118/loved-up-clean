# Development Build Instructions

## Option 1: iOS Simulator (Fastest for Testing)
```bash
eas build --profile ios-simulator --platform ios
```
After build completes (~10-15 minutes):
- Download the .tar.gz file
- Extract and drag the .app to your simulator

## Option 2: iOS Device
```bash
eas build --profile development --platform ios
```
After build completes:
- Install via TestFlight or direct download
- Scan QR code from EAS to install

## Option 3: Android Device
```bash
eas build --profile development --platform android
```
After build completes:
- Download and install the .apk file

## Running the App
Once dev build is installed on your device:

```bash
npx expo start --dev-client
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android
- Scan QR code on physical device

## What's Fixed
✅ No more crashes when swiping cards
✅ Haptics work properly (via runOnJS)
✅ Proper worklet optimization
✅ Cards positioned correctly
✅ Smooth animations with Reanimated 4

## Note
The linter warning about expo-build-properties is a cache issue and can be ignored.
The package is installed and will work fine during the build.
