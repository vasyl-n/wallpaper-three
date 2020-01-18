const app = document.querySelector('#app')

const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
console.log(window.innerWidth, window.innerHeight)

const MAX_X = window.innerHeight / 2;
const MIN_X = -window.innerHeight / 2;
const MAX_Y = window.innerWidth / 2;
const MIN_Y = -window.innerWidth / 2;

const MIN_X_MOVE_RANGE = (x) => {
  return x - 50;
}

const MAX_X_MOVE_RANGE = (x) => {
  return x + 50;
} 

const MIN_Y_MOVE_RANGE = (x) => {
  return x - 50;
} 

const MAX_Y_MOVE_RANGE = (x) => {
  return x + 50;
} 

app.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { 
  color: "pink",
  wireframe: false,
} );

const spheres = []

var lineMaterial = new THREE.LineBasicMaterial( { color: "white", linewidth: 40 } )

const createAndAddSphere = (coords) => {
 let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(...coords);
  spheres.push( [sphere] )
  scene.add(  sphere );
}

const makeCoordinates = () => {
  let x = Math.floor(Math.random() * window.innerWidth) - window.innerWidth/2;
  let y = Math.floor(Math.random() * window.innerHeight) - window.innerHeight/2;
  let z = Math.floor(Math.random() * 6)

  return [x, y, z]
}


for ( let i = 0; i < 100; i++ ) {
  createAndAddSphere(makeCoordinates());
}
 
camera.position.z = 400;

const updateSpheresPositions = () => {
  spheres.forEach((el, i) => {
    const sphere = el[0];
    let newPosition = el[1];
    const {x, y, z} = sphere.position;
    if (!newPosition) {
      newPosition = [];
      
      let newXCoord = getRandomArbitrary(MIN_X_MOVE_RANGE(x), MAX_X_MOVE_RANGE(x));
      let newYCoord = getRandomArbitrary(MIN_Y_MOVE_RANGE(y), MAX_Y_MOVE_RANGE(y));
      if (newXCoord < MIN_X || newXCoord > MAX_X ) {
        newXCoord = getRandomArbitrary(MIN_X, MAX_X)
      }
      if (newYCoord < MIN_Y || newYCoord > MAX_Y ) {
        newYCoord = getRandomArbitrary(MIN_Y, MAX_Y)
      }
      
      newPosition[0] = newXCoord
      newPosition[1] = newYCoord
      el.push(newPosition);
    }
    if (sphere.position.x < newPosition[0]) {
          sphere.position.set(x + .5, y, z)
    }
    else if (sphere.position.y < newPosition[1]){
          sphere.position.set(x, y+.5, z)
    }
    else if (sphere.position.x > newPosition[0]) {
          sphere.position.set(x - .5, y, z)
    }
    else if (sphere.position.y > newPosition[1]) {
          sphere.position.set(x, y-.5, z)
    }
    else {
      const newPosition = [];
      newPosition[0] = getRandomArbitrary(MIN_X_MOVE_RANGE(x), MAX_X_MOVE_RANGE(x));
      newPosition[1] = getRandomArbitrary(MIN_Y_MOVE_RANGE(y), MAX_Y_MOVE_RANGE(y));

      el.pop();
      el.push(newPosition);
    }
    if ( i % 2 === 0 ) {
      let newLine = updateLine(spheres[i][0], spheres[i+1][0]);

      const lineIndex = Math.floor(i / 2);

      const oldLine = lines[lineIndex];
      if (oldLine) {
        var selectedObject = scene.getObjectByName(oldLine.name);
        scene.remove( selectedObject );
      }
      newLine.name = `line${i}`;

      lines[lineIndex] = newLine;
      scene.add( newLine );
    }
  })
}


//adds stars
var starsGeometry = new THREE.Geometry();
// for ( var i = 0; i < 10000; i ++ ) {
// 	var star = new THREE.Vector3();
// 	star.x = THREE.Math.randFloatSpread( 2000 );
// 	star.y = THREE.Math.randFloatSpread( 2000 );
// 	star.z = THREE.Math.randFloatSpread( 2000 );

// 	starsGeometry.vertices.push( star );
// }

var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

var starField = new THREE.Points( starsGeometry, starsMaterial );

scene.add( starField );


function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const lines = [];

const updateLine = (sphere1, sphere2) => {
  const newX = sphere1.position.x;
  const newY = sphere1.position.y;
  const newX2 = sphere2.position.x;
  const newY2 = sphere2.position.y;

  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(new THREE.Vector3(newX, newY, 0) );
  lineGeometry.vertices.push(new THREE.Vector3(newX2, newY2, 0) );
  const line = new THREE.Line( lineGeometry, lineMaterial );
  return line;
}

const consoleLogOnce = () => {
  let count = 1;
  return (thing) => {
    if (count > 0) {
      console.log(thing)
      count = 0
    }
  }
}

const cl = consoleLogOnce();

const updateLines = () => {
  
  for ( let i = 0; i < 1; i+2) {
    let newLine = updateLine(spheres[i][0], spheres[i+1][0]);
    
   cl(JSON.stringify(newLine))
    const lineIndex = Math.floor(i / 2);
    
    const oldLine = lines[lineIndex];
    if (oldLine) {
      var selectedObject = scene.getObjectByName(oldLine.name);
      scene.remove( selectedObject );
    }
    newLine.name = `line${i}`;
  
    lines[lineIndex] = newLine;
    scene.add( newLine );
  }
}


const animate = function () {
  
  requestAnimationFrame( animate );
  updateSpheresPositions()
  
  // updateLines()
  
  renderer.render( scene, camera );
};

animate();
