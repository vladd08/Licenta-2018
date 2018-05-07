export class ControlMatrix {
  controlValueMatrix: any[][] = [[]];
  constructor(public rows?: number, public cols?: number) {
    for (let i = 0; i < rows; i++) {
      this.controlValueMatrix[i] = [];
      for (let j = 0; j < cols; j++) {
        this.controlValueMatrix[i][j] = '0:00';
      }
    }
  }
}
