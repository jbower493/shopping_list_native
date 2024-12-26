import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  return <View style={styles.main}><Text>Shopping List Latest</Text></View>;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
