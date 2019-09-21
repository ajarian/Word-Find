import React from "react";
import WordGrid from "./WordGrid";

export default class Layout extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      currentWordIndex: 0,
      showFinishedMessage: false,
      wordObjects: []
    };
  }

  render() {
    return (
      <div>
        <span>Let's Translate</span>
        <WordGrid />
      </div>
    );
  }
}
