import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { firebaseAuth } from "./firebase";

export default function AuthExample() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const sub = firebaseAuth().onAuthStateChanged(setUser);
    return sub;
  }, []);

  const signIn = async () => {
    await firebaseAuth().signInWithEmailAndPassword("test@example.com", "password123");
  };

  const signOut = async () => {
    await firebaseAuth().signOut();
  };

  return (
    <View>
      <Text>{user ? `Logged in: ${user.email}` : "Not logged in"}</Text>
      <Button title="Sign in" onPress={signIn} />
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
