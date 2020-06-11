import React from 'react';
import '../styles/GridHeader.scss';

export default class GridHeader extends React.Component {
	render() {
		const {
			currentWord,
			foundWords,
			targetLanguage,
			totalWordsToFind,
		} = this.props;

		return (
			<div className="grid-header">
				<div className="instructions">
					<span>
						Find all <strong>{targetLanguage}</strong> translations
					</span>
					<br />
					<br />
					<span>
						Target Word: <strong className="target-word">{currentWord}</strong>
					</span>
				</div>
				<div className="progress">
					<span>
						{foundWords}/{totalWordsToFind} words found
					</span>
				</div>
			</div>
		);
	}
}
