const gridContainer = document.getElementById('grid-container');
const solveBtn = document.getElementById('solve-btn');
const rows = 20;
const cols = 20;
let isDrawing = false; 

const gridMemory = [];
let startNode = null;
let endNode = null;

class Node {
    constructor(row, col, element) {
        this.row = row;
        this.col = col;
        this.element = element;
        this.isWall = false;
        this.g = Infinity;
        this.h = 0;
        this.f = Infinity;
        this.previousNode = null;
    }
}

// 1. Generate Grid
for (let r = 0; r < rows; r++) {
    const currentRow = [];
    for (let c = 0; c < cols; c++) {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.dataset.row = r;
        nodeElement.dataset.col = c;
        
        const memoryNode = new Node(r, c, nodeElement);

        if (r === 10 && c === 5) {
            nodeElement.classList.add('node-start');
            startNode = memoryNode;
        } else if (r === 10 && c === 15) {
            nodeElement.classList.add('node-end');
            endNode = memoryNode;
        }

        gridContainer.appendChild(nodeElement);
        currentRow.push(memoryNode);
    }
    gridMemory.push(currentRow);
}

function isSafeToPaint(target) {
    return target.classList.contains('node') && 
           !target.classList.contains('node-start') && 
           !target.classList.contains('node-end');
}

function toggleWall(element, forceAdd = false) {
    const r = element.dataset.row;
    const c = element.dataset.col;
    if (forceAdd) {
        element.classList.add('node-wall');
        gridMemory[r][c].isWall = true;
    } else {
        element.classList.toggle('node-wall');
        gridMemory[r][c].isWall = element.classList.contains('node-wall');
    }
}

// 2. Drawing Listeners
gridContainer.addEventListener('mousedown', (e) => {
    if (isSafeToPaint(e.target)) {
        isDrawing = true;
        toggleWall(e.target);
    }
});

gridContainer.addEventListener('mouseover', (e) => {
    if (isDrawing && isSafeToPaint(e.target)) {
        toggleWall(e.target, true);
    }
});

window.addEventListener('mouseup', () => {
    isDrawing = false;
});

// 3. A* Logic & Animation Trackers
function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(gridMemory[row - 1][col]);
    if (row < rows - 1) neighbors.push(gridMemory[row + 1][col]);
    if (col > 0) neighbors.push(gridMemory[row][col - 1]);
    if (col < cols - 1) neighbors.push(gridMemory[row][col + 1]);
    return neighbors;
}

function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// --- NEW ANIMATION FUNCTIONS ---
function animatePath(visitedNodesInOrder, shortestPath) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        // When we finish animating the search, animate the final path
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(shortestPath);
            }, 10 * i);
            return;
        }
        
        // Animate the search spread
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            if (node !== startNode && node !== endNode) {
                node.element.classList.add('node-visited');
            }
        }, 10 * i); // 10ms delay per node
    }
}

function animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
        setTimeout(() => {
            const node = shortestPath[i];
            if (node !== startNode && node !== endNode) {
                node.element.classList.add('node-path');
            }
        }, 50 * i); // 50ms delay per path node
    }
}

function solveAStar() {
    const openSet = [startNode];
    const closedSet = new Set();
    const visitedNodesInOrder = []; // Tracks the order for animation
    
    startNode.g = 0;
    startNode.f = heuristic(startNode, endNode);

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift(); 
        
        visitedNodesInOrder.push(current);

        if (current === endNode) {
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp); // Store the actual Node object now
                temp = temp.previousNode;
            }
            // Trigger animation instead of console.log
            animatePath(visitedNodesInOrder, path.reverse());
            return;
        }

        closedSet.add(current);

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            if (neighbor.isWall || closedSet.has(neighbor)) continue;

            const tentativeG = current.g + 1; 

            if (tentativeG < neighbor.g) {
                neighbor.previousNode = current;
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    
    alert("No Path Possible!");
}

solveBtn.addEventListener('click', solveAStar);

const clearBtn = document.getElementById('clear-btn');

function clearBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const memoryNode = gridMemory[r][c];
            
            // 1. Reset the math memory
            memoryNode.isWall = false;
            memoryNode.g = Infinity;
            memoryNode.h = 0;
            memoryNode.f = Infinity;
            memoryNode.previousNode = null;

            // 2. Reset the visual HTML elements
            memoryNode.element.className = 'node'; // This instantly removes wall, visited, and path classes
            
            // 3. Put the Start and End nodes back
            if (r === 10 && c === 5) {
                memoryNode.element.classList.add('node-start');
            } else if (r === 10 && c === 15) {
                memoryNode.element.classList.add('node-end');
            }
        }
    }
}

clearBtn.addEventListener('click', clearBoard);