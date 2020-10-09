import React from 'react';

import Modal from '@material-ui/core/Modal';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		position: 'absolute',
		width: 400,
		backgroundColor: 'white',
		border: '2px solid #000',
		padding: 20,
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

export default class WordReferenceModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentWordIndex: null,
			isModalOpen: false,
			modalBody: null,
			wordObjects: null
		};

		this.createModalBody = this.createModalBody.bind(this);
		this.modalClosed = this.modalClosed.bind(this);
		this.openModal = this.openModal.bind(this);
	}

	componentDidMount() {
		this.setState(
			{
				currentWordIndex: this.props.currentWordIndex,
				wordObjects: this.props.wordObjects
			},
			() => this.createModalBody()
		);
	}

	componentDidUpdate(prevProps) {
		if (this.props.currentWordIndex !== prevProps.currentWordIndex) {
			this.setState(
				{
					currentWordIndex: this.props.currentWordIndex
				},
				() => {
					this.createModalBody();
				}
			);
		}
	}

	createModalBody() {
		const { currentWordIndex, wordObjects } = this.state;
		const modalStyles = getModalStyle();

		let foundWordObjects = [],
			translatedWordElements = [];

		for (let i = 0; i < currentWordIndex; i++) {
			foundWordObjects.push(wordObjects[i]);
		}

		foundWordObjects.forEach((wordObject) => {
			const translatedWords = Object.values(wordObject.word_locations);
			translatedWordElements.push(
				<li key={wordObject.word}>
					The Spanish translation of <i>{wordObject.word}</i> is{' '}
					<a href={this.createUrl(translatedWords)} target="_blank" rel="noopener noreferrer">
						{translatedWords}{' '}
					</a>
				</li>
			);
		});

		const body = (
			<div style={modalStyles}>
				<ul>{translatedWordElements}</ul>
			</div>
		);

		this.setState({ modalBody: body });
	}

	createUrl(translatedWord) {
		return 'https://www.spanishdict.com/translate/' + translatedWord;
	}

	modalClosed() {
		this.setState({ isModalOpen: false });
	}

	openModal() {
		this.setState({ isModalOpen: true });
	}

	render() {
		const { isModalOpen, modalBody } = this.state;

		return (
			<div>
				<button onClick={this.openModal}>Open Word Reference</button>
				<Modal open={isModalOpen} onClose={this.modalClosed}>
					{modalBody}
				</Modal>
			</div>
		);
	}
}
