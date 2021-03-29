import React from 'react';

import { Stage, Layer, Group, Rect, Circle } from 'react-konva';
import Konva from 'konva';

import './CheckBoard.css';
class Checkboard extends React.Component {
  // n是棋局的长宽大小
  constructor(props) {
    super(props);
    this.matrix = [];
    for (let i = 0; i < this.props.n; i++) {
      this.matrix.push([]);
      for (let j = 0; j < this.props.n; j++) {
        this.matrix[i].push(0);
      }
    }

    this.scores = [];
    for (let i = 0; i < this.props.n; i++) {
      this.scores.push([]);
      for (let j = 0; j < this.props.n; j++) {
        this.scores[i].push(0);
      }
    }

    // record是下棋子的记录 具有栈的特性 用于悔棋 其中的元素一个三元数组
    // i，j，status 表示status棋手在（i，j）位置下棋
    // regret_record是悔棋记录 也是栈的特性 用于撤销悔棋，其中的元素也是三元组
    // choose表示是用DOM还是用canvas
    this.state = {
      matrix: this.matrix,
      now: this.props.first,
      record: [],
      regret_record: [],

      socres: this.scores,

      choose: 1,

      ori: 'palegoldenrod',
    };
  }

  render() {
    return (
      <div className='container'>
        <div className='left'>
          <h1>
            黑棋选手：
            <br />
            {this.props.clickedMode != 1 ? '用户' : ''}
            {this.state.now == -1 ? '下棋' : '等待'}
          </h1>
          <div className={this.props.clickedMode != 1 ? 'hidden' : ''}>
            <button className='revoke' onClick={this.regret.bind(this, -1)}>
              我要悔棋
            </button>
            <button className='revoke' onClick={this.revoke.bind(this, -1)}>
              算了还是不悔了
            </button>
          </div>
        </div>
        <div className='middle'>
          <div className='choosebuttons'>
            <button
              onClick={this.togglechoose.bind(this, 1)}
              className={`choose ${this.state.choose == 1 ? 'beenchosen' : ''}`}
            >
              DOM
            </button>
            <button
              onClick={this.togglechoose.bind(this, 2)}
              className={`choose ${this.state.choose == 2 ? 'beenchosen' : ''}`}
            >
              canvas
            </button>
          </div>
          <div className={`border ${this.state.choose == 1 ? '' : 'hidden'}`}>
            {this.state.matrix.map((item, index) => {
              return (
                <div
                  className={`row ${
                    index === this.state.matrix.length - 1 ? 'lastrow' : ''
                  }`}
                  key={index}
                >
                  {this.help(item, index)}
                </div>
              );
            })}
          </div>
          <Stage
            width={500}
            height={500}
            className={`mycanvas border ${
              this.state.choose == 2 ? '' : 'hidden'
            }`}
            onClick={this.handleClickCanvas.bind(this)}
          >
            <Layer>
              {this.state.matrix.map((item, index) => {
                return item.map((itemj, indexj) => {
                  if (
                    index == this.matrix.length - 1 ||
                    indexj == item.length - 1
                  ) {
                    return (
                      <Circle
                        key={index + ' ' + indexj}
                        x={14 + indexj * 52}
                        y={14 + index * 52}
                        radius={14}
                        fill={this.colorOfCanvasplot.call(this, index, indexj)}
                      />
                    );
                  }
                  return (
                    <Group key={index + ' ' + indexj}>
                      <Rect
                        zind
                        x={14 + indexj * 52}
                        y={14 + index * 52}
                        height={52}
                        width={52}
                        stroke='black'
                      />

                      <Circle
                        x={14 + indexj * 52}
                        y={14 + index * 52}
                        radius={14}
                        fill={this.colorOfCanvasplot.call(this, index, indexj)}
                      />
                    </Group>
                  );
                });
              })}
            </Layer>
          </Stage>
        </div>

        <div className='right'>
          <h1>
            白棋选手：
            <br />
            {this.props.clickedMode != 1 ? '计算机' : ''}
            {this.state.now == 1 ? '下棋' : '等待'}
          </h1>
          <div className={this.props.clickedMode != 1 ? 'hidden' : ''}>
            <button className='revoke' onClick={this.regret.bind(this, 1)}>
              我要悔棋
            </button>
            <button className='revoke' onClick={this.revoke.bind(this, 1)}>
              算了还是不悔了
            </button>
          </div>
        </div>
      </div>
    );
  }

