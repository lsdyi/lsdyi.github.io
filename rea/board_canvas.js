// const contentDisposition = require('content-disposition');

// const { threadId } = require('worker_threads');

class BoardCanvas extends React.Component {
  constructor(props) {
    super(props);
    /**
     * n表示线的条数 也就是每行每列最多能下多少颗棋子
     */

    this.canvas = React.createRef();
  }

  componentDidMount() {
    console.log(this.props.n);
    const canvas = this.canvas.current;
    this.ctx = canvas.getContext('2d');

    this.ctx.strokeStyle = 'black';
    for (let i = 0; i < this.props.n; i++) {
      console.log(i);
      this.ctx.moveTo(10, 10 + (500 * i) / this.props.n);
      this.ctx.lineTo(460, 10 + (500 * i) / this.props.n);
      this.ctx.stroke();
    }

    for (let i = 0; i < this.props.n; i++) {
      this.ctx.moveTo(10 + (500 * i) / this.props.n, 10);
      this.ctx.lineTo(10 + (500 * i) / this.props.n, 460);
      this.ctx.stroke();
    }

    this.setPlot(1, 2, 1);
    this.setPlot(1, 2, 0);
  }

  get_x_y(e) {
    console.dir(e.persist);
    // console.log(e.target.layerX, event.target.screenX);
    // console.log(i, j);
  }

  setPlot(i, j, status) {
    this.ctx.beginPath();
    this.ctx.arc(
      10 + (i * 500) / this.props.n,
      10 + (j * 500) / this.props.n,
      15,
      0,
      2 * Math.PI
    );

    if (status == 1) {
      // 白棋
      this.ctx.fillStyle = 'white';
    } else if (status == -1) {
      this.ctx.fillStyle = 'black';
    } else {
      this.ctx.fillStyle = 'palegoldenrod';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      for (let i = 0; i < this.props.n; i++) {
        console.log(i);
        this.ctx.moveTo(10, 10 + (500 * i) / this.props.n);
        this.ctx.lineTo(460, 10 + (500 * i) / this.props.n);
        this.ctx.stroke();
      }

      for (let i = 0; i < this.props.n; i++) {
        this.ctx.moveTo(10 + (500 * i) / this.props.n, 10);
        this.ctx.lineTo(10 + (500 * i) / this.props.n, 460);
        this.ctx.stroke();
      }
      return;
    }
    this.ctx.fill();
  }

  // 那在react里面怎样给一个元素设置多个class呢 哦？懂了
  render() {
    return (
      <canvas
        onClick={this.get_x_y.bind(this)}
        ref={this.canvas}
        height='470'
        width='470'
        className='canvasboard'
      ></canvas>
    );
  }
}
