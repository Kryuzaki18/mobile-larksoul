import React from 'react';
import { View } from 'react-native';

// Stub for react-native-gesture-handler/DrawerLayout (removed in v3)
export default class DrawerLayout extends React.Component {
  openDrawer() {}
  closeDrawer() {}
  render() {
    return React.createElement(View, null, this.props.children);
  }
}
