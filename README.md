# Introduction

A simple mobile app that tests how accurately you can match
a color. It supports full color and greyscale mode.
It gamifies this task and runs on Android, iOS and web.

# Available on iOS/Android:

iOS: https://apps.apple.com/us/app/guess-that-color/id6479181014
Android: https://play.google.com/store/apps/details?id=com.jasonify.valuegame&hl=es_MX&gl=US

# Setup
npm install
npm  start

# Upgrade expo:
https://expo.dev/changelog/2024/01-18-sdk-50
npm install expo@^50.0.0
npx expo install --fix
npm install expo@latest
https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/


# Tasks:
    [ ] hard mode with background contrasting
    [ ] shadow bug on android/native
    [ ] Clean up UI
        - investigate typography
        - investigate custom slider


# Apple Errors:

Authentication with Apple Developer Portal failed!
Apple provided the following error info:
Service not available because of maintenance activities, please try again after some time.

https://developer.apple.com/system-status/

If it keeps occuring, use:
npm install -g eas-cli --force

