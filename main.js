const board = $('.board')
const btnBox = $('.btn-container')
let rowsNumber;
let colsNumber;

function createBoard(rows, cols) {  
    board.css('display', 'block');
    btnBox.css('display', 'none');
    board.empty()

    rowsNumber = rows
    colsNumber = cols
    for (let i = 0; i < rows; i++) {
        let row = $('<div>').addClass('row')
        for (let j = 0; j < cols; j++) {
            let col = $('<div>').addClass('col hidden').attr('data-row', i).attr('data-col', j);
            if (Math.random() < 0.1) {
                col.addClass('mine');
            }

            row.append(col)

        }

    board.append(row)    

    }
    
}


function gameOver(isWin) {
    let message = null;
    let icon = null;

    if (isWin) {
        message = 'YOU WON!';
        icon = 'fa fa-flag';
    } else {
        message = 'YOU LOST!';
        icon = 'fa fa-bomb';
    }

    $('.col.mine').append($('<i>').addClass(icon));
    $('.col:not(.mine)').html(function() {
        const cell = $(this);
        const count = mineCount(cell.data('row'), cell.data('col'));
        return count === 0 ? '' : count;
    })
    $('.col.hidden').removeClass('hidden');
    setTimeout(function() {
        board.css('display', 'none');
        btnBox.css('display', 'block')
    }, 500);
}


function mineCount(i, j) {
  let count = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= rowsNumber || nj >= colsNumber || nj < 0 || ni < 0) continue;
        const cell = $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
        if (cell.hasClass('mine')) count++;
    }      
  }
  return count;
}

function reveal(oi, oj) {
  const seen = {};

    function helper(i, j) {
        if (i >= rowsNumber || j >= colsNumber || i < 0 || j < 0) return;
        const key = `${i} ${j}`
        if (seen[key]) return;
        const cell =
            $(`.col.hidden[data-row=${i}][data-col=${j}]`);
        const mineCounter = mineCount(i, j);
        if (
            !cell.hasClass('hidden') ||
            cell.hasClass('mine')
        ) {
            return;
        }

        cell.removeClass('hidden');

        if (mineCounter) {
            cell.text(mineCounter);
            return;
        }

        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                helper(i + di, j + dj);
            }      
        }
    }

    helper(oi, oj);
}

board.on('click', '.col.hidden', function() {
    const cell = $(this);
    const row = cell.data('row');
    const col = cell.data('col');

    if (cell.hasClass('mine')) {
        gameOver(false);
    } else {
        reveal(row, col);
        const isGameOver = $('.col.hidden').length === $('.col.mine').length
        if (isGameOver) gameOver(true);
    }
})