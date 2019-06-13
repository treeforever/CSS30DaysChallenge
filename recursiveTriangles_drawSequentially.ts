import _ from 'lodash';

const TIME_OUT = 1000;
const RECURSIVE_LIMIT = 5;

const summerColors = ['#F4DA29', '#426AB9', '#DB5461', '#23F0C7']; // yellow, blue, red, green

var canvas = document.getElementById('canvas');
if (canvas.getContext) {
  var ctx = canvas.getContext('2d');

  type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  type Point = {
    x: number;
    y: number;
  };
  type Triangle = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
  };

  function selectColor(index) {
    return summerColors[index % summerColors.length];
  }

  function getMiddlePointOfLine(line: Line): Point {
    const { x1, y1, x2, y2 } = line;

    const x = Math.abs((x1 + x2) / 2);
    const y = Math.abs((y1 + y2) / 2);

    return { x, y };
  }

  function getNewTriangles(
    triangle: Triangle,
    color: string,
    delay: number,
  ): Array<Triangle> {
    const { x1, y1, x2, y2, x3, y3 } = triangle;

    const point1 = getMiddlePointOfLine({ x1, y1, x2, y2 });
    const point2 = getMiddlePointOfLine({ x1, y1, x2: x3, y2: y3 });
    const point3 = getMiddlePointOfLine({ x1: x3, y1: y3, x2, y2 });

    const newTriangle1 = {
      x1: point1.x,
      y1: point1.y,
      x2: point2.x,
      y2: point2.y,
      x3: point3.x,
      y3: point3.y,
    };
    const newTriangle2 = {
      x1,
      y1,
      x2: point1.x,
      y2: point1.y,
      x3: point2.x,
      y3: point2.y,
    };
    const newTriangle3 = {
      x1: x2,
      y1: y2,
      x2: point1.x,
      y2: point1.y,
      x3: point3.x,
      y3: point3.y,
    };
    const newTriangle4 = {
      x1: x3,
      y1: y3,
      x2: point2.x,
      y2: point2.y,
      x3: point3.x,
      y3: point3.y,
    };

    // only newTriangle1 needs to be drawn, the other three forms when newTriangle1 is drawn
    setTimeout(function() {
      drawTriangle(newTriangle1, color);
    }, delay);

    return [newTriangle1, newTriangle2, newTriangle3, newTriangle4];
  }

  function drawTriangle(triangle: Triangle, color?: string) {
    const { x1, y1, x2, y2, x3, y3 } = triangle;

    ctx.strokeStyle = color || 'black';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  function drawRecursiveCentralTriangle(startingTriangle: Triangle) {
    let count = 0;
    let nextTriangles: Array<Triangle> = [startingTriangle];
    drawTriangle(startingTriangle);

    function recursiveDrawing() {
      if (count <= RECURSIVE_LIMIT) {
        const triangleCounts = Math.pow(4, count);

        setTimeout(function() {
          const color = selectColor(count);
          nextTriangles = _.flatten(
            nextTriangles.map((tri, index) => {
              const delay = TIME_OUT * index;
              return getNewTriangles(tri, color, delay);
            }),
          );

          recursiveDrawing();
          count += 1;
        }, TIME_OUT * triangleCounts);
      }
    }

    recursiveDrawing();
  }

  const outmostTriangle = {
    x1: 400,
    y1: 0,
    x2: 0,
    y2: 664,
    x3: 800,
    y3: 664,
  };
  drawRecursiveCentralTriangle(outmostTriangle);
}
