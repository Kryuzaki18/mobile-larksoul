import React from 'react';
import { View } from 'react-native';

// Stub for react-native-gesture-handler/Swipeable (removed in v3)
export default class Swipeable extends React.Component {
  close() {}
  openLeft() {}
  openRight() {}
  render() {
    return React.createElement(View, null, this.props.children);
  }
}
