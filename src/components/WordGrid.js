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
      highlightedWord: "",
      characterGrid: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentWordData !== prevProps.currentWordData) {
      this.setState(
        {
          currentWordData: this.props.currentWordData
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
        return (
          <tr
            className="grid-row"
            key={index}
          >
            {row.map((character, index) => {
              return (
                <td
                  className="grid-cell"
                  key={index}
                  x-value={index}
                  onMouseDown={() => this.onCellClick({x: index, y: yPosition})}
                  onMouseUp={this.onCellRelease}
                  onMouseOver={e => console.log(e.target)}
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

  onCellClick(positionObject) {
    console.log(positionObject);
    // When a cell has been clicked highlighting should
    // occur until release
    this.setState({ highlightingEnabled: true });
  }

  onCellRelease() {
    // On mouse up, highlighting is stopped and current
    // word position is cleared
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
