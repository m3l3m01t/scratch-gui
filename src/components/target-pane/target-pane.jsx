const isEqual = require('lodash.isequal');
const omit = require('lodash.omit');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');

const VM = require('scratch-vm');

const Box = require('../box/box.jsx');
const BackdropLibrary = require('../../containers/backdrop-library.jsx');
const CostumeLibrary = require('../../containers/costume-library.jsx');
const SoundLibrary = require('../../containers/sound-library.jsx');
const SpriteLibrary = require('../../containers/sprite-library.jsx');
const SpriteSelectorComponent = require('../sprite-selector/sprite-selector.jsx');
const StageSelector = require('../../containers/stage-selector.jsx');

const styles = require('./target-pane.css');
const addIcon = require('./icon--add.svg');

/*
 * Pane that contains the sprite selector, sprite info, stage selector,
 * and the new sprite, costume and backdrop buttons
 * @param {object} props Props for the component
 * @returns {React.Component} rendered component
 */
class TargetPane extends React.Component {
    shouldComponentUpdate (nextProps) {
        return (
            // Do a normal shallow compare on all props except sprites
            Object.keys(omit(nextProps, ['sprites']))
                .reduce((all, k) => all || nextProps[k] !== this.props[k], false) ||
            // Deep compare on sprites object
            !isEqual(this.props.sprites, nextProps.sprites)
        );
    }
    render () {
        const {
            editingTarget,
            backdropLibraryVisible,
            costumeLibraryVisible,
            soundLibraryVisible,
            spriteLibraryVisible,
            onChangeSpriteDirection,
            onChangeSpriteName,
            onChangeSpriteRotationStyle,
            onChangeSpriteVisibility,
            onChangeSpriteX,
            onChangeSpriteY,
            onDeleteSprite,
            onNewSpriteClick,
            onNewBackdropClick,
            onRequestCloseBackdropLibrary,
            onRequestCloseCostumeLibrary,
            onRequestCloseSoundLibrary,
            onRequestCloseSpriteLibrary,
            onSelectSprite,
            stage,
            sprites,
            vm,
            ...componentProps
        } = this.props;
        return (
            <Box
                className={styles.targetPane}
                {...componentProps}
            >

                <SpriteSelectorComponent
                    selectedId={editingTarget}
                    sprites={sprites}
                    onChangeSpriteDirection={onChangeSpriteDirection}
                    onChangeSpriteName={onChangeSpriteName}
                    onChangeSpriteRotationStyle={onChangeSpriteRotationStyle}
                    onChangeSpriteVisibility={onChangeSpriteVisibility}
                    onChangeSpriteX={onChangeSpriteX}
                    onChangeSpriteY={onChangeSpriteY}
                    onDeleteSprite={onDeleteSprite}
                    onSelectSprite={onSelectSprite}
                />
                <Box className={styles.stageSelectorWrapper}>
                    {stage.id && <StageSelector
                        backdropCount={stage.costumeCount}
                        id={stage.id}
                        selected={stage.id === editingTarget}
                        url={
                            stage.costume &&
                            stage.costume.url
                        }
                        onSelect={onSelectSprite}
                    />}
                    <Box>

                        <button
                            className={classNames(styles.addButtonWrapper, styles.addButtonWrapperSprite)}
                            onClick={onNewSpriteClick}
                        >
                            <img
                                className={styles.addButton}
                                src={addIcon}
                            />
                        </button>

                        <button
                            className={classNames(styles.addButtonWrapper, styles.addButtonWrapperStage)}
                            onClick={onNewBackdropClick}
                        >
                            <img
                                className={styles.addButton}
                                src={addIcon}
                            />
                        </button>

                        <SpriteLibrary
                            visible={spriteLibraryVisible}
                            vm={vm}
                            onRequestClose={onRequestCloseSpriteLibrary}
                        />
                        <CostumeLibrary
                            visible={costumeLibraryVisible}
                            vm={vm}
                            onRequestClose={onRequestCloseCostumeLibrary}
                        />
                        <SoundLibrary
                            visible={soundLibraryVisible}
                            vm={vm}
                            onRequestClose={onRequestCloseSoundLibrary}
                        />
                        <BackdropLibrary
                            visible={backdropLibraryVisible}
                            vm={vm}
                            onRequestClose={onRequestCloseBackdropLibrary}
                        />
                    </Box>
                </Box>
            </Box>
        );
    }
}
const spriteShape = PropTypes.shape({
    costume: PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        bitmapResolution: PropTypes.number.isRequired,
        rotationCenterX: PropTypes.number.isRequired,
        rotationCenterY: PropTypes.number.isRequired
    }),
    direction: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    order: PropTypes.number,
    rotationStyle: PropTypes.string,
    visibility: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number
});

TargetPane.propTypes = {
    backdropLibraryVisible: PropTypes.bool,
    costumeLibraryVisible: PropTypes.bool,
    editingTarget: PropTypes.string,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteRotationStyle: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onNewBackdropClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseSoundLibrary: PropTypes.func,
    onRequestCloseSpriteLibrary: PropTypes.func,
    onSelectSprite: PropTypes.func,
    soundLibraryVisible: PropTypes.bool,
    spriteLibraryVisible: PropTypes.bool,
    sprites: PropTypes.objectOf(spriteShape),
    stage: spriteShape,
    vm: PropTypes.instanceOf(VM)
};

module.exports = TargetPane;
