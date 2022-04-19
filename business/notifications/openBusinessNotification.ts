import { BusinessSchedule } from '@appjusto/types';
import * as Notifications from 'expo-notifications';

// https://recontextualization.medium.com/local-notifications-in-expo-867e2af1ca97
// defining notification
const openBusinessNotification = {
  title: 'Hora de abrir!',
  body: 'Acesse o app ou o gerenciador de pedidos no desktop para abrir seu restaurante e receber pedidos', // (string) — body text of the notification.
  ios: {
    // (optional) (object) — notification configuration specific to iOS.
    sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
  },
  // (optional) (object) — notification configuration specific to Android.
  android: {
    sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
    //icon (optional) (string) — URL of icon to display in notification drawer.
    //color (optional) (string) — color of the notification icon in notification drawer.
    priority: 'max', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
    sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
    vibrate: true, // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
    // link (optional) (string) — external link to open when notification is selected.
  },
};

// scheduling options
let t = new Date();
t.setSeconds(t.getSeconds() + 10);
const schedulingOptions = {
  time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
  repeat: true,
};

// scheduling notication (deprecated)
// Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

// most current example: https://dev.to/neeleshrj/local-notifications-using-expo-25il

// needed: business and business schedule. take a look at the businessShouldBeOpen function to define the trigger

// 1: Initialize the Notification Handler
// check reference: common > app > notifications > index.ts > init
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// 2: Schedule Notification function
// export async function schedulePushNotification(className, slot, type, time, day) {
//   time = new Date(time.getTime() - 5 * 60000);
//   var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const weekday = days.indexOf(day) + 1;
//   const hours = time.getHours();
//   const minutes = time.getMinutes();
//   const id = await Notifications.scheduleNotificationAsync({
//     content: {
//       title: className + ' ' + type,
//       body: slot,
//       // sound: 'default',
//     },
//     trigger: {
//       weekday: weekday,
//       hour: hours,
//       minute: minutes,
//       repeats: true,
//     },
//   });
//   console.log('notif id on scheduling', id);
//   return id;
// }

//3:  Register Push Notification Function
// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       sound: true,
//       lightColor: "#FF231F7C",
//       lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
//       bypassDnd: true,
//     });
//   }

//   return token;
// }
// expo example
const scheduleOpenBusinessNotification = async (today: Date, schedules: BusinessSchedule) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tá na hora de abrir! :)',
      body: 'Acesse o app ou o gerenciador de pedidos no desktop para abrir seu restaurante',
      data: { data: 'goes here' },
    },
    trigger: { repeats: true },
  });
};
