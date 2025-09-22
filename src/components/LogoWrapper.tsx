import React from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';

interface LogoWrapperProps {
  style?: ImageStyle;
}

export default function LogoWrapper({ style }: LogoWrapperProps) {
  return (
    <Image
      source={require('../assets/logo.png')}
      resizeMode="contain"
      style={[styles.logo, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
