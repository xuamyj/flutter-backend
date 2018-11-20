import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

const StoriesRoute = () => (
  <View style={styles.scene} />
);
const TreasuresRoute = () => (
  <View style={styles.scene} />
);

class HomeMain extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'stories', title: 'Stories' },
      { key: 'treasures', title: 'Treasures' },
    ],
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={{uri: 'https://i.imgur.com/2nFQl0r.png'}}
        />

        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            stories: StoriesRoute,
            treasures: TreasuresRoute
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={props =>
            <TabBar
              {...props}
              indicatorStyle={{backgroundColor: '#49B6BB'}}
              labelStyle={{color: 'gray'}}
              style={{backgroundColor: 'white'}}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 110,
    height: 60,
  },
  scene: {
    flex: 1,
  },
})

export default HomeMain;
