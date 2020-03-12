import React, {Component} from 'react';
import {Text, View} from 'react-native';
import firebase from 'react-native-firebase';

export const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}

export default class Home extends Component {
  async componentDidMount() {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      const fcmToken = await firebase.messaging().getToken();
      console.log('fcmToken', fcmToken);

      this.notificationListener = firebase
        .notifications()
        .onNotification(notification => {
          let notificationMessage =
            notification._android._notification._data.action;
          let recordId = notification._android._notification._data.recordID;

          let {title, body} = notification;
          console.log(title, body, notificationMessage, recordId);

          const channelId = new firebase.notifications.Android.Channel(
            'Default',
            'Default',
            firebase.notifications.Android.Importance.High,
          );
          firebase.notifications().android.createChannel(channelId);

          let notification_to_be_displayed = new firebase.notifications.Notification(
            {
              data: notification._android._notification._data,
              sound: 'default',
              show_in_foreground: true,
              title: notification.title,
              body: notification.body,
            },
          );

          if (Platform.OS == 'android') {
            notification_to_be_displayed.android
              .setPriority(firebase.notifications.Android.Priority.High)
              .android.setChannelId('Default')
              .android.setVibrate(1000)
              .android.setSmallIcon('ic_stat_ic_notification');
          }
          console.log(
            'FOREGROUND NOTIFICATION LISTENER: \n',
            notification_to_be_displayed,
          );

          firebase
            .notifications()
            .displayNotification(notification_to_be_displayed);
        });

      /*
       * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
       * */
      this.notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened(notificationOpen => {
          const {screen} = notificationOpen.notification._data;
          console.log(navigate(screen));
          firebase
            .notifications()
            .removeDeliveredNotification(
              notificationOpen.notification.notificationId,
            );
        });

      /*
       * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
       * */
      const notificationOpen = await firebase
        .notifications()
        .getInitialNotification();
      if (notificationOpen) {
        const {screen} = notificationOpen.notification._data;
        console.log(navigate(screen));
      }
    } else {
      try {
        firebase.messaging().requestPermission();
      } catch (e) {
        alert('user rejected the permissions');
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> Push Notif </Text>
      </View>
    );
  }
}
