import React from 'react';
import GridHeader from './GridHeader';
import '../styles/WordGrid.scss';

const languages = {
	es: 'Spanish',
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
		this.onCellClick = this.onCellClick.bind(this);
		this.onCellMove = this.onCellMove.bind(this);
		this.onCellRelease = this.onCellRelease.bind(this);
		this.onGridComplete = this.onGridComplete.bind(this);
		this.onSuccessfulFind = this.onSuccessfulFind.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.currentWordData !== prevProps.currentWordData) {
			const wordLocations = this.props.currentWordData.word_locations,
				totalWordsToFind = Object.getOwnPropertyNames(wordLocations).length;
			this.setState(
				{
					currentWordData: this.props.currentWordData,
					totalWordsToFind,
					wordLocations,
				},
				() => this.buildCharacterGrid()
			);
		}
	}

	buildCharacterGrid() {
		const { currentWordData } = this.state;

		if (currentWordData !== undefined) {
			let characterGrid = currentWordData.character_grid.map((row, index) => {
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
									<div className="character-container">
										{character.toUpperCase()}
									</div>
								</td>
							);
						})}
					</tr>
				);
			});
			this.setState({ characterGrid });
		}
	}

	/** Ensure we don't add duplicate objects to succesfulFinds array */ 
	containsDuplicateEntry(successfulFinds, locationString) {
		let containsDuplicate = false;

		successfulFinds.forEach((object) => {
			if (object.locationString === locationString) {
				containsDuplicate = true;
			}
		});

		return containsDuplicate;
	}

  /** Used to mark completed or actively highlighted cells */
	determineCellStyle(position) {
		const { selectedCharacterCoords, startPoint, successfulFinds } = this.state;
		let classnames = 'grid-cell';

		// Successful finds array holds objects that contain a character lookup
		if (successfulFinds.length > 0) {
			successfulFinds.forEach((find) => {
				const characterDictionary = find.selectedCharacterCoords;
				if (
					characterDictionary[position.y] &&
					characterDictionary[position.y][position.x]
				) {
					classnames += ' complete';
				}
			});
		}

		// Highlighted class is applied only if points have been selected
		if (
			startPoint !== null &&
			selectedCharacterCoords[position.y] &&
			selectedCharacterCoords[position.y][position.x]
		) {
			classnames += ' highlighted';
		}

		return classnames;
	}

	determineDiagonalSelections(startPoint, endPoint, selectedCharacterCoords) {
		const yDiff = endPoint.y - startPoint.y,
			xDiff = endPoint.x - startPoint.x;
		let locationString = '';

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
				locationString +=
					locationString === ''
						? `${xValue},${yValue}`
						: `,${xValue},${yValue}`;
			}
		}

		return locationString;
	}

	determineHorizontalSelections(startPoint, endPoint, selectedCharacterCoords) {
		const leftValue = startPoint.x < endPoint.x ? startPoint.x : endPoint.x,
			rightValue = leftValue === startPoint.x ? endPoint.x : startPoint.x;
		let locationString = '';
		selectedCharacterCoords[endPoint.y] = {};

		for (let i = leftValue; i <= rightValue; i++) {
			selectedCharacterCoords[endPoint.y][i] = true;
			locationString +=
				locationString === '' ? `${i},${endPoint.y}` : `,${i},${endPoint.y}`; // Xn,Yn
		}

		return locationString;
	}

	determineVerticalSelections(startPoint, endPoint, selectedCharacterCoords) {
		const topValue = startPoint.y < endPoint.y ? startPoint.y : endPoint.y,
			bottomValue = topValue === startPoint.y ? endPoint.y : startPoint.y;
		let locationString = '';

		for (let i = topValue; i <= bottomValue; i++) {
			selectedCharacterCoords[i] = {};
			selectedCharacterCoords[i][endPoint.x] = true;
			locationString +=
				locationString === '' ? `${endPoint.x},${i}` : `,${endPoint.x},${i}`; // Xn,Yn
		}

		return locationString;
	}

	/** Handles cell selection, highlighting occurs until release */
	onCellClick(position) {
		let { selectedCharacterCoords } = this.state;
		selectedCharacterCoords[position.y] = {};
		selectedCharacterCoords[position.y][position.x] = true;

		this.setState(
			{
				selectedCharacterCoords,
				startPoint: position,
			},
			() => this.buildCharacterGrid()
		);
	}

	/** Handles mouse movement and makes updates if user has selected cells */
	onCellMove(endPoint) {
		const { startPoint } = this.state;
		let { gridComplete, wordLocations } = this.state,
			locationString = '';

		// Only store new selected character coordinates if a starting point has been recorded
		if (startPoint !== null) {
			let selectedCharacterCoords = {};

			// Equivalent y values, end point is horizontal
			if (startPoint.y === endPoint.y) {
				locationString = this.determineHorizontalSelections(
					startPoint,
					endPoint,
					selectedCharacterCoords
				);
			}
			// Equivalent x values, end point is vertical
			else if (startPoint.x === endPoint.x) {
				locationString = this.determineVerticalSelections(
					startPoint,
					endPoint,
					selectedCharacterCoords
				);
			} else {
				locationString = this.determineDiagonalSelections(
					startPoint,
					endPoint,
					selectedCharacterCoords
				);
			}

			// If the resultant location string matches a word location
			// pass data to success handler, otherwise rebuild the grid
			if (wordLocations[locationString] && !gridComplete) {
				this.onSuccessfulFind(selectedCharacterCoords, locationString);
			} else {
				this.setState(
					{
						selectedCharacterCoords,
					},
					() => this.buildCharacterGrid()
				);
			}
		}
	}

	/* Clear highlighting and selection on mouse up */
	onCellRelease() {
		this.setState(
			{
				selectedCharacterCoords: {},
				startPoint: null
			},
			() => this.buildCharacterGrid()
		);
	}

	onGridComplete() {
		this.setState(
			{
				gridComplete: false,
				successfulFinds: []
			},
			this.props.onGridComplete()
		);
	}

	onSuccessfulFind(selectedCharacterCoords, locationString) {
		let { successfulFinds, wordLocations } = this.state,
			gridComplete = false;
		const wordLocationStrings = Object.getOwnPropertyNames(wordLocations);

		// Update array if word hasn't already been located
		if (!this.containsDuplicateEntry(successfulFinds, locationString)) {
			successfulFinds.push({
				selectedCharacterCoords,
				locationString
			});
		}

		const foundLocationStrings = successfulFinds.map(
			(find) => find.locationString
		);

		// Grid is solved if every user-found location string matches
		// the game data's set of location strings 
		if (successfulFinds.length === wordLocationStrings.length) {
			gridComplete = true;

			for (let string of wordLocationStrings) {
				if (!foundLocationStrings.includes(string)) {
					gridComplete = false;
				}
			}
		}

		this.setState({ gridComplete, successfulFinds }, () =>
			this.buildCharacterGrid()
		);
	}

	render() {
		const {
			characterGrid,
			currentWordData,
			gridComplete,
			successfulFinds,
			totalWordsToFind
		} = this.state;

		return (
			<div className="grid-section">
				{currentWordData && (
					<GridHeader
						currentWord={currentWordData.word}
						foundWords={successfulFinds.length}
						totalWordsToFind={totalWordsToFind}
						targetLanguage={languages[currentWordData.target_language]}
					/>
				)}

				{characterGrid && (
					<div className="grid-container">
						<table className="character-grid">
							<tbody>{characterGrid}</tbody>
						</table>
					</div>
				)}

				{gridComplete && (
					<div className="button-area">
						<span role="img" aria-label="party-popper">
							&#x1F389;
						</span>
						<button className="continue-button" onClick={this.onGridComplete}>
							Next
						</button>
						<span role="img" aria-label="party-popper">
							&#x1F389;
						</span>
					</div>
				)}
			</div>
		);
	}
}
