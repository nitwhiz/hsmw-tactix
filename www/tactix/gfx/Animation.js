/* misc */

Animation.thunder = new Animation([
	{ path: 'assets/misc/thunder_0.png', duration: 240 },
	{ path: 'assets/misc/thunder_1.png', duration: 240 }
]);

/* board walkables */

Animation.boardWalkableFieldsAllied = new Animation([
	{ path: 'assets/misc/field0.png', duration: 150 },
	{ path: 'assets/misc/field1.png', duration: 150 },
	{ path: 'assets/misc/field2.png', duration: 150 },
	{ path: 'assets/misc/field3.png', duration: 150 },
	{ path: 'assets/misc/field4.png', duration: 150 },
	{ path: 'assets/misc/field5.png', duration: 150 },
	{ path: 'assets/misc/field6.png', duration: 150 },
	{ path: 'assets/misc/field7.png', duration: 150 },
	{ path: 'assets/misc/field8.png', duration: 150 },
	{ path: 'assets/misc/field9.png', duration: 150 }
]);

Animation.boardWalkableFieldsEnemy = Animation.boardWalkableFieldsAllied.instance(
	CorrectionSet.BLUE_RED
);

Animation.boardWalkableFieldsNeutral = Animation.boardWalkableFieldsAllied.instance(
	CorrectionSet.BLUE_YELLOW
);

Animation.boardWalkableFieldsImportant = Animation.boardWalkableFieldsAllied.instance(
	CorrectionSet.BLUE_GREEN
);

/* allied soldier */

Animation.soldierIdleNorth = new Animation([
	{ path: 'assets/soldier/idle/north_0.png', duration: 300 },
	{ path: 'assets/soldier/idle/north_1.png', duration: 150 },
	{ path: 'assets/soldier/idle/north_2.png', duration: 300 },
	{ path: 'assets/soldier/idle/north_1.png', duration: 150 }
]);

Animation.soldierIdleWest = new Animation([
	{ path: 'assets/soldier/idle/west_0.png', duration: 300 },
	{ path: 'assets/soldier/idle/west_1.png', duration: 150 },
	{ path: 'assets/soldier/idle/west_2.png', duration: 300 },
	{ path: 'assets/soldier/idle/west_1.png', duration: 150 }
]);

Animation.soldierIdleSouth = new Animation([
	{ path: 'assets/soldier/idle/south_0.png', duration: 300 },
	{ path: 'assets/soldier/idle/south_1.png', duration: 150 },
	{ path: 'assets/soldier/idle/south_2.png', duration: 300 },
	{ path: 'assets/soldier/idle/south_1.png', duration: 150 }
]);

Animation.soldierIdleEast = new Animation([
	{ path: 'assets/soldier/idle/east_0.png', duration: 300 },
	{ path: 'assets/soldier/idle/east_1.png', duration: 150 },
	{ path: 'assets/soldier/idle/east_2.png', duration: 300 },
	{ path: 'assets/soldier/idle/east_1.png', duration: 150 }
]);

Animation.soldierAttackingNorth = new Animation(
	[
		{ path: 'assets/soldier/idle/north_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/north_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/north_2.png', duration: 400 }
	],
	null,
	true
);

Animation.soldierAttackingWest = new Animation(
	[
		{ path: 'assets/soldier/idle/west_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/west_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/west_2.png', duration: 400 }
	],
	null,
	true
);

Animation.soldierAttackingSouth = new Animation(
	[
		{ path: 'assets/soldier/idle/south_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/south_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/south_2.png', duration: 400 }
	],
	null,
	true
);

Animation.soldierAttackingEast = new Animation(
	[
		{ path: 'assets/soldier/idle/east_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/east_1.png', duration: 100 },
		{ path: 'assets/soldier/attacking/east_2.png', duration: 400 }
	],
	null,
	true
);

Animation.soldierDefendingNorth = new Animation([
	{ path: 'assets/soldier/idle/north_1.png', duration: 130 },
	{ path: 'assets/soldier/defending/north.png', duration: 500 }
]);

