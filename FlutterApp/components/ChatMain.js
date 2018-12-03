import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { Metrics, Colors } from './Themes';

class ChatMain extends React.Component {
  state = {
    chatList: [
      {
        name: 'Cynthia',
        picUrl: 'https://i.imgur.com/z7fgB60.jpg',
        key: '11221212',
        subtitle: 'Cynthia: let\'s meet by the pond'
      },
      {
        name: 'Belle',
        picUrl: 'https://vignette.wikia.nocookie.net/disneyheroines/images/7/7c/Belle.jpg',
        key: '33488788',
        subtitle: 'You: Okay, see you in a bit!'
      },
    ]
  };

  onChangeSearchText = () => null; // search; do last
  onClearSearchText = () => null; // search; do last

  onPressNewChat = () => {
    this.props.navigation.navigate('Chat', { name: 'TODO fix chat' });
  }

  onPressChat = () => {
    this.props.navigation.navigate('Chat', { name: 'TODO fix chat' });
  }

  static navigationOptions = {
    title: 'Messages',
  };

  render() {
    return (
      <View style={styles.container}>

      <SearchBar
        round
        lightTheme
        containerStyle={styles.searchBarContainer}
        inputStyle={styles.searchBar}
        onChangeText={this.onChangeSearchText}
        onClearText={this.onClearSearchText}
        placeholder='Search chats...'
        />

      <ScrollView>
        {
          this.state.chatList.map((l) => (
            <ListItem
              roundAvatar
              key={l.key}
              title={l.name}
              subtitle={l.subtitle}
              avatar={{uri:l.picUrl}}
              onPress={this.onPressChat}
            />
          ))
        }
      </ScrollView>
      </View>
    );
  }
}

const offset = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: 'white',
  },
  searchBar: {
    backgroundColor: Colors.background,
    fontSize: 16,
  },
});

export default ChatMain;
