import React from 'react';
import '../styles/GridHeader.scss';

export default function GridHeader(props) {
	return (
		<div className="grid-header">
			<div className="instructions">
				<span>
					Find all <strong>{props.targetLanguage}</strong> translations
				</span>
				<br />
				<br />
				<span>
					Target Word:{' '}
					<strong className="target-word">{props.currentWord}</strong>
				</span>
			</div>
			<div className="progress">
				<span>
					{props.foundWords}/{props.totalWordsToFind} words found
				</span>
			</div>
		</div>
	);
}
