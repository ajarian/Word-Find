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
        return (
          <tr
            className="grid-row"
            key={index}
            y-value={index}
            onMouseEnter={e => console.log(e.currentTarget)}
          >
            {row.map((character, index) => {
              return (
                <td
                  className="grid-cell"
                  key={index}
                  x-value={index}
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
