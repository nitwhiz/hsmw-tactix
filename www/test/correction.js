(function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var art = null;

	var artSource = '';
	var corrections = [];

	var saveLast = function(key, val) {
		localStorage.setItem('last-' + key, val);
	};

	var readLast = function(key) {
		return localStorage.getItem('last-' + key);
	};

	var renewArt = function(newCorrections) {
		corrections = eval(newCorrections);
		art = new Art(artSource, corrections);

		document.getElementById('original').src = artSource;

		console.log(corrections);
	};

	document.body.addEventListener(
		'drop',
		function(e) {
			e.stopPropagation();
			e.preventDefault();

			var files = e.target.files || e.dataTransfer.files;

			for (var i = 0, f; (f = files[i]); i++) {
				var reader = new FileReader();

				reader.onload = function(e) {
					artSource = e.target.result;

					saveLast('artSource', artSource);

					renewArt('[]');
				};

				reader.readAsDataURL(f);
			}
		},
		false
	);

	document.body.addEventListener(
		'dragover',
		function(e) {
			e.stopPropagation();
			e.preventDefault();
		},
		false
	);

	document.getElementById('apply').addEventListener('click', function() {
		saveLast('corrections', document.getElementById('corrections').value);

		renewArt(
			(document.getElementById('corrections').value || '[]')
				.replace(/\r|\n/g, '')
		);
	});

	var render = function() {
		ctx.clearRect(0, 0, 100, 100);

		if (art) {
			art.render(ctx, 2, 2);
		}
	};

	window.setInterval(function() {
		render();
	}, 1000 / 10);

	artSource = readLast('artSource') || '';
	renewArt(readLast('corrections'));

	document.getElementById('corrections').value = readLast('corrections');
})();
