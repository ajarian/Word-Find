import React from "react";

import "../styles/Layout.scss"; 
import WordGrid from "./WordGrid";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentWordIndex: 0,
      showFinishedMessage: false,
      wordObjects: []
    };

    this.requestWordData = this.requestWordData.bind(this);
  }

  componentDidMount() {
    this.requestWordData();
  }

  requestWordData() {
    // fetch(url)
    //   .then(res => res.body)
    //   .then(body => {
    //     const reader = body.getReader();
    //     reader.read().then(()
    //   });
    const object = {
      sourceLanguage: "en",
      word: "man",
      characterGrid: [
        ["i", "q", "\u00ed", "l", "n", "n", "m", "\u00f3"],
        ["f", "t", "v", "\u00f1", "b", "m", "h", "a"],
        ["h", "j", "\u00e9", "t", "e", "t", "o", "z"],
        ["x", "\u00e1", "o", "i", "e", "\u00f1", "m", "\u00e9"],
        ["q", "\u00e9", "i", "\u00f3", "q", "s", "b", "s"],
        ["c", "u", "m", "y", "v", "l", "r", "x"],
        ["\u00fc", "\u00ed", "\u00f3", "m", "o", "t", "e", "k"],
        ["a", "g", "r", "n", "n", "\u00f3", "s", "m"]
      ],
      wordLocations: { "6,1,6,2,6,3,6,4,6,5,6,6": "hombre" },
      targetLanguage: "es"
    };

    const { wordObjects } = this.state;
    wordObjects.push(object);

    this.setState({
      wordObjects: wordObjects
    });
  }

  render() {
    const { wordObjects, currentWordIndex } = this.state;

    return (
      <div className="layout">
        <h2>Let's Translate</h2>
        <WordGrid currentWordData={wordObjects[currentWordIndex]} />
      </div>
    );
  }
}
