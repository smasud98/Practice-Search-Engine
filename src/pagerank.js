const { Matrix } = require('ml-matrix');
const alpha = 0.1;
const threshold = 0.000000001;


// Step One
async function pageRankOne(matrix, data) {
    try {
      const size = data.length;
      console.log(size)

      let array2D = []
    
      // Populate Adjacency matrix, divide 1s by number of 1s
      for(i = 0; i < size; i++) {
        iPage = data[i];

        var allZeros = true
        var countOnes = 0
        let rowEntry = []
        for(j = 0; j < size; j++) {
          jPage = data[j]
          
          if(iPage.outgoingLinks.includes(jPage.url)) {
              allZeros = false;
              countOnes++;
              rowEntry[j] = 1
          } 
          else {
            rowEntry[j] = 0
          }

          // If we reach end of the row
          if(j == (size-1)) {
              for(a = 0; a < size; a++) {
                // If entire row is 0
                if(allZeros) rowEntry[a] = 1/size;
                else if(rowEntry[a] == 1) rowEntry[a] = 1/countOnes;
              }
          }
        }
        array2D[i] = rowEntry;
      }

      let matrix = new Matrix(array2D)
      return matrix.mul(1-alpha);
    }
    catch(error) {
      console.log(error)
    }
}

// Step Two
async function pageRankTwo(matrix) {
    let arr = []
    for(i = 0; i < matrix.rows; i++) {
        let row = []
        for(j = 0; j < matrix.columns; j++) {
            row[j] = alpha/matrix.rows
        }
        arr[i] = row
    }
    
    let alphaMatrix = new Matrix(arr);

    return matrix.add(alphaMatrix)
}

// Steady State calculation
async function pageRankThree(matrix) {
    let vArray = []
    for(i = 0; i < matrix.columns; i++) {
        vArray[i] = 1/matrix.columns
    }
    
    let vector = new Matrix([vArray]);
    let distance = 10;

    index = 0;
    while(distance > threshold) {
        vectorOld = vector
        vector = vector.mmul(matrix);

        distance = 0;
        for(i = 0; i < vector.columns; i++) {
            distance += Math.abs(vector.get(0,i) - vectorOld.get(0,i));
        }
        index++
    }

    return vector
}


const pageRank = async (collection) => {
    let matrix;
    collectionData = await collection.find();

    const m1 = await pageRankOne(matrix, collectionData);
    const m2 = await pageRankTwo(m1);
    const m3 = await pageRankThree(m2)

    let result = new Map();

    for(i = 0; i < m3.columns; i++) {
        const id = collectionData[i].id;
        result.set(id, m3.get(0, i));
    }      

    return result
}

module.exports = pageRank