# React Native Project Structure

## Installation Instructions

1. **Initialize React Native project:**
```bash
npx react-native init FriendSchedulerApp
cd FriendSchedulerApp
```

2. **Install dependencies:**
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-vector-icons
```

3. **For iOS (if developing for iOS):**
```bash
cd ios && pod install && cd ..
```

4. **Replace the generated files with the structure below:**

## File Structure:
```
FriendSchedulerApp/
├── App.js
├── package.json
├── src/
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── FriendsContext.js
│   ├── services/
│   │   └── apiService.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── FriendsScreen.js
│   │   ├── CalendarScreen.js
│   │   ├── ScheduleScreen.js
│   │   └── ProfileScreen.js
│   └── components/
│       ├── FriendCard.js
│       ├── MeetingSuggestion.js
│       └── LoadingSpinner.js
├── android/
└── ios/
```

### metro.config.js
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {};

module.exports = mergeConfig(defaultConfig, config);
```

## Run Instructions

1. **Start Metro bundler:**
```bash
npm start
```

2. **Run on Android:**
```bash
npm run android
```

3. **Run on iOS:**
```bash
npm run ios
```

## Additional Screens (Create these files)

- **src/screens/CalendarScreen.js** - Calendar view and integration
- **src/screens/ScheduleScreen.js** - Meeting scheduling interface  
- **src/screens/ProfileScreen.js** - User profile and settings
- **src/components/FriendCard.js** - Reusable friend component
- **src/components/MeetingSuggestion.js** - Meeting suggestion component
- **src/components/LoadingSpinner.js** - Loading indicator

The other context and service files (FriendsContext.js, apiService.js) are already provided in the previous artifact.