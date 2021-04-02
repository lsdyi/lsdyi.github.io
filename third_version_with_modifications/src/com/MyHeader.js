import React from 'react';
class MyHeader extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <header>
        <section>
          <a href='https://github.com/lsdyi/lsdyi.github.io'>仓库地址</a>
        </section>
        <section>
          <a onClick={this.modeChoose.bind(this, 4)}>模式选择</a>
          <ul className={this.props.clickedMode == 4 ? 'show' : 'hidden'}>
            <li onClick={this.modeChoose.bind(this, 1)}>双人对战</li>
            <li onClick={this.modeChoose.bind(this, 2)}>挑战人机</li>
            <li onClick={this.modeChoose.bind(this, 3)}>取消</li>
          </ul>
        </section>
      </header>
    );
  }

  modeChoose(flag) {
    console.log(flag, this);
    this.props.onChangeClickedMode(flag);
  }
}

export default MyHeader;