  handleClickCanvas(e) {
    let x = e.evt.offsetY;
    let y = e.evt.offsetX;
    // console.log(x, y);
    let [i, j] = [Math.floor((x + 14) / 52), Math.floor((y + 14) / 52)];

    this.setCheckStatus(i, j, this.state.now);
  }

  colorOfCanvasplot(i, j) {
    if (this.state.matrix[i][j] == 1) {
      return 'white';
    } else if (this.state.matrix[i][j] == -1) {
      return 'black';
    } else {
      return undefined;
    }
  }
  togglechoose(choose) {
    this.state.choose = choose;

    // 渲染机制没有检测到发生变化的数据 ？？？强制刷新一下
    this.forceUpdate();
  }
  getClass(item) {
    if (item == 0) {
      return '';
    } else if (item == 1) {
      return 'white';
    } else {
      return 'black';
    }
  }
  // 渲染二维数组 我yue了
  help(ar, i) {
    return ar.map((item, index) => {
      return (
        <span
          className={this.getClass(item)}
          key={index}
          onClick={this.setCheckStatus.bind(this, i, index, this.state.now)}
        ></span>
      );
    });
  }

  // 检验棋局是否有胜负
  examine(i, j, status) {
    // 第1个方向 0度方向
    let temp_1 = j;
    let temp_2 = j;
    while (this.state.matrix[i][temp_1] == status && temp_1) {
      temp_1 -= 1;
    }
    if (this.state.matrix[i][temp_1] != status) {
      temp_1 += 1;
    }

    while (
      this.state.matrix[i][temp_2] == status &&
      temp_2 < this.props.n - 1
    ) {
      temp_2 += 1;
    }
    if (this.state.matrix[i][temp_2] != status) {
      temp_2 -= 1;
    }
    console.log(temp_1, temp_2);
    if (temp_2 - temp_1 + 1 >= 5) {
      setTimeout(() => {
        alert('获胜者出现啦！是' + (status == 1 ? '白棋选手' : '黑棋选手'));
        location.reload();
      });
    }

    // 第2个方向 90度方向
    temp_1 = i;
    temp_2 = i;
    while (this.state.matrix[temp_1][j] == status && temp_1) {
      temp_1 -= 1;
    }
    if (this.state.matrix[temp_1][j] != status) {
      temp_1 += 1;
    }

    while (
      this.state.matrix[temp_2][j] == status &&
      temp_2 < this.props.n - 1
    ) {
      temp_2 += 1;
    }
    if (this.state.matrix[temp_2][j] != status) {
      temp_2 -= 1;
    }

    console.log(temp_1, temp_2);
    if (temp_2 - temp_1 + 1 >= 5) {
      setTimeout(() => {
        alert('获胜者出现啦！是' + (status == 1 ? '白棋选手' : '黑棋选手'));
        location.reload();
      });
    }

    // 第3个方向 45度方向
    temp_1 = i;
    let temp_1y = j;
    temp_2 = i;
    let temp_2y = j;
    while (
      this.state.matrix[temp_1][temp_1y] == status &&
      temp_1 &&
      temp_1y < this.props.n - 1
    ) {
      temp_1 -= 1;
      temp_1y += 1;
    }
    if (this.state.matrix[temp_1][temp_1y] != status) {
      temp_1 += 1;
      temp_1y -= 1;
    }

    while (
      this.state.matrix[temp_2][temp_2y] == status &&
      temp_2 < this.props.n - 1 &&
      temp_2y
    ) {
      temp_2 += 1;
      temp_2y -= 1;
    }
    if (this.state.matrix[temp_2][temp_2y] != status) {
      temp_2 -= 1;
      temp_2y += 1;
    }

    console.log(temp_1, temp_2);
    if (temp_2 - temp_1 + 1 >= 5) {
      setTimeout(() => {
        alert('获胜者出现啦！是' + (status == 1 ? '白棋选手' : '黑棋选手'));
        location.reload();
      });
    }

    // 第4个方向 -45度方向
    temp_1 = i;
    temp_1y = j;
    temp_2 = i;
    temp_2y = j;
    while (this.state.matrix[temp_1][temp_1y] == status && temp_1 && temp_1y) {
      temp_1 -= 1;
      temp_1y -= 1;
    }
    if (this.state.matrix[temp_1][temp_1y] != status) {
      temp_1 += 1;
      temp_1y += 1;
    }

    while (
      this.state.matrix[temp_2][temp_2y] == status &&
      temp_2 < this.props.n - 1 &&
      temp_2y < this.props.n - 1
    ) {
      temp_2 += 1;
      temp_2y += 1;
    }
    if (this.state.matrix[temp_2][temp_2y] != status) {
      temp_2 -= 1;
      temp_2y -= 1;
    }

    console.log(temp_1, temp_2);
    if (temp_2 - temp_1 + 1 >= 5) {
      setTimeout(() => {
        alert('获胜者出现啦！是' + (status == 1 ? '白棋选手' : '黑棋选手'));
        location.reload();
      });
    }
  }

