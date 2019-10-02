import React from "react";
import "../styles/WordGrid.scss";

const languages = {
  es: "Spanish"
};

export default class WordGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWordData: null,
      characterGrid: null,
      gridComplete: false,
      successfulFinds: [],
      selectedCharacterCoords: {},
      startPoint: null,
      wordLocations: {}
    };

    this.buildCharacterGrid = this.buildCharacterGrid.bind(this);
    this.determineCellStyle = this.determineCellStyle.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellMove = this.onCellMove.bind(this);
    this.onCellRelease = this.onCellRelease.bind(this);
    this.onGridComplete = this.onGridComplete.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentWordData !== prevProps.currentWordData) {
      this.setState(
        {
          currentWordData: this.props.currentWordData,
          wordLocations: this.props.currentWordData.wordLocations
        },
        () => this.buildCharacterGrid()
      );
    }
  }

  buildCharacterGrid() {
    const { currentWordData } = this.state;

    if (currentWordData !== undefined) {
      let characterGrid = currentWordData.characterGrid.map((row, index) => {
        let yPosition = index;

        // create a table row for each row of characters
        return (
          <tr className="grid-row" key={index}>
            {row.map((character, index) => {
              // create a cell for each character in the row
              const cellPosition = { x: index, y: yPosition };
              let classnames = this.determineCellStyle(cellPosition);
              return (
                <td
                  className={classnames}
                  key={index}
                  x-value={index}
                  onMouseDown={() => this.onCellClick(cellPosition)}
                  onMouseUp={this.onCellRelease}
                  onMouseOver={() => this.onCellMove(cellPosition)}
                >
                  {character}
                </td>
              );
            })}
          </tr>
        );
      });
      this.setState({ characterGrid });
    }
  }

  determineCellStyle(position) {
    const { selectedCharacterCoords, startPoint, successfulFinds } = this.state;
    let classnames = "grid-cell";

    if (successfulFinds.length > 0) {
      successfulFinds.forEach(wordCoords => {
        if (wordCoords[position.y] && wordCoords[position.y][position.x]) {
          classnames += " complete";
        }
      });
    }

    // Highlighted class is applied only if points have been selected
    if (
      startPoint !== null &&
      selectedCharacterCoords[position.y] &&
      selectedCharacterCoords[position.y][position.x]
    ) {
      classnames += " highlighted";
    }

    return classnames;
  }

  onCellClick(position) {
    // When a cell has been clicked highlighting should
    // occur until release
    let { selectedCharacterCoords } = this.state;
    selectedCharacterCoords[position.y] = {};
    selectedCharacterCoords[position.y][position.x] = true;

    this.setState(
      {
        startPoint: position
      },
      () => this.buildCharacterGrid()
    );
  }

  onCellMove(endPoint) {
    // When mouse is moved away from starting point
    // determine all points that should be highlighted
    const { startPoint } = this.state;
    let {
        gridComplete,
        selectedCharacterCoords,
        successfulFinds,
        wordLocations
      } = this.state,
      possibleWordCoords = "";

    // Only modify selectedCharacterCoords if a starting point has been recorded
    if (startPoint !== null) {
      selectedCharacterCoords = {};

      // Compare starting point to endPoint to determine all points between
      // Equal y values, end point is horizontal
      if (startPoint.y === endPoint.y) {
        const leftValue = startPoint.x < endPoint.x ? startPoint.x : endPoint.x,
          rightValue = leftValue === startPoint.x ? endPoint.x : startPoint.x;
        selectedCharacterCoords[endPoint.y] = {};

        for (let i = leftValue; i <= rightValue; i++) {
          selectedCharacterCoords[endPoint.y][i] = true;
          possibleWordCoords +=
            possibleWordCoords === ''
              ? `${i},${endPoint.y}`
              : `,${i},${endPoint.y}`; // Xn,Yn
        }
      }
      // Equal x values, end point is vertical
      else if (startPoint.x === endPoint.x) {
        const topValue = startPoint.y < endPoint.y ? startPoint.y : endPoint.y,
          bottomValue = topValue === startPoint.y ? endPoint.y : startPoint.y;

        for (let i = topValue; i <= bottomValue; i++) {
          selectedCharacterCoords[i] = {};
          selectedCharacterCoords[i][endPoint.x] = true;
          possibleWordCoords +=
            possibleWordCoords === ''
              ? `${endPoint.x},${i}`
              : `,${endPoint.x},${i}`;
        }
      } else {
        let yDiff = endPoint.y - startPoint.y,
          xDiff = endPoint.x - startPoint.x;

        // Diagonal points have equivalent differences between x & y values
        if (Math.abs(yDiff) === Math.abs(xDiff)) {
          const topValue = yDiff > 0 ? startPoint : endPoint,
            valuesRightward = (yDiff < 0 && xDiff < 0) || (yDiff > 0 && xDiff > 0);

          // Loop captures diagonal values starting at topmost cell
          for (let i = 0; i <= Math.abs(yDiff); i++) {
            const yValue = topValue.y + i,
              xValue = valuesRightward ? topValue.x + i : topValue.x - i;
            selectedCharacterCoords[yValue] = {};
            selectedCharacterCoords[yValue][xValue] = true;
            possibleWordCoords +=
              possibleWordCoords === ''
                ? `${xValue},${yValue}`
                : `,${xValue},${yValue}`;
          }
        }
      }

      if (wordLocations[possibleWordCoords]) {
        successfulFinds.push(selectedCharacterCoords);
        gridComplete =
          successfulFinds.length ===
          Object.getOwnPropertyNames(wordLocations).length;

        this.setState({ gridComplete, successfulFinds }, () =>
          this.buildCharacterGrid()
        );
      } else {
        this.setState(
          {
            selectedCharacterCoords
          },
          () => this.buildCharacterGrid()
        );
      }
    }
  }

  onCellRelease() {
    // On mouse up, highlighting is stopped and current
    // selection is cleared
    this.setState(
      {
        selectedCharacterCoords: {},
        startPoint: null
      },
      () => this.buildCharacterGrid()
    );
  }

  onGridComplete() {
    this.props.onGridComplete();
  }

  render() {
    const { characterGrid, currentWordData, gridComplete } = this.state;

    return (
      <div className="grid-section">
        {currentWordData && (
          <div className="grid-heading">
            <span>Target Word: {currentWordData.word}</span>
            <br />
            <span>
              Find all {languages[currentWordData.targetLanguage]} translations
            </span>
          </div>
        )}
        {characterGrid && (
          <table className="character-grid">
            <tbody>{characterGrid}</tbody>
          </table>
        )}
        {gridComplete && (
          <div className="button-area">
            <button className="continue-button" onClick={this.onGridComplete}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
}
