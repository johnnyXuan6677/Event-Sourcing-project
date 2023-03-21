var eventstore = require('eventstore');

var es = eventstore();


var es = require('eventstore')({
    type: 'mongodb',
    host: 'localhost',                          // optional
    port: 27017,                                // optional
    dbName: 'eventstore',                       // optional
    eventsCollectionName: 'events',             // optional
    snapshotsCollectionName: 'snapshots',       // optional
    transactionsCollectionName: 'transactions', // optional
    timeout: 10000                              // optional
    // maxSnapshotsCount: 3                        // optional, defaultly will keep all snapshots
    // authSource: 'authedicationDatabase',        // optional
    // username: 'technicalDbUser',                // optional
    // password: 'secret'                          // optional
    // url: 'mongodb://user:pass@host:port/db?opts // optional
    // positionsCollectionName: 'positions' // optioanl, defaultly wont keep position
  });
  es.on('connect', function() {
    console.log('storage connected');
  });
  es.getEventStream('streamId', function(err, stream) {
    var history = stream.events; // the original event will be in events[i].payload
  
    // myAggregate.loadFromHistory(history);
  });
  es.on('disconnect', function() {
    console.log('connection to storage is gone');
  });