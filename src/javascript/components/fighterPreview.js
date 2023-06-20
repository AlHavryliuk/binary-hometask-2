import createElement from '../helpers/domHelper';

const detailMarkup = ({ name, health, defense, attack }) => `
    <span>Name: ${name ?? 'Unknown'}</span>
    <span>Health: ${health ?? 'Unknown'}</span>
    <span>Defense: ${defense ?? 'Unknown'}</span>
    <span>Attack: ${attack ?? 'Unknown'}</span>
    `;

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) return `Not selected`;

    fighterElement.innerHTML = detailMarkup(fighter);

    // todo: show fighter info (image, name, health, etc.)

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
