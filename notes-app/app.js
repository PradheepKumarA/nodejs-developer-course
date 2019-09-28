const yargs = require('yargs');
const notes = require('./notes');

yargs.command({
    command :'add',
    describe : 'adding the notes',
    builder : {
        title: {
            describe: "note title",
            type: 'string',
            demandOption: true
        },
        body: {
            describe: "note body",
            type: 'string',
            demandOption: true
        }
    },
    handler : function(args) {
        notes.addNote(args.title, args.body);
    }
})
yargs.command({
    command :'remove',
    describe : 'removing the notes',
    builder : {
        title: {
            describe: 'note title',
            type: 'string',
            demandOption: true
        }
    },
    handler : function(args) {
        notes.removeNode(args.title);
    }
})
yargs.command({
    command :'list',
    describe : 'listing the notes',
    handler : function() {
        console.log('listing')
    }
})
yargs.command({
    command :'read',
    describe : 'reading the notes',
    handler : function() {
        console.log('reading')
    }
})
yargs.parse();
