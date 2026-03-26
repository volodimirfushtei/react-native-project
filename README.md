# React Native Project - Social App

A modern, feature-rich social media application built with React Native and Expo. This project features a premium UI/UX, robust state management, and seamless backend integration.

## 🚀 Features

- **Authentication**: Secure user login and registration powered by Firebase.
- **Dynamic Content**: real-time updates for posts and comments.
- **Premium UI**: 
    - Smooth animations using `react-native-reanimated` and `gsap`.
    - Custom-designed `LoadingScreen` with advanced SVG/Canvas animations.
    - Responsive layouts with `LinearGradient` and `expo-blur` effects.
- **Storage**: User avatars and post images stored in Firebase Storage.
- **Maps**: Integrated location tracking and map views with `react-native-maps`.
- **Media**: Camera and Image Picker support via Expo SDK.

## 🛠 Tech Stack

- **Core**: [React Native](https://reactnative.dev/) & [Expo SDK 54](https://expo.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with Redux Persist
- **Backend / DB**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/)
- **Styling**: Vanilla CSS-in-JS (StyleSheet)
- **Animations**: Reanimated, GSAP, Haptics
- **Maps**: Expo Location, React Native Maps

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-native-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   ...
   ```

## 🚀 Running the App

- **Start Expo Go**
  ```bash
  npx expo start
  ```
- **Run on Android**
  ```bash
  npm run android
  ```
- **Run on iOS**
  ```bash
  npm run ios
  ```

---
Built with ❤️ by [Volodimir Fushtei](https://github.com/volodimirfushtei)
