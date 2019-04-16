// place your javascript code here

'use strict';

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const alert = document.querySelector(".alert");

let alert_format = "    ";
alert.style["color"] = '#ffffff';

//
// RECORDER CLASS
//

function RecordingDevice() {
    this.isRecording = false;
}

RecordingDevice.prototype.startRecording = function () {
    let alert_message = alert_format + "Recording started.";
    alert.style["background-color"] = '#000000';
    alert.innerHTML = alert_message;
    alert.style.display = 'block';

    setTimeout(function () {
        alert.style.display = 'none';
    }, 2000);

    this.isRecording = true;
};

RecordingDevice.prototype.stopRecording = function () {
    let alert_message = alert_format + "Recording stopped.";
    if (recorder.isRecording === true) {
        alert_message = alert_format + "Recording stopped.";
    } else {
        alert_message = alert_format + "You didn't start recording!";
    }

    alert.style["background-color"] = '#000000';
    alert.innerHTML = alert_message;
    alert.style.display = 'block';

    setTimeout(function () {
        alert.style.display = 'none';
    }, 2000);

    this.isRecording = false;
};

RecordingDevice.prototype.playRecording = function () {
    let alert_message;
    let curr = stored_list.head;

    if (curr === null) {
        alert_message = alert_format + "You didn't record anything!";
    } else {
        alert_message = alert_format + "Recording playing.";
    }
    alert.style["background-color"] = '#000000';
    alert.innerHTML = alert_message;
    alert.style.display = 'block';

    setTimeout(function () {
        alert.style.display = 'none';
    }, 2000);

    if (stored_list.head === null) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 30;
    makePoint(curr);
};

RecordingDevice.prototype.changeColor = function () {
    let random_hue = Math.floor((Math.random() * 359));

    let alert_message = alert_format + "Hue changed to " + random_hue + "!";
    alert.style["background-color"] = '#000000';
    alert.innerHTML = alert_message;
    alert.style.display = 'block';

    setTimeout(function () {
        alert.style.display = 'none';
    }, 2000);
    hue = random_hue;
};

RecordingDevice.prototype.saveRecording = function () {
    let alert_message = alert_format + "Recording saved.";
    alert.style["background-color"] = 'black';
    alert.innerHTML = alert_message;
    alert.style.display = 'block';

    setTimeout(function () {
        alert.style.display = 'none';
    }, 2000);

    localStorage.setItem("recording", JSON.stringify(stored_list));
};

RecordingDevice.prototype.retrieveSavedRecording = function () {
    let retrieved_list = JSON.parse(localStorage.getItem("recording"));

    stored_list = retrieved_list;
    Object.setPrototypeOf(stored_list, SinglyLinkedList.prototype);

    let alert_message = alert_format;
    if (stored_list === null) {
        alert_message += "No recording on file.";
    } else {
        alert_message += "Recording retrieved. Click \"Play Recording\" to watch!";
    }

    alert.style["background-color"] = 'black';
    alert.innerHTML = alert_message;
    alert.style.display = 'block';

    setTimeout(function () {
        alert.style.display = 'none';
    }, 2000);

};

RecordingDevice.prototype.clear = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas_list.clear();
};

function makePoint(curr) {
    ctx.beginPath();

    if (curr !== stored_list.head && stored_list.getPreviousElement(curr.x, curr.y) !== null) {
        let previousElement = stored_list.getPreviousElement(curr.x, curr.y);
        let x = previousElement.x;
        let y = previousElement.y;
        let prev_line = previousElement.lineNum;
        let curr_line = curr.lineNum;

        if (curr_line > prev_line) {
            ctx.moveTo(curr.x, curr.y);
        } else {
            ctx.moveTo(x, y);
        }
    }

    ctx.strokeStyle = `hsl(${curr.hue}, 100%, 50%)`;

    ctx.lineTo(curr.x, curr.y);

    ctx.closePath();

    ctx.stroke();

    setTimeout(function () {
        if (curr.next !== null) {
            makePoint(curr.next);
        }
    }, 10);
}

//
// NODE CLASS
//

function Node(x, y, hue, lineNum) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.lineNum = lineNum;
    this.next = null;
}

