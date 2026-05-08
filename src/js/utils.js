/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const isTopRow = index < boardSize;
  const isBottomRow = index >= boardSize * (boardSize - 1);
  const isLeftColumn = index % boardSize === 0;
  const isRightColumn = index % boardSize === boardSize - 1;

  if (isTopRow && isLeftColumn) return 'top-left';
  if (isTopRow && isRightColumn) return 'top-right';
  if (isTopRow) return 'top';
  if (isBottomRow && isLeftColumn) return 'bottom-left';
  if (isBottomRow && isRightColumn) return 'bottom-right';
  if (isBottomRow) return 'bottom';
  if (isLeftColumn) return 'left';
  if (isRightColumn) return 'right';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}

// Функция для расчета дистанции между двумя клетками
export function calculateDistance(pos1, pos2, boardSize) {
  const row1 = Math.floor(pos1 / boardSize);
  const col1 = pos1 % boardSize;
  const row2 = Math.floor(pos2 / boardSize);
  const col2 = pos2 % boardSize;

  return Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));
}

// Функция для проверки движения по прямой или диагонали
export function isStraightLine(pos1, pos2, boardSize) {
  const row1 = Math.floor(pos1 / boardSize);
  const col1 = pos1 % boardSize;
  const row2 = Math.floor(pos2 / boardSize);
  const col2 = pos2 % boardSize;

  return row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2);
}

// Функция для получения всех клеток на линии между двумя позициями
export function getLineCells(pos1, pos2, boardSize) {
  const row1 = Math.floor(pos1 / boardSize);
  const col1 = pos1 % boardSize;
  const row2 = Math.floor(pos2 / boardSize);
  const col2 = pos2 % boardSize;

  const cells = [];

  if (row1 === row2) {
    // Горизонталь
    const step = col1 < col2 ? 1 : -1;
    for (let col = col1 + step; col !== col2; col += step) {
      cells.push(row1 * boardSize + col);
    }
  } else if (col1 === col2) {
    // Вертикаль
    const step = row1 < row2 ? 1 : -1;
    for (let row = row1 + step; row !== row2; row += step) {
      cells.push(row * boardSize + col1);
    }
  } else if (Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
    // Диагональ
    const rowStep = row1 < row2 ? 1 : -1;
    const colStep = col1 < col2 ? 1 : -1;
    let row = row1 + rowStep;
    let col = col1 + colStep;

    while (row !== row2 && col !== col2) {
      cells.push(row * boardSize + col);
      row += rowStep;
      col += colStep;
    }
  }

  return cells;
}