import * as React from 'react';
import {Text, View, TouchableOpacity, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
export const navigationRef = React.createRef();

function navigate(name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params);
}

export function setupPushNotification(handleNotification) {
  PushNotification.configure({
    onNotification: function(notification) {
      handleNotification(notification);
      if (Platform.OS === 'ios') {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  return PushNotification;
}

export default class Home extends React.Component {
  componentDidMount() {
    this.pushNotification = setupPushNotification(this._handleNotificationOpen);
  }

  _handleNotificationOpen = notification => {
    // alert(notification.screen);
    console.log(notification);
    if (notification.userInteraction) {
      navigate(notification.screen);
    }
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => navigate('Detail')}>
          <Text> Home </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
