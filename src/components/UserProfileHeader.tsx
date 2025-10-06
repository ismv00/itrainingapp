import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { auth } from '../services/firebaseConfig';
import { User } from 'firebase/auth';

interface UserProfileHeaderProps {
  user: User;
  userData: {
    name: string;
    email: string;
    photoURL?: string | null;
  };
}

export default function UserProfileHeader({
  user,
  userData,
}: UserProfileHeaderProps) {
  const { name, email, photoURL } = userData;
  const hasPhoto = photoURL && photoURL.length > 0;

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 30 }]}>
      <View style={styles.avatarWrapper}>
        {hasPhoto ? (
          <Image source={{ uri: photoURL! }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initialsText}>
              {name ? name[0].toUpperCase() : ''}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.nameText}>{name || 'Usuário'}</Text>
      <Text style={styles.emailText}>{email || 'Sem e-mail'}</Text>

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: colors.greenText,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.blackText,
  },
  nameText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  emailText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
  spacer: {
    height: 30,
  },
});
