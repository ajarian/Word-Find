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
      successfulFinds: [],
      selectedCharacterCoords: {},
      startPoint: null,
      wordLocations: {}
    };

    this.buildCharacterGrid = this.buildCharacterGrid.bind(this);
    this.isPositionSelected = this.isPositionSelected.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellMove = this.onCellMove.bind(this);
    this.onCellRelease = this.onCellRelease.bind(this);
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
              let classnames = this.isPositionSelected(cellPosition);

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

  isPositionSelected(position) {
    const { selectedCharacterCoords, startPoint, successfulFinds } = this.state;

    // If start point is null, nothing has been selected
    if (startPoint !== null) {
      if (successfulFinds.length > 0) {
        successfulFinds.forEach(wordCoords => {
          return wordCoords[position.y] && wordCoords[position.y][position.x]
            ? "grid-cell highlighted complete"
            : "grid-cell";
        });
      } else {
        if (
          selectedCharacterCoords[position.y] &&
          selectedCharacterCoords[position.y][position.x]
        ) {
          return "grid-cell highlighted";
        } else if (startPoint.y === position.y && startPoint.x === position.x) {
          return "grid-cell highlighted";
        } else {
          return "grid-cell";
        }
      }
    }
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

  onCellRelease() {
    // On mouse up, highlighting is stopped and current
    // word position is cleared
    this.setState(
      {
        selectedCharacterCoords: {},
        startPoint: null
      },
      () => this.buildCharacterGrid()
    );

    console.log("released", this.state);
  }

  onCellMove(endPoint) {
    // When mouse is moved away from starting point
    // determine all points that should be highlighted
    const { startPoint } = this.state;
    let { selectedCharacterCoords, successfulFinds } = this.state,
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
            possibleWordCoords.length === 0
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
            possibleWordCoords.length === 0
              ? `${endPoint.x},${i}`
              : `,${endPoint.x},${i}`;
        }
      } else {
        // Only add points if they're diagonal
        let yDiff = endPoint.y - startPoint.y,
            xDiff = endPoint.x - startPoint.x;
        
        // Diagonal points have equivalent differences between x & y values
        if (Math.abs(yDiff) === Math.abs(xDiff)) {
          const topValue = yDiff > 0 ? startPoint.y : endPoint.y,
                bottomValue = topValue === startPoint.y ? endPoint.y : startPoint.y,
                rightValue = xDiff > 0 ? endPoint.x : startPoint.x,
                leftValue = xDiff === endPoint.x ? startPoint.x : endPoint.x;
          
          for (let i = topValue; i <= bottomValue; i++) {
            selectedCharacterCoords[i] = {};
            for (let j = leftValue; j <= rightValue; j++) {
              selectedCharacterCoords[i][j] = true;
              
               possibleWordCoords +=
                  possibleWordCoords.length === 0
                    ? `${j},${i}`
                    : `,${j},${i}`;
            }
          }
        }
      }

      if (this.state.wordLocations[possibleWordCoords]) {
        console.log("found the word!");
        successfulFinds.push(selectedCharacterCoords);

        this.setState({ successfulFinds });
      }

      this.setState(
        {
          selectedCharacterCoords
        },
        () => this.buildCharacterGrid()
      );
    }

    // see if all coords create the target word
  }

  render() {
    const { characterGrid, currentWordData } = this.state;

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
      </div>
    );
  }
}
