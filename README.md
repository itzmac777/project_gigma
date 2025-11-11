# Realtime Collaborative Drawing Tool 
  ### (Github + Figma = Gigma)

A realtime collaborative rectangle based drawing tool that allows you to join any room with just a name and 
turn your blocky imagination into reality

## 📜 Table of Contents
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Installation & Setup](#️-installation--setup)
- [How It Works](#-how-it-works)
- [🧱 Tech Stack](#-tech-stack)
- [🔥 Challenges I Faced](#-challenges-i-faced)
  - [Negative Height & Width](#-negative-height--width)
  - [Mouse Selection](#-mouse-selection)
- [🎯 Future Goals](#-future-goals)
- [💡 Why I Built This](#-why-i-built-this)

## Live Demo
https://projectgigma-production.up.railway.app/

## Features
- **Draw & Create:** Draw rectangles of any shape or size on the canvas.  
- **Move & Scale:** Select and resize shapes seamlessly with intuitive mouse controls.  
- **Real-Time Collaboration:** Invite others to your canvas using a shared canvas name — changes appear live for everyone.  
- **State Sync:** Canvas state stays consistent across all connected users using Socket.IO.
- **Live Cursor:** Can see other people cursor live along with their 3 digit ID
- **Lightweight & Fast:** Built completely from scratch without heavy libraries like Fabric.js or Konva.  
- **Custom Engine:** Every interaction (selection, scaling, movement) is manually implemented for full control.

## Screenshots

## Installation & Setup

### Prerequisites
- Node.js (v14+)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/itzmac777/project_gigma/
cd project_gigma
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the application**
```bash
npm start
```

4. **Access the app**
```
http://localhost:3000
```

## How it works

The editor uses a **custom rendering engine** built over the HTML5 canvas API.  
Each rectangle is represented as an object in memory, including its coordinates, dimensions.  

Every frame:
1. The canvas is cleared.
2. All shapes are redrawn from the shape array (Which is emitted from server side to only those who joins new).
3. The active selection and transformation handles are rendered.
4. Socket.IO synchronizes any user interactions (draw, move, scale, delete, mouse movement) across connected clients.

This approach ensures **deterministic rendering** and enables features like manipulation and remote sync.

## Tech Stack

- **Frontend:** HTML5 Canvas, Vanilla JS, EJS, Tailwind  
- **Backend:** Node.js, Express.js, Socket.IO  
- **Realtime:** WebSocket protocol via Socket.IO  
- **State Handling:** Custom in-memory object store for all canvas shapes

## Challenges I Faced

- Handling **canvas transformations** and maintaining correct scaling ratios  
- Implementing **precise selection boxes** with pixel-perfect mouse detection [how it works](#-mouse-selection) 
- Negative **Height & Width** problem making that rectangle unselectable  [how it works](#-negative-height-width) 
- Managing **state rendering** without libraries like Fabric.js

## 🎯 Future Goals

- [ ] Add **text and circle drawing tools**    
- [ ] Introduce **undo/redo and history tracking**  
- [ ] Add **image import/export** support
- [ ] Giving **random name and avatar** to socket client for more engagement
- [ ] Create **user authentication and cloud saving**

## Why I Built This

I wanted to understand how collaborative tools like Figma work under the hood from how objects are drawn and transformed, 
to how sockets synchronize multiple users actions in real time. Instead of using libraries, I decided to **build everything from scratch** 
the selection logic, transformation handles, and rendering flow to deeply learn how a real-time canvas engine works. And I am glad
I did;)


## Negative height width
### The problem
If height and width of any rectangle is negative, the calculation done for selection, scaling doesnt work as desired but most 
importantly, it doesnt works as user's expectation.
### Solution
Use constrains while creating and scaling any rectangle preventing its height and width going below a particular pixel level;)

## Mouse Selection
### Old Process
It used to loop through the rectangle array, and used a helper function to determine whether the mouse click is inside the
rectangle or not. And when it finds one, it will break out the loop and return the rectangle index thus marking it selected

### The problem
This loop only detects those rectangles that are top of rectangle array. Suppose a scenerio where one small rectangle is indside another recangle. 
If the big rectangle was drawn early, and small one later(making it lower level in the array), if we try to select the small one
we wont be able to do that because when we will loop through the array, we will find the big rectangle filling the algo criteria
and breaking the loop early making it the selection. Thus we can never select the small rectangle until and unless we move or delete
the big rectangle(Which is not good at all)

### Yakka Bunbun(New Algo)
Resolve it using cords distance measuring formula's. what basically i did was, if clicked inside rect, get distance of all 
corner of current rectangle and only keep the smallest distance, then keep looping, if any other rectangle is found which is 
clicked but the distance is smaller, select that. Keep looping until you reached the end and this way, its worked like fine 
wine and I could select 99.99% of the time the desired rectangle i wanted.
