import { connect, connection } from 'mongoose';

export function Database(): typeof connection {
  connect(process.env.DBURI!, {
    dbName: process.env.DBNAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  connection.on('error', console.error.bind(console, 'Connection error:'));
  connection.once('open', () => {
    console.log('Connected to Database.');
  });
  return connection;
}
