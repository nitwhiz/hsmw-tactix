/**
 * This state is the main game
 * @constructor
 * @param {StateBasedGame} game - The game to associate the state with
 * @extends {GameState}
 */
var InGame = function(game) {
	GameState.call(this, game);

	var moved = false;

	var map = new Aisenfield();
	var board = new Board(map);

	var display = new Display();

	var statsLeft = new Stats(0);
	var statsRight = new Stats(1);

	var boardCenterOX = 0;
	var boardCenterOY = 0;

	var mouseX = 45;
	var mouseY = 45;

	var mouseMiddleOX = 0;
	var mouseMiddleOY = 0;
	var mouseMiddleDown = false;

	statsLeft.x = -136;
	statsLeft.y = 120;

	statsRight.x = 240;
	statsRight.y = 120;

	var currentEntity = null;
	var currentEntityMoved = false;
	var currentEntityAttacked = false;

	var stager = new Staging(Stage.SCROLL_TO_CURRENT);

	var scrollLock = false;

	var Mode = {
		ATTACK: 0,
		MOVE: 1,
		WAIT: 2
	};

	var currentMode = Mode.MOVE;
	var execMode = null;

	var aiActionScheduled = false;

	var helpText = '';
	var helpTextTargetX = 0;
	var helpTextTargetY = 2;
	var helpTextX = 0;
	var helpTextY = 0;

	var inventory = new InventoryDisplay();

	var autoPlay = false;

	var consumingClick = false;

	var lastMoveFrom = null;

	var aiAction = function() {
		if (
			(currentEntity.stats.side === Entity.ENEMY || autoPlay) &&
			!aiActionScheduled
		) {
			aiActionScheduled = true;

			game.scheduleTask(1000, function() {
				var decision = AI.makeDecision(
					board,
					currentEntity,
					currentEntityMoved,
					currentEntityAttacked
				);

				console.log('AI', decision);

				switch (decision.decision) {
					case AI.WALK:
						actionSetMode(Mode.MOVE);

						game.scheduleTask(750, function() {
							actionPointAtXY(decision.targetX, decision.targetY);

							game.scheduleTask(300, function() {
								actionMoveToXY(
									decision.targetX,
									decision.targetY
								);

								aiActionScheduled = false;
							});
						});
						break;
					case AI.ATTACK:
						actionSetMode(Mode.ATTACK);

						game.scheduleTask(750, function() {
							actionPointAtXY(decision.targetX, decision.targetY);

							game.scheduleTask(750, function() {
								actionAttackXY(
									decision.targetX,
									decision.targetY
								);

								aiActionScheduled = false;
							});
						});
						break;
					case AI.WAIT:
						actionSetMode(Mode.WAIT);

						game.scheduleTask(300, function() {
							currentEntity.turn(decision.direction);

							game.scheduleTask(300, function() {
								actionSubmitWait();

								aiActionScheduled = false;
							});
						});
						break;
					default:
						break;
				}
			});
		}
	};

	var actionSetMode = function(newMode, dontPoint) {
		currentMode = newMode;

		board.unBlink();

		if (newMode === Mode.WAIT) {
			board.unPoint();
		} else if (!dontPoint && currentEntity.stats.side === Entity.ALLIED) {
			var mouseGrid = board.toGridXY(mouseX, mouseY);
			actionPointAtXY(mouseGrid.x, mouseGrid.y);
		}
	};

	var actionMoveToXY = function(gridX, gridY) {
		var aStar = new AStar(
			board,
			Math.floor(currentEntity.gridX) + 0.5,
			Math.floor(currentEntity.gridY) + 0.5,
			Math.floor(gridX) + 0.5,
			Math.floor(gridY) + 0.5
		);
		var path = aStar.findPath();

		currentEntity.walkPath(path);

		stager.setCurrent(Stage.SCROLL_TO_CURRENT);

		execMode = currentMode;
	};

	var actionAttackXY = function(gridX, gridY) {
		gridX = Utils.roundPt5(gridX);
		gridY = Utils.roundPt5(gridY);

		var attackAffected = Explorer.discoverEntitiesInRadius(
			gridX,
			gridY,
			currentEntity.stats.attackRange
		);

		if (attackAffected.length > 0) {
			stager.setCurrent(Stage.SCROLL_TO_CURRENT);

			execMode = currentMode;

			board.attackXY(currentEntity, gridX, gridY);

			currentEntity.attack();

			for (var i = 0, l = attackAffected.length, e = null; i < l; ++i) {
				attackAffected[i].receiveAttack(currentEntity);
			}
		}
	};

	var actionSubmitWait = function() {
		stager.setCurrent(Stage.CYCLE_ENTITY);
	};

	var actionPointAtXY = function(gridX, gridY) {
		if (board.map.isOutOfBounds(gridX, gridY)) {
			return;
		}

		if (currentMode !== Mode.WAIT) {
			board.pointAt(Math.floor(gridX), Math.floor(gridY));
		}

		var mouseEntity = board.getEntityAtXY(
			Math.floor(gridX),
			Math.floor(gridY)
		);

		if (!mouseEntity || statsRight.getEntity() !== mouseEntity) {
			statsRight.setEntity(null);
			statsRight.x = 240;
			statsRight.y = 120;
		}

		if (
			currentMode !== Mode.WAIT &&
			mouseEntity &&
			statsRight.getEntity() !== mouseEntity &&
			board.getCurrentEntity() !== mouseEntity
		) {
			statsRight.setEntity(mouseEntity);
			statsRight.moveTo(144, 120);
		}

		if (
			currentMode === Mode.ATTACK &&
			Explorer.foundField(
				Utils.roundPt5(gridX),
				Utils.roundPt5(gridY),
				board.getAttackables()
			)
		) {
			var attackAffected = Explorer.discoverEntitiesInRadius(
				Utils.roundPt5(gridX),
				Utils.roundPt5(gridY),
				currentEntity.stats.attackRange
			);

			for (var i = 0, l = attackAffected.length; i < l; ++i) {
				attackAffected[i].isBlinking = true;
			}
		}
	};

	/**
	 * Initialize the GameState
	 * @override
	 */
	this.init = function() {
		for (var i = 0; i < 6; ++i) {
			if (i < 3) {
				board.spawnEntity(Soldier, true);
			} else {
				board.spawnEntity(Soldier, false);
			}
		}

		for (i = 0; i < 4; ++i) {
			if (i < 2) {
				board.spawnEntity(Mogry, true);
			} else {
				board.spawnEntity(Mogry, false);
			}
		}

		currentEntity = board.getCurrentEntity();

		Explorer.board = board;

		statsLeft.setEntity(currentEntity);

		display.addComponent(statsLeft);
		display.addComponent(statsRight);

		stager.addTrigger(
			[
				Stage.INTRO,
				Stage.SCROLL_TO_CURRENT,
				Stage.AWAIT_MOVE_1,
				Stage.WALK_TO_TARGET_1,
				Stage.DISPLAY_ATTACK_1,
				Stage.AWAIT_MOVE_2,
				Stage.WALK_TO_TARGET_2,
				Stage.DISPLAY_ATTACK_2,
				Stage.SET_WAITING_POSITION
			],
			function() {
				board.unBlink();
			}
		);

		stager.addTrigger(
			[
				Stage.INTRO,
				Stage.SCROLL_TO_CURRENT,
				Stage.WALK_TO_TARGET_1,
				Stage.DISPLAY_ATTACK_1,
				Stage.WALK_TO_TARGET_2,
				Stage.DISPLAY_ATTACK_2
			],
			function() {
				scrollLock = true;

				statsLeft.x = -136;

				board.showWalkables = false;
				board.showAttackables = false;
			}
		);

		stager.addTrigger(
			[
				Stage.AWAIT_MOVE_1,
				Stage.AWAIT_MOVE_2,
				Stage.SET_WAITING_POSITION
			],
			function() {
				scrollLock = false;

				statsLeft.moveTo(0, 120);
			}
		);
	};

	/**
	 * Update the GameState
	 * @override
	 * @param {Number} delta - The delay between the last frame and this frame
	 */
	this.tick = function(delta) {
		PerformanceCounter.tick(delta);

		inventory.setEntity(currentEntity);

		board.tick(delta);
		display.tick(delta);

		if (!scrollLock && mouseMiddleDown) {
			Cursor.set('translate', game.screenNode);

			board.centerX = boardCenterOX + (mouseMiddleOX - mouseX);
			board.centerY = boardCenterOY + (mouseMiddleOY - mouseY);
		} else if (
			currentMode === Mode.WAIT &&
			currentEntity.stats.side === Entity.ALLIED
		) {
			Cursor.set(
				'wait_' + currentEntity.getCurrentDirection(),
				game.screenNode
			);
		} else {
			Cursor.set('default', game.screenNode);
		}

		switch (stager.getCurrent()) {
			case Stage.CYCLE_ENTITY:
				actionSetMode(Mode.MOVE, true);

				currentEntityMoved = false;
				currentEntityAttacked = false;

				if (board.cycleNextEntity()) {
					currentEntity = board.getCurrentEntity();

					statsLeft.setEntity(currentEntity);

					stager.setCurrent(Stage.SCROLL_TO_CURRENT);
				} else {
					if (board.getEnemyCount() > board.getAllyCount()) {
						game.switchState('go_defeat');
					} else {
						game.switchState('go_victory');
					}
				}
				break;
			case Stage.SCROLL_TO_CURRENT:
				statsRight.setEntity(null);
				statsRight.x = 240;
				statsRight.y = 120;

				if (
					Utils.getDistance(
						board.centerX,
						board.centerY,
						currentEntity.screenX,
						currentEntity.screenY
					) > 1
				) {
					var angle = Utils.getAngle(
						currentEntity.screenX,
						currentEntity.screenY,
						board.centerX,
						board.centerY
					);

					var step =
						Utils.getDistance(
							board.centerX,
							board.centerY,
							currentEntity.screenX,
							currentEntity.screenY
						) /
							25 +
						0.5;

					board.centerX += step * Math.cos(angle);
					board.centerY += step * Math.sin(angle);
				} else {
					board.centerX = currentEntity.screenX;
					board.centerY = currentEntity.screenY;

					if (stager.lastWas([null, Stage.CYCLE_ENTITY])) {
						stager.setCurrent(Stage.AWAIT_MOVE_1);

						board.entityDiscover(currentEntity.uid);
					} else {
						if (
							stager.lastWas([
								Stage.AWAIT_MOVE_1,
								Stage.AWAIT_MOVE_2
							])
						) {
							if (execMode === Mode.MOVE) {
								currentEntityMoved = true;

								stager.setCurrent(
									stager.lastWas(Stage.AWAIT_MOVE_1)
										? Stage.WALK_TO_TARGET_1
										: Stage.WALK_TO_TARGET_2
								);
							} else if (execMode === Mode.ATTACK) {
								currentEntityAttacked = true;

								stager.setCurrent(
									stager.lastWas(Stage.AWAIT_MOVE_1)
										? Stage.DISPLAY_ATTACK_1
										: Stage.DISPLAY_ATTACK_2
								);
							}
						}
					}

					if (currentEntity.stats.side === Entity.ALLIED) {
						var mouseGrid = board.toGridXY(mouseX, mouseY);
						actionPointAtXY(mouseGrid.x, mouseGrid.y);
					}
				}
				break;
			case Stage.AWAIT_MOVE_1:
			case Stage.AWAIT_MOVE_2:
				aiAction();

				if (currentMode === Mode.MOVE) {
					board.showWalkables = true;
					board.showAttackables = false;
				} else if (currentMode === Mode.ATTACK) {
					board.showWalkables = false;
					board.showAttackables = true;
				} else if (currentMode === Mode.WAIT) {
					board.showWalkables = false;
					board.showAttackables = false;
				}
				break;
			case Stage.DISPLAY_ATTACK_1:
				if (currentEntity.isDead()) {
					stager.setCurrent(Stage.CYCLE_ENTITY);
					break;
				}

				if (currentEntity.getState() === Entity.state.IDLE) {
					stager.setCurrent(Stage.AWAIT_MOVE_2);

					actionSetMode(Mode.MOVE);
				}
				break;
			case Stage.DISPLAY_ATTACK_2:
				if (currentEntity.isDead()) {
					stager.setCurrent(Stage.CYCLE_ENTITY);
					break;
				}

				if (currentEntity.getState() === Entity.state.IDLE) {
					actionSetMode(Mode.WAIT);
					stager.setCurrent(Stage.SET_WAITING_POSITION);
				}
				break;
			case Stage.WALK_TO_TARGET_1:
				board.centerOnEntity(currentEntity);

				if (currentEntity.arrived) {
					stager.setCurrent(Stage.AWAIT_MOVE_2);

					board.entityDiscover(currentEntity.uid);

					board.unPoint();

					actionSetMode(Mode.ATTACK);
				}
				break;
			case Stage.WALK_TO_TARGET_2:
				board.centerOnEntity(currentEntity);

				if (currentEntity.arrived) {
					actionSetMode(Mode.WAIT);
					stager.setCurrent(Stage.SET_WAITING_POSITION);
				}
				break;
			case Stage.SET_WAITING_POSITION:
				board.unPoint();
				aiAction();
				break;
			default:
				break;
		}
	};

	/**
	 * Render the GameState
	 * @override
	 * @param {CanvasRenderingContext2D} context2d - The context to render this frame in
	 */
	this.render = function(context2d) {
		board.render(context2d);

		display.render(context2d);

		Art.mode[currentMode].render(context2d, 211, 5);

		inventory.render(context2d);

		PerformanceCounter.render(context2d);
	};

	/**
	 * Handle key down
	 * @override
	 * @param {Event} event - The event from the browser
	 */
	this.onKeyDown = function(event) {
		if (event.keyCode === 116) {
			window.location.reload(true);
		}

		if (currentEntity.stats.side === Entity.ALLIED) {
			if (
				stager.currentIs([
					Stage.AWAIT_MOVE_1,
					Stage.AWAIT_MOVE_2,
					Stage.SET_WAITING_POSITION
				])
			) {
				switch (event.key.toUpperCase()) {
					case 'Q':
						if (!currentEntityMoved) {
							actionSetMode(Mode.MOVE);
						}
						break;
					case 'E':
						if (!currentEntityAttacked) {
							actionSetMode(Mode.ATTACK);
						}
						break;
					case 'W':
						actionSetMode(Mode.WAIT);
						break;
					case 'F':
						if (!inventory.isVisible()) {
							inventory.show();
						} else {
							inventory.hide();
						}
						break;
					default:
						break;
				}
			}
		}
	};

	/**
	 * Handle mouse click
	 * @override
	 * @param {Event} event - The event from the browser
	 */
	this.onMouseClick = function(event) {
		if (
			(currentMode === Mode.ATTACK && currentEntityAttacked) ||
			(currentMode === Mode.MOVE && currentEntityMoved) ||
			inventory.isVisible()
		) {
			return;
		}

		if (currentEntity.stats.side === Entity.ALLIED) {
			var mouseGrid = board.toGridXY(event.offsetX, event.offsetY);

			if (currentMode === Mode.MOVE) {
				if (
					stager.currentIs([Stage.AWAIT_MOVE_1, Stage.AWAIT_MOVE_2])
				) {
					if (board.isWalkable(mouseGrid.x, mouseGrid.y)) {
						actionMoveToXY(mouseGrid.x, mouseGrid.y);
					}
				}
			} else if (
				currentMode === Mode.ATTACK &&
				currentEntity.canAttack()
			) {
				if (board.isAttackable(mouseGrid.x, mouseGrid.y)) {
					actionAttackXY(mouseGrid.x, mouseGrid.y);
				}
			} else if (currentMode === Mode.WAIT) {
				actionSubmitWait();
			}
		}
	};

	/**
	 * Handle mouse down
	 * @override
	 * @param {Event} event - The event from the browser
	 */
	this.onMouseDown = function(event) {
		if (currentEntity.stats.side === Entity.ALLIED) {
			if (event.button === 1) {
				mouseMiddleDown = true;

				mouseMiddleOX = event.offsetX;
				mouseMiddleOY = event.offsetY;

				boardCenterOX = board.centerX;
				boardCenterOY = board.centerY;
			}
		}
	};

	/**
	 * Handle mouse up
	 * @override
	 * @param {Event} event - The event from the browser
	 */
	this.onMouseUp = function(event) {
		mouseMiddleDown = false;
	};

	/**
	 * Handle mouse move
	 * @override
	 * @param {Event} event - The event from the browser
	 */
	this.onMouseMove = function(event) {
		mouseX = event.offsetX;
		mouseY = event.offsetY;

		board.unBlink();

		if (currentEntity.stats.side === Entity.ALLIED) {
			var mouseGrid = board.toGridXY(event.offsetX, event.offsetY);

			if (stager.currentIs([Stage.AWAIT_MOVE_1, Stage.AWAIT_MOVE_2])) {
				actionPointAtXY(mouseGrid.x, mouseGrid.y);
			}

			if (
				stager.currentIs([Stage.SET_WAITING_POSITION]) ||
				currentMode === Mode.WAIT
			) {
				currentEntity.turnToDirectionByAngle(
					Utils.getAngleDegrees(
						currentEntity.gridX,
						currentEntity.gridY,
						mouseGrid.x,
						mouseGrid.y
					)
				);
			}

			mouseX = event.offsetX;
			mouseY = event.offsetY;
		}
	};
};

InGame.prototype = Object.create(GameState.prototype);
