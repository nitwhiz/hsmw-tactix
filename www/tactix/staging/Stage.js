/**
 * Holds the available Stages in Tactix.
 * @readonly
 * @enum {Number}
 */
var Stage = {
	/** Just used as trigger for some async initializers */
	INTRO: 0,
	/** Changing the current Entity, resetting some trackers */
	CYCLE_ENTITY: 1,
	/** Scrolling to the current Entity */
	SCROLL_TO_CURRENT: 2,
	/** Awaiting the first move of current Entity */
	AWAIT_MOVE_1: 3,
	/** Walking to target (Move 1) */
	WALK_TO_TARGET_1: 4,
	/** Attacking the target (Move 1) */
	DISPLAY_ATTACK_1: 5,
	/** Awaiting the second move of current Entity */
	AWAIT_MOVE_2: 6,
	/** Walking to target (Move 2) */
	WALK_TO_TARGET_2: 7,
	/** Attacking the target (Move 2) */
	DISPLAY_ATTACK_2: 8,
	/** Finally, choosing a waiting position */
	SET_WAITING_POSITION: 9
};
