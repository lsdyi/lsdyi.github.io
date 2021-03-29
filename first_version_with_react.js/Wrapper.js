class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      clickedMode: 3,
    };
  }

  render() {
    return (
      <div onClick={this.test.bind(this)}>
        <MyHeader />
        <Checkboard n={10} first={-1} clickedMode={this.state.clickedMode} />
      </div>
    );
  }

  test(e) {
    if (e.target.tagName === 'LI') {
      // 这样就把子组件中的state给传过来了
      this.setState({
        clickedMode: e.target.up,
      });
    }
  }
}