  setCheckStatus(i, j, status) {
    // console.log(i, j, status);
    // 复盘的时候加上参数校验的步骤
    console.log('dsadsa', this.state.matrix[i][j], status);
    if (this.state.matrix[i][j] != 0 && status != 0) {
      console.log('胡放呢？');
      return;
    }
    this.matrix[i][j] = status;
    this.setState({
      matrix: this.matrix,
    });

    if (status == 0) {
      // 说明现在是在悔棋呢 悔了之后状态到前一个了
      // 不用检验前面是否分出胜负 但是现在该下棋的人是那个悔棋的人
      this.state.now = -this.state.now;
      return;
    }

    // 将这位棋手的下棋记录压栈
    this.state.record.push([i, j, status]);

    // 下棋之后检验是否分出胜负
    this.examine(i, j, status);
    // 该对方棋手出棋
    this.state.now = -this.state.now;

    // 人机模式
    if (this.state.now == 1 && this.props.clickedMode != 1) {
      this.human_computer();
    }

    console.log(this.state.matrix);
  }

  // 悔棋
  regret(status) {
    // 如果玩家A想悔棋，但是玩家B已经下棋子了，那就不能悔咯
    let len = this.state.record.length;
    // 悔棋的话已悔栈中一定要是空的才行
    if (
      len &&
      this.state.record[len - 1][2] == status &&
      this.state.regret_record.length == 0
    ) {
      // 可以悔棋
      const temp = this.state.record.pop();
      this.setCheckStatus(temp[0], temp[1], 0);

      // 将悔棋的这一操作压入悔棋栈中
      this.state.regret_record.push([temp[0], temp[1], status]);
    } else {
      alert('您当前不可悔棋哦');
    }
  }

  // 撤销悔棋
  revoke(status) {
    const len = this.state.regret_record.length;
    if (len && this.state.regret_record[len - 1][2] == status) {
      const temp = this.state.regret_record.pop();
      this.setCheckStatus(temp[0], temp[1], status);
    } else {
      alert('与你无瓜 你撤啥?');
    }
  }

