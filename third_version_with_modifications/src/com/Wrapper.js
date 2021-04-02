import React from 'react';

import MyHeader from './MyHeader';
import CheckBoard from './CheckBoard copy';

class Wrapper extends React.Component {
  constructor() {
    super();

    // clickedMode用来表示当前选择的状态对战状态
    // 1为双人对战
    // 2为人机对战
    // 同时该属性还用来判断是否展示选择框
    // 3为不展示选择框 其余值（1,2）都是展示选择框
    this.state = {
      clickedMode: 3,
    };
  }

  render() {
    return (
      <div>
        <MyHeader
          clickedMode={this.state.clickedMode}
          onChangeClickedMode={this.handleChangeClickedMode.bind(this)}
        />
        <CheckBoard n={10} first={-1} clickedMode={this.state.clickedMode} />
      </div>
    );
  }

  handleChangeClickedMode(value) {
    console.log('das', value);
    this.setState({
      clickedMode: value,
      dsad: 'dasdsa',
    });
    this.forceUpdate();
    console.log(this, this.state, this.state.clickedMode);
    // this.forceUpdate();
  }
}

export default Wrapper;
