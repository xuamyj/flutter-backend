import React, { Component } from 'react';
import {KeyboardAvoidingView} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Metrics, Colors } from './Themes';

import Fire from '../Fire';

class Chat extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
    headerStyle: {backgroundColor: Colors.background},
    headerTitleStyle: {
      fontFamily: 'NunitoBold',
      fontWeight: '200',
      color: Colors.dark,
    },
    headerTintColor: Colors.teal,
  });

  state = {
    messages: [],
  };

  get user() {
    // Return our name and our UID for GiftedChat to parse
    return {
      name: this.props.navigation.state.params.name,
      _id: Fire.shared.uid,
    };
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex:1, backgroundColor: 'transparent' }} behavior="padding" keyboardVerticalOffset={4*Metrics.doubleBaseMargin}>
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
      />
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    Fire.shared.off();
  }
}

export default Chat;
