const Grid = {
  forEach: (grid, callback) => {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        const ret = callback({ x, y, value: grid[x][y] });
        if (ret === true) return;
      }
    }
  },

  forEachNeigh: (grid, [x,y], callback) => {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (x + dx >= 0 && grid[x + dx] !== undefined && y + dy >= 0) {
          const ret = callback({
            x: x + dx,
            y: y + dy,
            value: grid[x + dx][y + dy],
          });
          if (ret === true) return;
        }
      }
    }
  },
};

module.exports = { Grid };
