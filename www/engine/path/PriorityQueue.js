/**
 * PriorityQueues for A* path finding. Only stores Objects containing a individual hash property, such as PathNodes.
 * Has 2 different representations of the stored data internally so it uses a little more memory for the sake of performance
 * @constructor
 */
var PriorityQueue = function() {
	var memoryList = [];
	var memoryHeap = {};

	var sortMemory = function() {
		memoryList.sort(function(a, b) {
			return memoryHeap[a].priority - memoryHeap[b].priority;
		});
	};

	/**
	 * Retrieve the size of this queue
	 * @returns {Number}
	 */
	this.size = function() {
		return memoryList.length;
	};

	/**
	 * Retrieve a specific element
	 * @param {PathNode} element - A PathNode
	 * @returns {PathNode} An element from the memoryHeap with the same hash as the element given
	 */
	this.get = function(element) {
		return memoryHeap[element.hash];
	};

	/**
	 * Insert an element with a specified priority
	 * @param {PathNode} element - The element
	 * @param {Number} priority - The priority
	 */
	this.insert = function(element, priority) {
		memoryList.push(element.hash);
		memoryHeap[element.hash] = {
			data: element,
			priority: priority
		};

		sortMemory();
	};

	/**
	 * Retrieve whether an element with the same hash as the given elements hash is in this queue
	 * @param {PathNode} element - A PathNode
	 * @returns {Boolean} True if the PathNode is in this queue
	 */
	this.contains = function(element) {
		return memoryHeap[element.hash] !== undefined;
	};

	/**
	 * Remove and retrieve the element with the lowest priority
	 * @returns {PathNode} The PathNode with the lowest priority or null if there isn't any PathNode in the queue
	 */
	this.removeMin = function() {
		if (memoryList.length > 0) {
			var data = memoryHeap[memoryList.shift()].data;

			delete memoryHeap[data.hash];

			return data;
		}

		return null;
	};

	/**
	 * Decrease the priority of a given element by a specified amount
	 * @param {PathNode} element - A PathNode
	 * @param {Number} decrease - The amount of decrease
	 */
	this.decreaseKey = function(element, decrease) {
		memoryHeap[element.hash].priority -= decrease;

		sortMemory();
	};
};
