import HashTable from './HashTable';
import LinkedList from '../linked-list/LinkedList';

const defaultHashTableSize = 8;

export default class DynamicHashTable extends HashTable {
  /**
   * @param {number} hashTableSize
   */
  constructor(hashTableSize = defaultHashTableSize, loadFactor = 0.75) {
    super(hashTableSize);

    // resize parameters
    this.capacity = hashTableSize;
    this.loadFactor = loadFactor;
    this.calculateThreshold();

    // track the number of entries
    this.size = 0;
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    super.set(key, value);
    this.size += 1;

    if (this.size > this.threshold) {
      this.resize();
    }
  }

  /**
   * @param {string} key
   * @return {*}
   */
  delete(key) {
    this.size -= 1;
    return super.delete(key);
  }

  /**
   * Creates new bucket array, twice as big as original.
   * Rehashes all entries
   */
  resize() {
    // double capacity
    this.capacity *= 2;
    this.calculateThreshold();

    // create new bucket array
    const originalBuckets = this.buckets;
    this.buckets = Array(this.capacity).fill(null).map(() => new LinkedList());
    this.keys = {};

    // rehash all entries
    Object.values(originalBuckets).forEach((list) => {
      let currentNode = list.head;
      while (currentNode) {
        const { key, value } = currentNode.value;
        this.set(key, value);
        currentNode = currentNode.next;
      }
    });
  }

  calculateThreshold() {
    this.threshold = this.capacity * this.loadFactor;
  }
}
