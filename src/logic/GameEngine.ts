/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Player = 'X' | 'O';
export type BoardState = (Player | null)[];

export class GameEngine {
  private board: BoardState;
  private currentPlayer: Player;
  private winner: Player | 'Draw' | null;
  private winningLine: number[] | null;

  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.winningLine = null;
  }

  public getBoard(): BoardState {
    return [...this.board];
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  public getWinner(): Player | 'Draw' | null {
    return this.winner;
  }

  public getWinningLine(): number[] | null {
    return this.winningLine;
  }

  public makeMove(index: number): boolean {
    if (this.board[index] !== null || this.winner !== null) {
      return false;
    }

    this.board[index] = this.currentPlayer;
    this.checkGameState();

    if (this.winner === null) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return true;
  }

  public reset(): void {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.winningLine = null;
  }

  private checkGameState(): void {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a] as Player;
        this.winningLine = pattern;
        return;
      }
    }

    if (!this.board.includes(null)) {
      this.winner = 'Draw';
    }
  }
}
