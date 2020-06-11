import React from 'react';

import gameData from '../resources/gamedata.json';
import '../styles/Layout.scss';
import WordGrid from './WordGrid';

export default class Layout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			allGridsComplete: false,
			currentWordIndex: 0,
			wordObjects: []
		};

		this.onGridComplete = this.onGridComplete.bind(this);
		this.requestWordData = this.requestWordData.bind(this);
	}

	componentDidMount() {
		this.requestWordData();
	}

	onGridComplete() {
		let { allGridsComplete, currentWordIndex, wordObjects } = this.state;

		if (currentWordIndex + 1 < wordObjects.length) {
			currentWordIndex += 1;
		} else {
			allGridsComplete = true;
		}

		this.setState({ allGridsComplete, currentWordIndex });
	}

	requestWordData() {
		let { wordObjects } = this.state;
		gameData.forEach((wordObject) => wordObjects.push(wordObject));

		this.setState({
			wordObjects: wordObjects
		});
	}

	render() {
		const { allGridsComplete, wordObjects, currentWordIndex } = this.state;

		return (
			<div className="layout">
				<h2>Let's Translate!</h2>
				{!allGridsComplete && (
					<WordGrid
						currentWordData={wordObjects[currentWordIndex]}
						onGridComplete={this.onGridComplete}
					/>
				)}
				{allGridsComplete && (
					<h2 className="finished-text">
						Congratulations! You're an expert linguist.
					</h2>
				)}
			</div>
		);
	}
}