Animation.soldierDefendingWest = new Animation([
	{ path: 'assets/soldier/idle/west_1.png', duration: 130 },
	{ path: 'assets/soldier/defending/west.png', duration: 500 }
]);

Animation.soldierDefendingSouth = new Animation([
	{ path: 'assets/soldier/idle/south_1.png', duration: 130 },
	{ path: 'assets/soldier/defending/south.png', duration: 500 }
]);

Animation.soldierDefendingEast = new Animation([
	{ path: 'assets/soldier/idle/east_1.png', duration: 130 },
	{ path: 'assets/soldier/defending/east.png', duration: 500 }
]);

Animation.soldierEvadingNorth = new Animation([
	{ path: 'assets/soldier/evading/north.png', duration: 250 }
]);
Animation.soldierEvadingWest = new Animation([
	{ path: 'assets/soldier/evading/west.png', duration: 250 }
]);
Animation.soldierEvadingSouth = new Animation([
	{ path: 'assets/soldier/evading/south.png', duration: 250 }
]);
Animation.soldierEvadingEast = new Animation([
	{ path: 'assets/soldier/evading/east.png', duration: 250 }
]);

Animation.soldierDeadNorth = new Animation([
	{ path: 'assets/soldier/dead/north.png', duration: 250 }
]);
Animation.soldierDeadWest = new Animation([
	{ path: 'assets/soldier/dead/west.png', duration: 250 }
]);
Animation.soldierDeadSouth = new Animation([
	{ path: 'assets/soldier/dead/south.png', duration: 250 }
]);
Animation.soldierDeadEast = new Animation([
	{ path: 'assets/soldier/dead/north.png', duration: 250 }
]);

/* enemy soldier */

Animation.enemySoldierIdleNorth = Animation.soldierIdleNorth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierIdleWest = Animation.soldierIdleWest.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierIdleSouth = Animation.soldierIdleSouth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierIdleEast = Animation.soldierIdleEast.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierAttackingNorth = Animation.soldierAttackingNorth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierAttackingWest = Animation.soldierAttackingWest.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierAttackingSouth = Animation.soldierAttackingSouth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierAttackingEast = Animation.soldierAttackingEast.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDefendingNorth = Animation.soldierDefendingNorth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDefendingWest = Animation.soldierDefendingWest.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDefendingSouth = Animation.soldierDefendingSouth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDefendingEast = Animation.soldierDefendingEast.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierEvadingNorth = Animation.soldierEvadingNorth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierEvadingWest = Animation.soldierEvadingWest.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierEvadingSouth = Animation.soldierEvadingSouth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierEvadingEast = Animation.soldierEvadingEast.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDeadNorth = Animation.soldierDeadNorth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDeadWest = Animation.soldierDeadWest.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDeadSouth = Animation.soldierDeadSouth.instance(
	CorrectionSet.BLUE_RED
);

Animation.enemySoldierDeadEast = Animation.soldierDeadEast.instance(
	CorrectionSet.BLUE_RED
);

/* allied mogry */

Animation.mogryIdleNorth = new Animation([
	{ path: 'assets/mogry/idle/north_0.png', duration: 300 },
	{ path: 'assets/mogry/idle/north_1.png', duration: 150 },
	{ path: 'assets/mogry/idle/north_2.png', duration: 300 },
	{ path: 'assets/mogry/idle/north_1.png', duration: 150 }
]);

Animation.mogryIdleWest = new Animation([
	{ path: 'assets/mogry/idle/west_0.png', duration: 300 },
	{ path: 'assets/mogry/idle/west_1.png', duration: 150 },
	{ path: 'assets/mogry/idle/west_2.png', duration: 300 },
	{ path: 'assets/mogry/idle/west_1.png', duration: 150 }
]);

Animation.mogryIdleSouth = new Animation([
	{ path: 'assets/mogry/idle/south_0.png', duration: 300 },
	{ path: 'assets/mogry/idle/south_1.png', duration: 150 },
	{ path: 'assets/mogry/idle/south_2.png', duration: 300 },
	{ path: 'assets/mogry/idle/south_1.png', duration: 150 }
]);

