import React from 'react';

import '../styles/Layout.scss';
import gameData from '../resources/gamedata.json';
import WordGrid from './WordGrid';
import WordReferenceModal from './WordReferenceModal';

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
		this.onGameRestart = this.onGameRestart.bind(this);
		this.advance = this.advance.bind(this);
		this.resetGridWords = this.resetGridWords.bind(this);
	}

	componentDidMount() {
		this.getWordData();
	}

	getWordData() {
		let wordObjects = [];
		gameData.forEach((wordObject) => wordObjects.push(wordObject));

		this.setState({
			wordObjects: wordObjects
		});
	}

	/** Reset state to allow for another round */
	onGameRestart() {
		this.setState({
			allGridsComplete: false,
		}, () => setTimeout(this.resetGridWords(), 0));
	}

	/** Feed grid the first word object */
	resetGridWords() {
		this.setState({
			currentWordIndex: 0
		});
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

	// remove
	advance() {
		this.setState({
			allGridsComplete: true,
		});
	}

	
	render() {
		const { allGridsComplete, wordObjects, currentWordIndex } = this.state;
		const userHasSolvedGrid = currentWordIndex > 0;
		const currentGridData = wordObjects[currentWordIndex];

		return (
			<div className="layout">
				<h2>Let's Translate!</h2>
				<button onClick={this.advance}>End Game</button>
				{!allGridsComplete && (
					<div>
						<WordGrid
						currentWordData={currentGridData}
						onGridComplete={this.onGridComplete}
						/>
					</div>
				)}
				{allGridsComplete && (
					<div className="complete-section">
						<h2 className="finished-text">
							Congratulations! You're an expert linguist.
						</h2>
						<button onClick={this.onGameRestart}>Restart Game</button>
					</div>
				)}
				{userHasSolvedGrid && (
					<WordReferenceModal
						currentWordIndex={currentWordIndex}
						wordObjects={wordObjects}
					/>
				)}
			</div>
		);
	}
}