//
// SINGLY LINKED LIST CLASS
//

function SinglyLinkedList(compareFunction) {
    this.head = null;
    this.count = 0;
    this.numLines = 0;
    SinglyLinkedList.prototype.compare = compareFunction;
}

SinglyLinkedList.prototype.addToEnd = function (x, y, hue, lineNum) {
    if (this.head === null) {
        this.head = new Node(x, y, hue, lineNum);
    } else if (this.head.next === null) {
        this.head.next = new Node(x, y, hue, lineNum);
    } else {
        let current = this.head;
        while (current.next !== null) {
            current = current.next;
        }
        current.next = new Node(x, y, hue, lineNum);
    }

    this.count++;
    return;
};

SinglyLinkedList.prototype.findElement = function (x, y) {
    if (this.head === null) {
        return false;
    }

    let current = this.head;
    while (current !== null) {
        if (this.compare(current.x, x) === 0 && this.compare(current.y, y) === 0) {
            return current;
        }
        current = current.next;
    }

    return null;
};

SinglyLinkedList.prototype.getLastElement = function () {
    let current = this.head;
    while (current.next !== null) {
        current = current.next;
    }

    return current;
};

SinglyLinkedList.prototype.getPreviousElement = function (x, y) {
    if (this.head === null) {
        return null;
    }

    if (this.findElement(x, y) !== null) {
        let curr = this.head;
        while (curr.next !== null) {
            if (this.compare(curr.next.x, x) === 0 && this.compare(curr.next.y, y) === 0) {
                return curr;
            }
            curr = curr.next;
        }
    }
    return null;
};

SinglyLinkedList.prototype.size = function () {
    return this.count;
};

SinglyLinkedList.prototype.clear = function () {
    this.head = null;
    this.count = 0;
    this.numLines = 0;
};


// -----------------------------------------------------------------------------


let stored_list = new SinglyLinkedList(function compareNumbers(a, b) {
    return a - b;
});
let canvas_list = new SinglyLinkedList(function compareNumbers(a, b) {
    return a - b;
});
let recorder = new Recorder();

canvas.width = 1565;
canvas.height = 600;

ctx.lineCap = "round";
ctx.lineJoin = "round";

let hue = 0;

let isDrawing = false;
ctx.lineWidth = 30;

function draw() {
    if (!isDrawing) {
        return;
    }

    ctx.beginPath();

    if (canvas_list.getLastElement() !== null) {
        let lastElement = canvas_list.getLastElement();
        let x = lastElement.x;
        let y = lastElement.y;

        ctx.moveTo(x, y);
    }

    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;

    ctx.lineTo(event.offsetX, event.offsetY);

    ctx.closePath();

    ctx.stroke();

    if (recorder.isRecording == true) {
        stored_list.addToEnd(event.offsetX, event.offsetY, hue, stored_list.numLines);
    }
    canvas_list.addToEnd(event.offsetX, event.offsetY, hue, canvas_list.numLines);
}

canvas.addEventListener("mousedown", function (event) {
    isDrawing = true;
    if (recorder.isRecording == true) {
        stored_list.addToEnd(event.offsetX, event.offsetY, hue, stored_list.numLines);
    }
    canvas_list.addToEnd(event.offsetX, event.offsetY, hue, canvas_list.numLines);
});

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    if (recorder.isRecording == true) {
        stored_list.numLines++;
    }
    canvas_list.numLines++;
});
canvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

function main() {
    document.getElementById("play").onclick = function () {
        recorder.playRecording();
    };
    document.getElementById("stop").onclick = function () {
        recorder.stopRecording();
    };
    document.getElementById("start").onclick = function () {
        recorder.startRecording();
    };
    document.getElementById("save").onclick = function () {
        recorder.saveRecording();
    };
    document.getElementById("retrieve_saved").onclick = function () {
        recorder.retrieveSavedRecording();
    };
    document.getElementById("change_color").onclick = function () {
        recorder.changeColor();
    };
    document.getElementById("clear").onclick = function () {
        recorder.clear();
    };
}

main();

// -----------------------------
// CODE ALONG