  // 下面是人机对战的思路啦，用户可以优先选择是下黑子还是白子
  // 因为在五子棋中是黑子先行
  human_computer() {
    // -1代表黑棋选手，1代表白棋选手
    let hm = {};
    hm[1] = 10;
    hm[11] = 100;
    hm[111] = 5000;
    hm[1111] = 8000;

    hm[12] = 5;
    hm[112] = 80;
    hm[1112] = 3000;
    hm[11112] = 10000;

    hm[21] = 11;
    hm[211] = 110;
    hm[2111] = 1100;
    hm[21111] = 11000;

    hm[2] = 20;
    hm[22] = 200;
    hm[222] = 4500;
    hm[2222] = 10000;

    hm[221] = 100;
    hm[2221] = 3000;
    hm[22221] = 12000;
    hm[122] = 5;
    hm[1222] = 500;
    hm[12222] = 10000;

    let values = [];
    let ar = [];
    ar = this.state.matrix.map((item) => {
      return item.map((element) => {
        if (element == -1) {
          return 1;
        } else if (element == 1) {
          return 2;
        } else {
          return 0;
        }
      });
    });
    for (let i = 0; i < this.props.n; i++) {
      values.push([]);
      for (let j = 0; j < this.props.n; j++) {
        values[i].push(0);
        if (ar[i][j] == 0) {
          // 这里是一个没有棋子的点
          let code = '';
          let color = 0;
          for (let k = i + 1; k < this.props.n; k++) {
            if (ar[k][j] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[k][j];
                code += ar[k][j];
              } else if (color == ar[k][j]) {
                code += ar[k][j];
              } else {
                code += ar[k][j];
                break;
              }
            }
          }

          let num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          // 向左
          code = '';
          color = 0;
          for (let k = i - 1; k > 0; k--) {
            //向左开始时遍历
            if (ar[k][j] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[k][j];
                code += ar[k][j];
              } else if (color == ar[k][j]) {
                code += ar[k][j];
              } else {
                code += ar[k][j];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          code = '';
          color = 0;
          for (let k = j - 1; k > 0; k--) {
            //向上开始时遍历
            if (ar[i][k] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[i][k];
                code += ar[i][k];
              } else if (color == ar[i][k]) {
                code += ar[i][k];
              } else {
                code += ar[i][k];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          code = '';
          color = 0;
          for (let k = j + 1; k < ar.length; k++) {
            //向下开始时遍历
            if (ar[i][k] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[i][k];
                code += ar[i][k];
              } else if (color == ar[i][k]) {
                code += ar[i][k];
              } else {
                code += ar[i][k];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          code = '';
          color = 0;
          for (let o = i - 1, k = j - 1; k > 0 && o > 0; k--, o--) {
            //向左上开始时遍历
            if (ar[o][k] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[o][k];
                code += ar[o][k];
              } else if (color == ar[o][k]) {
                code += ar[o][k];
              } else {
                code += ar[o][k];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          code = '';
          color = 0;
          for (let o = i + 1, k = j - 1; k > 0 && o < ar.length; k--, o++) {
            //向右上开始时遍历
            if (ar[o][k] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[o][k];
                code += ar[o][k];
              } else if (color == ar[o][k]) {
                code += ar[o][k];
              } else {
                code += ar[o][k];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          code = '';
          color = 0;
          for (
            let o = i + 1, k = j + 1;
            k < ar.length && o < ar.length;
            k++, o++
          ) {
            //向右下开始时遍历
            if (ar[o][k] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[o][k];
                code += ar[o][k];
              } else if (color == ar[o][k]) {
                code += ar[o][k];
              } else {
                code += ar[o][k];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }

          code = '';
          color = 0;
          for (let o = i - 1, k = j + 1; k < ar.length && o > 0; k++, o--) {
            //向左下开始时遍历
            if (ar[o][k] == 0) {
              break;
            } else {
              if (color == 0) {
                color = ar[o][k];
                code += ar[o][k];
              } else if (color == ar[o][k]) {
                code += ar[o][k];
              } else {
                code += ar[o][k];
                break;
              }
            }
          }
          num = hm[code];
          if (num) {
            values[i][j] += num;
          }
        }
      }
    }
    console.log(values);
    let max = 0;
    let goalx = 0;
    let goaly = 0;
    for (let i = 0; i < this.state.matrix.length; i++) {
      for (let j = 0; j < this.state.matrix.length; j++) {
        if (values[i][j] > max) {
          max = values[i][j];
          goalx = i;
          goaly = j;
        }
      }
    }

    this.setCheckStatus(goalx, goaly, 1);
  }
}

export default Checkboard;
