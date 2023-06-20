import showModal from './modal';

// call showModal function
function showWinnerModal(fighter) {
    return showModal({ title: `${fighter} WIN!!!`, bodyElement: `It was a spectacular fight.` });
}

export default showWinnerModal;