Animation.mogryIdleEast = new Animation([
	{ path: 'assets/mogry/idle/east_0.png', duration: 300 },
	{ path: 'assets/mogry/idle/east_1.png', duration: 150 },
	{ path: 'assets/mogry/idle/east_2.png', duration: 300 },
	{ path: 'assets/mogry/idle/east_1.png', duration: 150 }
]);

Animation.mogryAttackingNorth = new Animation(
	[{ path: 'assets/mogry/attacking/north_0.png', duration: 600 }],
	null,
	true
);

Animation.mogryAttackingWest = new Animation(
	[{ path: 'assets/mogry/attacking/west_0.png', duration: 600 }],
	null,
	true
);

Animation.mogryAttackingSouth = new Animation(
	[{ path: 'assets/mogry/attacking/south_0.png', duration: 600 }],
	null,
	true
);

Animation.mogryAttackingEast = new Animation(
	[{ path: 'assets/mogry/attacking/east_0.png', duration: 600 }],
	null,
	true
);

Animation.mogryDefendingNorth = new Animation([
	{ path: 'assets/mogry/idle/north_1.png', duration: 130 },
	{ path: 'assets/mogry/defending/north.png', duration: 500 }
]);

Animation.mogryDefendingWest = new Animation([
	{ path: 'assets/mogry/idle/west_1.png', duration: 130 },
	{ path: 'assets/mogry/defending/west.png', duration: 500 }
]);

Animation.mogryDefendingSouth = new Animation([
	{ path: 'assets/mogry/idle/south_1.png', duration: 130 },
	{ path: 'assets/mogry/defending/south.png', duration: 500 }
]);

Animation.mogryDefendingEast = new Animation([
	{ path: 'assets/mogry/idle/east_1.png', duration: 130 },
	{ path: 'assets/mogry/defending/east.png', duration: 500 }
]);

Animation.mogryEvadingNorth = new Animation([
	{ path: 'assets/mogry/evading/north.png', duration: 250 }
]);
Animation.mogryEvadingWest = new Animation([
	{ path: 'assets/mogry/evading/west.png', duration: 250 }
]);
Animation.mogryEvadingSouth = new Animation([
	{ path: 'assets/mogry/evading/south.png', duration: 250 }
]);
Animation.mogryEvadingEast = new Animation([
	{ path: 'assets/mogry/evading/east.png', duration: 250 }
]);

Animation.mogryDeadNorth = new Animation([
	{ path: 'assets/mogry/dead/north.png', duration: 250 }
]);
Animation.mogryDeadWest = new Animation([
	{ path: 'assets/mogry/dead/west.png', duration: 250 }
]);
Animation.mogryDeadSouth = new Animation([
	{ path: 'assets/mogry/dead/south.png', duration: 250 }
]);
Animation.mogryDeadEast = new Animation([
	{ path: 'assets/mogry/dead/north.png', duration: 250 }
]);

/* enemy mogry */
Animation.enemyMogryIdleNorth = Animation.mogryIdleNorth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryIdleWest = Animation.mogryIdleWest.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryIdleSouth = Animation.mogryIdleSouth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryIdleEast = Animation.mogryIdleEast.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryAttackingNorth = Animation.mogryAttackingNorth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryAttackingWest = Animation.mogryAttackingWest.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryAttackingSouth = Animation.mogryAttackingSouth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryAttackingEast = Animation.mogryAttackingEast.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDefendingNorth = Animation.mogryDefendingNorth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDefendingWest = Animation.mogryDefendingWest.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDefendingSouth = Animation.mogryDefendingSouth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDefendingEast = Animation.mogryDefendingEast.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryEvadingNorth = Animation.mogryEvadingNorth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryEvadingWest = Animation.mogryEvadingWest.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryEvadingSouth = Animation.mogryEvadingSouth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryEvadingEast = Animation.mogryEvadingEast.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDeadNorth = Animation.mogryDeadNorth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDeadWest = Animation.mogryDeadWest.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDeadSouth = Animation.mogryDeadSouth.instance(
	CorrectionSet.GREEN_RED
);

Animation.enemyMogryDeadEast = Animation.mogryDeadEast.instance(
	CorrectionSet.GREEN_RED
);
