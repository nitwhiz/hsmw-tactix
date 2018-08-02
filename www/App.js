(function() {
	var screenNode = document.getElementById('screen');

	var tactixGame = new Tactix(screenNode, {
		scale: 3
	});

	tactixGame.run();
})();
