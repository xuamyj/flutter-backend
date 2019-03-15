import React, {Component} from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions, Image, Animated, Alert, TouchableOpacity } from 'react-native';
import { Card, Avatar, SearchBar } from 'react-native-elements';
import { Metrics, Colors } from '../Themes';
import StoryCard from './StoryCard';

import SearchInput, { createFilter } from 'react-native-search-filter';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modal';
import ModalFilterPicker from 'react-native-modal-filter-picker';

import Fire from '../../Fire';

const KEYS_TO_FILTERS = ['itemName', 'itemDescription', 'userName', 'recvItemDescription'];
const GROUP_KEYS_TO_FILTERS = ['groupId']

const {height, width} = Dimensions.get('window');

class Stories extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      searchTerm: '',
      picked: '',
      isProfile: this.props.isProfile,
      stories: [],
      options: [],
    }
  }

  searchUpdated(term) {
    this.setState({
      searchTerm: term,
    })
  }

  onShow = () => {
    this.setState({ isModalVisible: true });
  }

  onSelect = (picked) => {
    this.setState({
      picked: picked,
      isModalVisible: false,
    })
  }

  onCancel = () => {
    this.setState({
      picked: '',
      isModalVisible: false,
    })
  }

  onPressShareStory = (name, key) => {
    this.props.navigation.navigate('ShareStory', {name: name, key: key});
  }

  createStoryObj = (key, item, giverObj, receiverObj, groupObj) => {
    return {
      itemName: item.itemName,
      itemDescription: item.giver.itemDescription,
      itemPicUrl: item.giver.itemPicUrl,
      groupId: item.groupId,
      groupName: groupObj.groupName,
      userName: giverObj.display_name,
      userPicUrl: giverObj.profile_picture,
      state: item.state,
      timestamp: item.timestamp,
      key: key,

      giveItemDescription: item.giver.itemDescription,
      giveItemPicUrl: item.giver.itemPicUrl,
      giveUserName: giverObj.display_name,
      giveUserPicUrl: giverObj.profile_picture,
      giveUserId: item.giver.id,

      recvItemDescription: item.receiver.itemDescription,
      recvItemPicUrl: item.receiver.itemPicUrl,
      recvUserName: receiverObj.display_name,
      recvUserPicUrl: receiverObj.profile_picture,
      recvUserId: item.receiver.id,
    };
  }

  isTreasure = (item) => {
    return item.state === "POSTED";
  }

  isMineGiven = (item) => {
    return item.giver.id === Fire.shared.uid;
  }
  isMineReceived = (item) => {
    return item.receiver.id === Fire.shared.uid;
  }

  componentDidMount() {
    let itemList = [];
    this.callbackGetAllItems = Fire.shared.getAllItems(itemResult => {
      itemList = [];
      itemResult.forEach((item) => {
        itemList.push(item);
      })
      Promise.all(itemList).then(() => {
        let storiesList = [];
        itemList.forEach((item) => {
          // if it belongs to a group that I am a part of
          let key = item.key;
          let itemObj = item.val();
          if (!this.isTreasure(itemObj)) {
            Fire.shared.getGroup(itemObj.groupId, groupObj => {
              Fire.shared.getUser(itemObj.giver.id, giverObj => {
                Fire.shared.getUser(itemObj.receiver.id, receiverObj => {
                  if (groupObj.memberList.includes(Fire.shared.uid)) {
                    if (this.props.isHome && itemObj.state === "COMPLETE") {
                      storiesList.push(this.createStoryObj(key, itemObj, giverObj, receiverObj, groupObj));
                    } else if (this.props.isGroup
                      && itemObj.state === "COMPLETE"
                      && itemObj.groupId === this.props.navigation.state.params.groupId) {
                      storiesList.push(this.createStoryObj(key, itemObj, giverObj, receiverObj, groupObj));
                    } else if ((this.props.isMineGiven && this.isMineGiven(itemObj))
                      || (this.props.isMineReceived && this.isMineReceived(itemObj))) {
                      storiesList.push(this.createStoryObj(key, itemObj, giverObj, receiverObj, groupObj));
                    }
                  }
                  storiesList = this.sortByTime(storiesList);
                  let options = [];
                  this.callbackGetAllGroups = Fire.shared.getAllGroups(groupResult => {
                    groupResult.forEach((group)=>{
                      if (group.val().memberList.includes(Fire.shared.uid)) {
                        key = group.key;
                        label = group.val().groupName;
                        options.push({key, label});
                      }
                    });
                    this.setState( previousState => ({
                      stories: storiesList,
                      options: options
                    }));
                  })
                });
              });
            });
          }
        })
      });
    });
  }

  componentWillUnmount() {
    Fire.shared.offItems(this.callbackGetAllItems);
    Fire.shared.offGroups(this.callbackGetAllGroups);
  }

  sortByTime(list) {
    return list.sort(function(a, b) {
      let x = a.timestamp;
      let y = b.timestamp;
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    })
  }

  render() {
    const { isModalVisible, picked } = this.state;

    let filteredStories = this.state.stories.filter(createFilter(this.state.picked, GROUP_KEYS_TO_FILTERS));
    filteredStories = filteredStories.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

    return (
      <View style={styles.container}>
        <ModalFilterPicker
          visible={isModalVisible}
          onSelect={this.onSelect}
          onCancel={this.onCancel}
          options={this.state.options}
          placeholderText="Filter by group..."
        />
        <View style={styles.searchView}>
          <View style={styles.searchBarView}>
            <SearchBar
              round
              lightTheme
              containerStyle={styles.searchBarContainer}
              inputStyle={styles.searchBar}
              onChangeText={(term) => { this.searchUpdated(term) }}
              placeholder='Search...'
              clearIcon
            />
          </View>
          <TouchableOpacity onPress={this.onShow}>
              <Image
              style={styles.button}
              source={require("../../assets/filter.png")}
              />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {
            filteredStories.map((l, i) => (
              <StoryCard story={l}
                myId={Fire.shared.uid}
                index={i}
                onPressShareStory={this.onPressShareStory}
                isProfile={this.state.isProfile}/>
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Metrics.doubleBaseMargin * 2,
  },
  group: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  caption: {
    flex: 1,
    flexDirection: 'row',
    width: width * 0.8,
    justifyContent: 'space-between',
  },
  captiontext: {
    margin: 5,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: Metrics.doubleBaseMargin,
    borderColor: Colors.border,
    borderWidth: Metrics.borderWidth,
    margin: Metrics.baseMargin,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
  },
  image: {
    width: Metrics.screenWidth * 0.9,
    height: Metrics.screenWidth * 1.05,
    resizeMode: 'contain',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleheader: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  groupheader: {
    fontSize: 24,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBar: {
    backgroundColor: Colors.background,
    fontSize: 15,
    width: Metrics.screenWidth * 0.88,
  },
  searchBarView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Metrics.screenWidth * 0.88,
  },
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Metrics.screenWidth,
  },
  smallImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 5,
  },
  button: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
})

export default withNavigation(Stories);
