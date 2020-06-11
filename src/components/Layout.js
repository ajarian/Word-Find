import React from 'react';

import '../styles/Layout.scss';
import gameData from '../resources/gamedata.json';
import WordGrid from './WordGrid';
// import WordReferenceModal from './WordReferenceModal';

export default class Layout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			allGridsComplete: false,
			currentWordIndex: 0,
			wordObjects: []
		};

		this.getWordData = this.getWordData.bind(this);
		this.onGridComplete = this.onGridComplete.bind(this);
	}

	componentDidMount() {
		this.getWordData();
	}

	/** Advance user to next grid or display finished message */
	onGridComplete() {
		let { allGridsComplete, currentWordIndex, wordObjects } = this.state;

		if (currentWordIndex + 1 < wordObjects.length) {
			currentWordIndex += 1;
		} else {
			allGridsComplete = true;
		}

		this.setState({ allGridsComplete, currentWordIndex });
	}

	getWordData() {
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
