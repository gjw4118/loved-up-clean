Use a /src folder

Expo Router is a file-based router where the navigation tree of your app is based on the folder structure and layout files, with the main entry point being the /app folder. Both /app and /src/app are supported out of the box. So if you want to switch from /app to /src/app, simply move the folder and restart the bundler!

The benefit of using /src folder is that it allows you to separate your app code from other files, and this makes the codebase much easier to work with.