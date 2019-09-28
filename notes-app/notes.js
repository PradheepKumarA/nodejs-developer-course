const fs = require('fs');
const chalk = require('chalk');

const readNotes = function() {
    try {
        return JSON.parse(fs.readFileSync('notes.json').toString());
    } catch (error) {
        return [];
    }
}

const writeNotes = function(notesArray) {
    fs.writeFileSync('notes.json', JSON.stringify(notesArray));
}


const addNote = function (title, body) {
    const notesArray = readNotes();
    const filterResult = notesArray.filter(function (note) {
        return note.title == title;
    });

    if(filterResult.length > 0) {
        console.error(chalk.red('Title is already taken!!!'));
        return;
    }
    notesArray.push({
        title: title,
        body: body
    });

    writeNotes(notesArray);
    console.log(chalk.green('Note added'));
}

const removeNode = function (title) {
    const notesArray = readNotes();
    let filterResult = notesArray.filter( function(note) {
        return note.title != title;
    });
    if(filterResult.length < notesArray.length) {
        writeNotes(filterResult);
        console.log(chalk.green('Note removed'));
    } else {
        console.error(chalk.red.inverse('Note not found!!'));
    }
}

module.exports = {
    addNote : addNote,
    removeNode : removeNode
}
