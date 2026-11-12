export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export type BoardSquare = ChessPiece | null;
export type ChessBoard = BoardSquare[][]; // 8x8, row 0 is rank 8 (Black side), row 7 is rank 1 (White side)

export interface ChessMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: ChessPiece;
  captured?: ChessPiece | null;
  notation: string;
}

export function createInitialBoard(): ChessBoard {
  const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  // Black pieces (row 0 and 1)
  const backRowOrder: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRowOrder[c], color: 'b' };
    board[1][c] = { type: 'p', color: 'b' };
  }

  // White pieces (row 7 and 6)
  for (let c = 0; c < 8; c++) {
    board[7][c] = { type: backRowOrder[c], color: 'w' };
    board[6][c] = { type: 'p', color: 'w' };
  }

  return board;
}

export function isWithinBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function getLegalMoves(
  board: ChessBoard,
  fromRow: number,
  fromCol: number
): Array<{ row: number; col: number }> {
  const piece = board[fromRow][fromCol];
  if (!piece) return [];

  const moves: Array<{ row: number; col: number }> = [];
  const color = piece.color;
  const enemyColor: PieceColor = color === 'w' ? 'b' : 'w';

  // Directions
  const orthogonal = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  const diagonal = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];
  const knightJumps = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  if (piece.type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;

    // 1 step forward
    if (isWithinBoard(fromRow + dir, fromCol) && !board[fromRow + dir][fromCol]) {
      moves.push({ row: fromRow + dir, col: fromCol });

      // 2 steps forward from start
      if (fromRow === startRow && !board[fromRow + 2 * dir][fromCol]) {
        moves.push({ row: fromRow + 2 * dir, col: fromCol });
      }
    }

    // Diagonal captures
    [-1, 1].forEach(dCol => {
      const targetRow = fromRow + dir;
      const targetCol = fromCol + dCol;
      if (isWithinBoard(targetRow, targetCol)) {
        const targetPiece = board[targetRow][targetCol];
        if (targetPiece && targetPiece.color === enemyColor) {
          moves.push({ row: targetRow, col: targetCol });
        }
      }
    });
  } else if (piece.type === 'n') {
    knightJumps.forEach(([dr, dc]) => {
      const r = fromRow + dr;
      const c = fromCol + dc;
      if (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target || target.color === enemyColor) {
          moves.push({ row: r, col: c });
        }
      }
    });
  } else if (piece.type === 'b' || piece.type === 'r' || piece.type === 'q') {
    const dirs = piece.type === 'b' ? diagonal : piece.type === 'r' ? orthogonal : [...orthogonal, ...diagonal];
    dirs.forEach(([dr, dc]) => {
      let r = fromRow + dr;
      let c = fromCol + dc;
      while (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c });
        } else {
          if (target.color === enemyColor) {
            moves.push({ row: r, col: c });
          }
          break; // Obstacle encountered
        }
        r += dr;
        c += dc;
      }
    });
  } else if (piece.type === 'k') {
    [...orthogonal, ...diagonal].forEach(([dr, dc]) => {
      const r = fromRow + dr;
      const c = fromCol + dc;
      if (isWithinBoard(r, c)) {
        const target = board[r][c];
        if (!target || target.color === enemyColor) {
          moves.push({ row: r, col: c });
        }
      }
    });
  }

  return moves;
}

export function toAlgebraic(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[col]}${8 - row}`;
}

export function formatMoveNotation(
  piece: ChessPiece,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  isCapture: boolean
): string {
  const dest = toAlgebraic(toRow, toCol);
  if (piece.type === 'p') {
    if (isCapture) {
      const fileFrom = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][fromCol];
      return `${fileFrom}x${dest}`;
    }
    return dest;
  }
  const symbol = piece.type.toUpperCase();
  return `${symbol}${isCapture ? 'x' : ''}${dest}`;
}

// Find king position
export function findKing(board: ChessBoard, color: PieceColor): { row: number; col: number } | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k' && p.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

// Check if King is under attack
export function isKingInCheck(board: ChessBoard, color: PieceColor): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const enemyColor: PieceColor = color === 'w' ? 'b' : 'w';

  // Check all enemy pieces to see if any can capture the king
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === enemyColor) {
        const legal = getLegalMoves(board, r, c);
        if (legal.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Piece values for simple bot heuristic
export const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Simple heuristic bot move generator
export function getBestBotMove(
  board: ChessBoard,
  color: PieceColor = 'b',
  difficulty: 'normal' | 'grandmaster' = 'normal'
): { fromRow: number; fromCol: number; toRow: number; toCol: number } | null {
  const candidateMoves: Array<{
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
    score: number;
  }> = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const valid = getLegalMoves(board, r, c);
        valid.forEach(dest => {
          let score = 0;
          const target = board[dest.row][dest.col];

          // Reward captures
          if (target) {
            score += PIECE_VALUES[target.type] * 2 - PIECE_VALUES[piece.type] * 0.2;
          }

          // Center control bonus
          const centerDist = Math.abs(3.5 - dest.row) + Math.abs(3.5 - dest.col);
          score += (7 - centerDist) * 10;

          // Advancement bonus for pawns
          if (piece.type === 'p') {
            score += (color === 'b' ? dest.row : 7 - dest.row) * 15;
          }

          // Randomize slightly for human-like play
          score += Math.random() * 20;

          candidateMoves.push({
            fromRow: r,
            fromCol: c,
            toRow: dest.row,
            toCol: dest.col,
            score
          });
        });
      }
    }
  }

  if (candidateMoves.length === 0) return null;

  candidateMoves.sort((a, b) => b.score - a.score);
  return candidateMoves[0];
}
