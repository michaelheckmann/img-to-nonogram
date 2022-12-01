import fs from "fs";
import getPixels from "get-pixels";

const CELL_DIMENSION = 10;

// Load the image and get the pixels
getPixels("img.png", function (err, pixels) {
  if (err) {
    console.log("Bad image path");
    return;
  }

  // We only need the middle pixel of a 10x10 pixel square
  let reducedArray = [];

  const [width, height] = pixels.shape[0];
  //   console.log("width", width, "height", height);

  //   Loop through all the cells and get the middle pixel
  for (let i = 1; i <= height; i++) {
    let row = [];
    for (let j = 1; j <= width; j++) {
      // Only continue if the pixel is a multiple of 5 and not 10
      const isInMiddleVertical = i % CELL_DIMENSION === CELL_DIMENSION / 2;
      const isInMiddleHorizontal = j % CELL_DIMENSION === CELL_DIMENSION / 2;
      if (isInMiddleVertical && isInMiddleHorizontal) {
        // We only need one channel as the image is grayscale
        const r = pixels.get(j, i, 0);
        const isWhite = r === 255;
        row.push(isWhite ? 0 : 1);
      }
    }
    if (row.length > 0) {
      reducedArray.push(row);
    }
  }
  // Hint arrays store the sum of adjacent black pixels
  let rowHints = [];
  let colHints = [];
  let sum = 0;

  // Needed to pad the hints with empty strings
  let maxRowHintLength = 0;
  let maxColHintLength = 0;

  // Loop through the reduced array and get the hints
  for (let i = 0; i < reducedArray.length; i++) {
    let hints = [];
    for (let j = 0; j < reducedArray[i].length; j++) {
      if (reducedArray[i][j] === 1) {
        sum++;
      } else {
        if (sum > 0) {
          hints.push(sum);
          sum = 0;
        }
      }
    }
    //  If the row only has empty cells, we need to add a hint of 0
    if (hints.length === 0) {
      hints.push(0);
    }
    // Store the max hint length
    if (hints.length > maxRowHintLength) {
      maxRowHintLength = hints.length;
    }
    rowHints.push(hints);
  }

  sum = 0;

  for (let i = 0; i < reducedArray[0].length; i++) {
    let hints = [];
    for (let j = 0; j < reducedArray.length; j++) {
      if (reducedArray[j][i] === 1) {
        sum++;
      } else {
        if (sum > 0) {
          hints.push(sum);
          sum = 0;
        }
      }
    }
    if (hints.length === 0) {
      hints.push(0);
    }
    if (hints.length > maxColHintLength) {
      maxColHintLength = hints.length;
    }
    colHints.push(hints);
  }

  // preprend all hints to the same length
  for (let i = 0; i < rowHints.length; i++) {
    while (rowHints[i].length < maxRowHintLength) {
      rowHints[i].unshift("");
    }
  }

  for (let i = 0; i < colHints.length; i++) {
    while (colHints[i].length < maxColHintLength) {
      colHints[i].unshift("");
    }
  }

  // Convert the arrays to CSVs
  const rowHintsString = rowHints.map((row) => row.join(",")).join("\n");
  const colHintsString = colHints.map((row) => row.join(",")).join("\n");

  // Write the CSVs to files
  fs.writeFile("out/rowHints.csv", rowHintsString, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File 'Row Hints' has been created");
    }
  });

  fs.writeFile("out/colHints.csv", colHintsString, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("File 'Col Hints' has been created");
    }
  });
});
