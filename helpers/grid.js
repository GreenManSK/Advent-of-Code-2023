const Grid = {
  forEach: (grid, callback) => {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        const ret = callback({ x, y, value: grid[x][y] });
        if (ret === true) return;
      }
    }
  },

  forEachNeigh: (grid, [x, y], callback) => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = +x + dx;
        const ny = +y + dy;
        if (Grid.isInGrid(grid, [nx, ny]) && (nx != x || ny != y)) {
          const ret = callback({
            x: nx,
            y: ny,
            value: grid[nx][ny],
          });
          if (ret === true) return;
        }
      }
    }
  },

  forEachNeighNoDiagonal: (grid, [x, y], callback) => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = +x + dx;
        const ny = +y + dy;
        if (
          (dx === 0 || dy === 0) &&
          Grid.isInGrid(grid, [nx, ny]) &&
          (nx != x || ny != y)
        ) {
          const ret = callback({
            x: nx,
            y: ny,
            value: grid[nx][ny],
          });
          if (ret === true) return;
        }
      }
    }
  },

  isInGrid: (grid, [x, y]) => {
    return grid[x] && grid[x][y] !== undefined;
  },
};

module.exports = { Grid };
