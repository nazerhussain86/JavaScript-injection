(async () => {
  const start = path[path.length - 1];
  const target = end;

  const queue = [[start.x, start.y]];
  const visited = new Set([`${start.x},${start.y}`]);
  const parent = new Map();

  const dirs = [
    ["up", 0, -1, 0],
    ["down", 0, 1, 2],
    ["left", -1, 0, 3],
    ["right", 1, 0, 1]
  ];

  while (queue.length) {
    const [x, y] = queue.shift();

    if (x === target.x && y === target.y) break;

    for (const [direction, dx, dy, wall] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx < 0 || nx >= width ||
        ny < 0 || ny >= height
      ) continue;

      // 0 = wall, non-zero = opening
      if (cells[y][x][wall] === 0) continue;

      const key = `${nx},${ny}`;

      if (visited.has(key)) continue;

      visited.add(key);
      parent.set(key, {
        x,
        y,
        direction
      });

      queue.push([nx, ny]);
    }
  }

  // Reconstruct path
  const moves = [];
  let current = `${target.x},${target.y}`;

  while (current !== `${start.x},${start.y}`) {
    const p = parent.get(current);

    if (!p) {
      console.error("No path found.");
      return;
    }

    moves.push(p.direction);
    current = `${p.x},${p.y}`;
  }

  moves.reverse();

  console.log(`Found solution: ${moves.length} moves`);

  // Execute moves
  for (const move of moves) {
    tryMove(move);
    await new Promise(r => setTimeout(r, 20));
  }

  console.log("Maze completed.");
})();
