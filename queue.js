class queue {
    // Array is used to implement a Queue
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty()) { console.log("Tried Dequeue on empty queue"); return "Underflow"; }
        return this.items.shift();
    }
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    isEmpty() {

        return this.items.length == 0;
    }
    print() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}